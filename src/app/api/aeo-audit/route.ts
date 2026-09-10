import { NextResponse } from "next/server";
import { lookup } from "dns/promises";
import { analyzeContent } from "@/lib/aeo/analyze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 9000;
const MAX_BYTES = 3_000_000; // ~3MB cap
const MAX_ANALYZE_CHARS = 600_000;

// Best-effort in-memory rate limit (per warm instance). Not bulletproof, but
// enough to blunt casual abuse of a free tool. 10 requests / minute / IP.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const arr = (hits.get(ip) || []).filter((t) => t > windowStart);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // crude memory guard
  return arr.length > 10;
}

function isPrivateIp(ip: string): boolean {
  const v4 = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const a = +v4[1],
      b = +v4[2];
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    return false;
  }
  const h = ip.toLowerCase();
  return h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80");
}

async function assertSafeUrl(raw: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http and https URLs are supported.");
  }
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) {
    throw new Error("That host isn't allowed.");
  }
  // Resolve and reject private/internal addresses (SSRF guard).
  try {
    const { address } = await lookup(host);
    if (isPrivateIp(address)) throw new Error("That host isn't allowed.");
  } catch (e) {
    if (e instanceof Error && e.message.includes("isn't allowed")) throw e;
    throw new Error("Couldn't resolve that domain.");
  }
  return u;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!body.url || typeof body.url !== "string") {
    return NextResponse.json({ ok: false, error: "Please provide a URL." }, { status: 400 });
  }

  let url: URL;
  try {
    url = await assertSafeUrl(body.url);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Invalid URL." },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let html = "";
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "LinkurstAEOAuditBot/1.0 (+https://www.linkurst.com/tools/aeo-content-grader)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `The site returned ${res.status}. It may block bots — try pasting the content instead.`,
        },
        { status: 200 },
      );
    }
    const ctype = res.headers.get("content-type") || "";
    if (!ctype.includes("html") && !ctype.includes("text")) {
      return NextResponse.json(
        { ok: false, error: "That URL isn't an HTML page." },
        { status: 200 },
      );
    }
    // Read with a byte cap.
    const reader = res.body?.getReader();
    if (reader) {
      const chunks: Uint8Array[] = [];
      let total = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          total += value.length;
          if (total > MAX_BYTES) {
            reader.cancel();
            break;
          }
          chunks.push(value);
        }
      }
      html = new TextDecoder("utf-8").decode(concat(chunks));
    } else {
      html = (await res.text()).slice(0, MAX_BYTES);
    }
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      {
        ok: false,
        error: aborted
          ? "The page took too long to load. Try pasting the content instead."
          : "Couldn't reach that page. Check the URL, or paste the content instead.",
      },
      { status: 200 },
    );
  } finally {
    clearTimeout(timeout);
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch
    ? titleMatch[1].replace(/\s+/g, " ").trim().slice(0, 200)
    : url.hostname;

  const result = analyzeContent(html.slice(0, MAX_ANALYZE_CHARS));
  if (!result) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't read enough text from that page (it may be JavaScript-rendered). Try pasting the content instead.",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({ ok: true, url: url.toString(), title, result });
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

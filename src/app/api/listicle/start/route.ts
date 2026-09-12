import { NextResponse, after } from "next/server";
import { hasDataForSeoCredentials } from "@/lib/listicle/dataforseo";
import { createReport, bumpCounter } from "@/lib/listicle/store";
import { processReport, reportPath } from "@/lib/listicle/run";
import { inngest, hasInngest } from "@/lib/inngest/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Free-tool guardrails: cap runs per email and per IP per day so the tool can't
// be abused into a large data-API bill.
const DAY_SECONDS = 60 * 60 * 24;
const MAX_PER_EMAIL_PER_DAY = 10;
const MAX_PER_IP_PER_DAY = 30;

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Kicks off a listicle report. Creates a pending report, hands it to the
 * background pipeline, and returns a token immediately so the UI can show
 * "check your inbox" and link to the (still-generating) report page.
 *
 * Delivery: Inngest in production; an inline `after()` run in local dev when
 * Inngest isn't configured (so the flow is fully testable without an account).
 */
export async function POST(request: Request) {
  let body: {
    keyword?: string;
    website?: string;
    competitors?: string[] | string;
    location?: string;
    industry?: string;
    email?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!body.keyword || typeof body.keyword !== "string" || body.keyword.trim().length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter a keyword." }, { status: 400 });
  }
  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  if (!hasDataForSeoCredentials()) {
    return NextResponse.json(
      { ok: false, error: "The tool isn't fully configured yet. Please try again later." },
      { status: 503 },
    );
  }

  // Rate-limit before doing any paid work.
  const day = new Date().toISOString().slice(0, 10);
  const email = body.email.trim().toLowerCase();
  const [emailCount, ipCount] = await Promise.all([
    bumpCounter(`email:${email}:${day}`, DAY_SECONDS),
    bumpCounter(`ip:${clientIp(request)}:${day}`, DAY_SECONDS),
  ]);
  if (emailCount > MAX_PER_EMAIL_PER_DAY || ipCount > MAX_PER_IP_PER_DAY) {
    return NextResponse.json(
      {
        ok: false,
        error: "You've hit today's free report limit. Please try again tomorrow, or book a call and we'll run it for you.",
      },
      { status: 429 },
    );
  }

  const competitors = Array.isArray(body.competitors)
    ? body.competitors
    : typeof body.competitors === "string"
      ? body.competitors.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

  const report = await createReport({
    keyword: body.keyword.trim(),
    website: typeof body.website === "string" ? body.website : undefined,
    competitors,
    location: typeof body.location === "string" ? body.location : undefined,
    industry: typeof body.industry === "string" ? body.industry : undefined,
    email: body.email.trim(),
  });

  if (hasInngest()) {
    await inngest.send({
      name: "listicle/report.requested",
      data: { reportId: report.id },
    });
  } else {
    // Local-dev fallback: run after the response is sent.
    after(() => processReport(report.id));
  }

  return NextResponse.json({ ok: true, token: report.id, reportUrl: reportPath(report.id) });
}

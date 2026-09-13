import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/listicle/email";
import { bumpCounter } from "@/lib/listicle/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY_SECONDS = 60 * 60 * 24;
const MAX_PER_EMAIL_PER_DAY = 5;
const MAX_PER_IP_PER_DAY = 15;

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; company?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : undefined;

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  if (message.length < 5) {
    return NextResponse.json({ ok: false, error: "Please add a short message." }, { status: 400 });
  }

  // Guardrails so the form can't be abused into a mail flood.
  const day = new Date().toISOString().slice(0, 10);
  const [emailCount, ipCount] = await Promise.all([
    bumpCounter(`contact:email:${email.toLowerCase()}:${day}`, DAY_SECONDS),
    bumpCounter(`contact:ip:${clientIp(request)}:${day}`, DAY_SECONDS),
  ]);
  if (emailCount > MAX_PER_EMAIL_PER_DAY || ipCount > MAX_PER_IP_PER_DAY) {
    return NextResponse.json(
      { ok: false, error: "You've sent a few messages already — we'll be in touch soon." },
      { status: 429 },
    );
  }

  try {
    await sendContactEmail({ name, email, company, message: message.slice(0, 4000) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Couldn't send right now. Please email us directly." },
      { status: 500 },
    );
  }
}

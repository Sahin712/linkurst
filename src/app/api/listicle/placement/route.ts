import { NextResponse } from "next/server";
import { sendPlacementEmail } from "@/lib/listicle/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Placement request from a report. Emails the selected listicles + contact
 * details to Linkurst via Resend (logged to console in dev without a key).
 */
export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
    keyword?: string;
    listicles?: { title?: string; url?: string }[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!body.name || !body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    return NextResponse.json(
      { ok: false, error: "Please add your name and a valid email." },
      { status: 400 },
    );
  }

  const listicles = Array.isArray(body.listicles)
    ? body.listicles
        .filter((l) => l && typeof l.title === "string" && typeof l.url === "string")
        .map((l) => ({ title: l.title as string, url: l.url as string }))
    : [];

  try {
    await sendPlacementEmail({
      name: body.name,
      email: body.email,
      company: typeof body.company === "string" ? body.company : undefined,
      message: typeof body.message === "string" ? body.message : undefined,
      keyword: typeof body.keyword === "string" ? body.keyword : undefined,
      listicles,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not send your request. Please try again." },
      { status: 502 },
    );
  }
}

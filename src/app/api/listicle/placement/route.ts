import { NextResponse } from "next/server";
import {
  sendPlacementEmail,
  sendPlacementConfirmationEmail,
} from "@/lib/listicle/email";

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
    website?: string;
    industry?: string;
    location?: string;
    reportUrl?: string;
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

  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);

  try {
    // Notify Linkurst, and send the visitor a confirmation. Run both; a failure
    // of one shouldn't block the other.
    const results = await Promise.allSettled([
      sendPlacementEmail({
        name: body.name,
        email: body.email,
        company: str(body.company),
        message: str(body.message),
        keyword: str(body.keyword),
        listicles,
      }),
      sendPlacementConfirmationEmail({
        to: body.email,
        name: body.name,
        website: str(body.website),
        keyword: str(body.keyword),
        industry: str(body.industry),
        location: str(body.location),
        reportUrl: str(body.reportUrl),
        listicles,
      }),
    ]);
    // Only fail the request if the internal notification (index 0) failed.
    if (results[0].status === "rejected") throw results[0].reason;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not send your request. Please try again." },
      { status: 502 },
    );
  }
}

import { NextResponse } from "next/server";
import {
  sendPlacementEmail,
  sendPlacementConfirmationEmail,
  siteUrl,
} from "@/lib/listicle/email";
import { createOrder } from "@/lib/listicle/store";
import type { Listicle } from "@/lib/listicle/find";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Placement request from a report. Persists the selected listicles as an order
 * (so the visitor gets a shareable "selected listicles" page), notifies
 * Linkurst, and sends the visitor a confirmation with links to both their
 * selected list and the full research report.
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
    daSource?: "ahrefs" | "dataforseo";
    listicles?: Partial<Listicle>[];
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

  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);

  // Normalize the selected listicles into full records for the order page.
  const listicles: Listicle[] = Array.isArray(body.listicles)
    ? body.listicles
        .filter((l) => l && typeof l.title === "string" && typeof l.url === "string")
        .map((l) => ({
          title: l.title as string,
          url: l.url as string,
          domain: typeof l.domain === "string" ? l.domain : "",
          da: typeof l.da === "number" ? l.da : null,
          pa: typeof l.pa === "number" ? l.pa : null,
          traffic: typeof l.traffic === "number" ? l.traffic : null,
          updated: typeof l.updated === "string" ? l.updated : null,
          bestPosition: typeof l.bestPosition === "number" ? l.bestPosition : 0,
          appearances: typeof l.appearances === "number" ? l.appearances : 1,
          mentionsBrand: typeof l.mentionsBrand === "boolean" ? l.mentionsBrand : null,
          competitorsMentioned: Array.isArray(l.competitorsMentioned)
            ? l.competitorsMentioned.filter((c): c is string => typeof c === "string")
            : [],
        }))
    : [];

  // Persist the order so the visitor has a page of just their selected listicles.
  const order = await createOrder({
    contact: {
      name: body.name,
      email: body.email,
      company: str(body.company),
      message: str(body.message),
    },
    meta: {
      keyword: str(body.keyword),
      website: str(body.website),
      industry: str(body.industry),
      location: str(body.location),
    },
    daSource: body.daSource === "dataforseo" ? "dataforseo" : "ahrefs",
    reportUrl: str(body.reportUrl),
    listicles,
  });

  const selectedUrl = `${siteUrl()}/tools/listicle-finder/order/${order.id}`;
  const emailListicles = listicles.map((l) => ({ title: l.title, url: l.url }));

  try {
    const results = await Promise.allSettled([
      sendPlacementEmail({
        name: body.name,
        email: body.email,
        company: str(body.company),
        message: str(body.message),
        keyword: str(body.keyword),
        listicles: emailListicles,
        selectedUrl,
      }),
      sendPlacementConfirmationEmail({
        to: body.email,
        name: body.name,
        website: str(body.website),
        keyword: str(body.keyword),
        industry: str(body.industry),
        location: str(body.location),
        selectedUrl,
        reportUrl: str(body.reportUrl),
        count: listicles.length,
      }),
    ]);
    if (results[0].status === "rejected") throw results[0].reason;
    return NextResponse.json({ ok: true, orderUrl: selectedUrl });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not send your request. Please try again." },
      { status: 502 },
    );
  }
}

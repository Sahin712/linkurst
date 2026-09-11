import { NextResponse } from "next/server";
import { findListicles } from "@/lib/listicle/find";
import { hasDataForSeoCredentials, DataForSeoError } from "@/lib/listicle/dataforseo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // generous for local/dev; async delivery comes in phase 2

export async function POST(request: Request) {
  let body: {
    keyword?: string;
    website?: string;
    competitors?: string[] | string;
    location?: string;
    industry?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!body.keyword || typeof body.keyword !== "string" || body.keyword.trim().length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please provide a keyword." },
      { status: 400 },
    );
  }

  if (!hasDataForSeoCredentials()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "DataForSEO credentials are not set. Add DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD to .env.local, then restart the dev server.",
      },
      { status: 500 },
    );
  }

  const competitors = Array.isArray(body.competitors)
    ? body.competitors
    : typeof body.competitors === "string"
      ? body.competitors.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

  try {
    const result = await findListicles({
      keyword: body.keyword,
      website: typeof body.website === "string" ? body.website : undefined,
      competitors,
      location: typeof body.location === "string" ? body.location : undefined,
      industry: typeof body.industry === "string" ? body.industry : undefined,
    });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    if (e instanceof DataForSeoError) {
      // Surface the real account-side problem instead of an empty result.
      let error = e.message;
      if (e.code === 40104) {
        error =
          "DataForSEO account not verified for API access. Complete verification in the DataForSEO dashboard (app.dataforseo.com), then try again.";
      } else if (e.code === 40201) {
        error =
          "DataForSEO has temporarily paused this account for review. Contact support@dataforseo.com to restore access.";
      } else if (e.code === 40200) {
        error =
          "DataForSEO balance is too low to run the search. Top up the account, then try again.";
      } else if (e.code === 40100 || e.code === 40101 || e.code === 40103) {
        error = "DataForSEO authentication failed. Check DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD.";
      }
      return NextResponse.json({ ok: false, error, code: e.code }, { status: 502 });
    }
    const msg = e instanceof Error ? e.message : "Something went wrong.";
    const configErr = msg.includes("credentials are not configured");
    return NextResponse.json(
      {
        ok: false,
        error: configErr
          ? "DataForSEO credentials are not set. Add DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD to .env.local."
          : "The search failed. Please try again.",
      },
      { status: configErr ? 500 : 200 },
    );
  }
}

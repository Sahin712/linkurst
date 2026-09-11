import { NextResponse } from "next/server";
import { getReport } from "@/lib/listicle/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Poll endpoint for the report page: returns just the status of a report. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const rec = await getReport(token);
  if (!rec) {
    return NextResponse.json({ ok: false, status: "missing" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, status: rec.status, error: rec.error ?? null });
}

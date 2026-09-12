/**
 * Runs a stored listicle report to completion: discovery → save → email. Shared
 * by the Inngest background function (production) and the inline `after()`
 * fallback (local dev without Inngest). Idempotent-ish: it no-ops if the report
 * is missing or already finished.
 */

import { findListicles } from "./find";
import { dataForSeoErrorMessage } from "./dataforseo";
import {
  getReport,
  saveReport,
  findSignature,
  getCachedFind,
  setCachedFind,
} from "./store";
import { sendReportReadyEmail, siteUrl } from "./email";

export function reportPath(id: string): string {
  return `/tools/listicle-finder/${id}`;
}

export async function processReport(reportId: string): Promise<void> {
  const rec = await getReport(reportId);
  if (!rec || rec.status !== "pending") return;

  try {
    // Reuse an identical recent search when one exists — a free tool shouldn't
    // re-pay the data APIs for the same query. Falls through to a live run.
    const sig = findSignature(rec.input);
    let result = await getCachedFind(sig);
    if (!result) {
      result = await findListicles({
        keyword: rec.input.keyword,
        website: rec.input.website,
        competitors: rec.input.competitors,
        location: rec.input.location,
        industry: rec.input.industry,
      });
      await setCachedFind(sig, result);
    }
    await saveReport({ ...rec, status: "done", result, completedAt: Date.now() });
    await sendReportReadyEmail({
      to: rec.input.email,
      keyword: rec.input.keyword,
      reportUrl: `${siteUrl()}${reportPath(reportId)}`,
      totals: {
        listicles: result.totals.listicles,
        gaps: result.totals.gaps,
        avgDa: result.totals.avgDa,
      },
    });
  } catch (e) {
    await saveReport({
      ...rec,
      status: "error",
      error: dataForSeoErrorMessage(e),
      completedAt: Date.now(),
    });
  }
}

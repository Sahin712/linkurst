import { Inngest } from "inngest";

/** Inngest client for Linkurst background jobs. */
export const inngest = new Inngest({ id: "linkurst" });

/** True when Inngest is configured to run jobs (prod). Otherwise the app falls
 *  back to running the report inline after the response (local dev). */
export function hasInngest(): boolean {
  return !!process.env.INNGEST_EVENT_KEY;
}

export type ListicleReportRequested = {
  name: "listicle/report.requested";
  data: { reportId: string };
};

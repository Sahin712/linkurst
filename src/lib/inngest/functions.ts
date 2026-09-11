import { inngest } from "./client";
import { processReport } from "@/lib/listicle/run";

/**
 * Background job: given a report token, run discovery, store the result, and
 * email the visitor. Retries on transient failure; the runner itself records a
 * user-facing error on the report if discovery ultimately fails.
 */
export const generateListicleReport = inngest.createFunction(
  {
    id: "generate-listicle-report",
    retries: 2,
    triggers: [{ event: "listicle/report.requested" }],
  },
  async ({ event, step }) => {
    const reportId = event.data.reportId as string;
    await step.run("process-report", () => processReport(reportId));
    return { reportId };
  },
);

export const functions = [generateListicleReport];

import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { functions } from "@/lib/inngest/functions";

export const runtime = "nodejs";
// A report step (SERP + crawl) can run long; use the max the plan allows.
// Hobby caps at 60s; raise to 300 once on Vercel Pro.
export const maxDuration = 60;

// Inngest endpoint. Register this URL (…/api/inngest) in the Inngest dashboard,
// or point the local Inngest Dev Server at it, to run background jobs.
export const { GET, POST, PUT } = serve({ client: inngest, functions });

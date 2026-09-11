import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { functions } from "@/lib/inngest/functions";

export const runtime = "nodejs";

// Inngest endpoint. Register this URL (…/api/inngest) in the Inngest dashboard,
// or point the local Inngest Dev Server at it, to run background jobs.
export const { GET, POST, PUT } = serve({ client: inngest, functions });

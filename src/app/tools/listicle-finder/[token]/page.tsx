import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ListicleReport } from "@/components/tools/listicle-report";
import { ReportPending } from "@/components/tools/report-pending";
import { getReport } from "@/lib/listicle/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Listicle Report",
  robots: { index: false, follow: false },
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const rec = await getReport(token);

  return (
    <section className="py-12 sm:py-16">
      <Container size="default">
        <div className="mx-auto max-w-5xl">
          {!rec ? (
            <ReportMessage
              title="Report not found"
              body="This report link is invalid or has expired. Reports are kept for 30 days."
            />
          ) : rec.status === "error" ? (
            <ReportMessage
              title="We hit a snag"
              body={rec.error || "The search failed. Please try running the tool again."}
            />
          ) : rec.status === "pending" || !rec.result ? (
            <ReportPending token={token} keyword={rec.input.keyword} />
          ) : (
            <ListicleReport result={rec.result} generatedAt={rec.completedAt} />
          )}
        </div>
      </Container>
    </section>
  );
}

function ReportMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-border bg-surface p-8 text-center shadow-[var(--shadow-panel)] sm:p-10">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-wash text-coral-600">
        <AlertCircle size={24} />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-fog">{body}</p>
      <Button href="/tools/listicle-finder" size="lg" className="mt-6">
        <ArrowLeft size={18} />
        Back to Listicle Finder
      </Button>
      <p className="mt-4">
        <Link
          href="/tools/listicle-finder/example"
          className="text-[13px] text-coral-600 underline decoration-coral/30 underline-offset-2 hover:decoration-coral"
        >
          See an example report
        </Link>
      </p>
    </div>
  );
}

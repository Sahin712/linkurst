import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/lib/listicle/store";
import {
  freshness,
  opportunityScore,
  tierOf,
  drStyle,
  paStyle,
} from "@/lib/listicle/score";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Selected Listicles",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return (
      <section className="py-12 sm:py-16">
        <Container size="default">
          <div className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-border bg-surface p-8 text-center shadow-[var(--shadow-panel)] sm:p-10">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-wash text-coral-600">
              <AlertCircle size={24} />
            </span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
              Request not found
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-fog">
              This link is invalid or has expired. Placement requests are kept for 30 days.
            </p>
            <Button href="/tools/listicle-finder" size="lg" className="mt-6">
              <ArrowLeft size={18} />
              Back to Listicle Finder
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const drLabel = order.daSource === "ahrefs" ? "DR" : "DA";
  const meta = [
    { label: "Website", value: order.meta.website },
    { label: "Keyword", value: order.meta.keyword },
    { label: "Industry", value: order.meta.industry },
    { label: "Location", value: order.meta.location },
  ].filter((r) => r.value);

  return (
    <section className="py-12 sm:py-16">
      <Container size="default">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* header */}
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-panel)] sm:p-8">
            <p className="eyebrow-mono text-coral">Placement request received</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Selected listicles
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-fog">
              {order.contact.name.split(" ")[0]}, here are the{" "}
              <span className="font-semibold text-foreground">{order.listicles.length}</span>{" "}
              listicle{order.listicles.length === 1 ? "" : "s"} you selected for placement. Our team
              is reviewing them.
            </p>

            {meta.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 font-[family-name:var(--font-mono)] text-[11px] text-muted">
                {meta.map((r) => (
                  <span key={r.label} className="rounded-full border border-border px-2.5 py-1">
                    {r.label}: {r.value}
                  </span>
                ))}
              </div>
            )}

            {order.reportUrl && (
              <a
                href={order.reportUrl}
                className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-coral-600 hover:text-coral"
              >
                <ExternalLink size={14} />
                View full research report
              </a>
            )}
          </div>

          {/* table */}
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-foreground/[0.015] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
                    <th className="px-4 py-3 font-medium">Listicle</th>
                    <th className="px-3 py-3 text-center font-medium">{drLabel}</th>
                    <th className="px-3 py-3 text-center font-medium">PA</th>
                    <th className="px-3 py-3 text-center font-medium">Rank</th>
                    <th className="px-3 py-3 font-medium">Freshness</th>
                    <th className="px-4 py-3 font-medium">Opportunity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.listicles.map((l) => {
                    const fresh = freshness(l.updated);
                    const score = opportunityScore(l);
                    const tier = tierOf(score);
                    return (
                      <tr key={l.url} className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3">
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-start gap-1 font-semibold text-foreground hover:text-coral-600"
                          >
                            {l.title}
                            <ArrowUpRight size={13} className="mt-0.5 shrink-0 text-muted" />
                          </a>
                          {l.domain && (
                            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10.5px] text-muted">
                              {l.domain}
                            </p>
                          )}
                        </td>
                        <td className="px-3 py-3 align-middle text-center">
                          <span
                            style={drStyle(l.da)}
                            className="inline-block min-w-9 rounded-md px-2 py-1 text-[13px] font-bold tabular-nums text-foreground"
                          >
                            {l.da ?? "—"}
                          </span>
                        </td>
                        <td className="px-3 py-3 align-middle text-center">
                          <span
                            style={paStyle(l.pa)}
                            className="inline-block min-w-9 rounded-md px-2 py-1 text-[13px] font-bold tabular-nums text-foreground"
                          >
                            {l.pa ?? "—"}
                          </span>
                        </td>
                        <td className="px-3 py-3 align-middle text-center font-[family-name:var(--font-mono)] text-[12px] text-fog">
                          {l.bestPosition > 0 ? `#${l.bestPosition}` : "—"}
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 text-[12px] font-medium",
                              fresh.tone === "fresh"
                                ? "text-coral-600"
                                : fresh.tone === "aging"
                                  ? "text-foreground"
                                  : "text-muted",
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                fresh.tone === "fresh"
                                  ? "bg-coral"
                                  : fresh.tone === "aging"
                                    ? "bg-slate"
                                    : "bg-border",
                              )}
                            />
                            {fresh.label}
                          </span>
                          {l.updated && (
                            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                              {l.updated}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[13px] font-bold tabular-nums",
                                tier === "High"
                                  ? "bg-coral text-white"
                                  : tier === "Medium"
                                    ? "bg-coral-wash text-coral-600"
                                    : "border border-border text-muted",
                              )}
                            >
                              {score}
                            </span>
                            <span
                              className={cn(
                                "text-[12px] font-semibold",
                                tier === "High"
                                  ? "text-coral-600"
                                  : tier === "Medium"
                                    ? "text-foreground"
                                    : "text-muted",
                              )}
                            >
                              {tier}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="px-1 text-[12px] leading-relaxed text-muted">
            Need to change your selection? Reply to your confirmation email and we&rsquo;ll update it.
          </p>

          <div className="pt-2">
            <Link
              href="/tools/listicle-finder"
              className="inline-flex items-center gap-1.5 text-[13px] text-fog hover:text-foreground"
            >
              <ArrowLeft size={15} />
              Back to Listicle Finder
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

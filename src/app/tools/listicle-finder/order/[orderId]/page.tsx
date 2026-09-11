import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ArrowLeft, ArrowUpRight, ExternalLink, ListChecks } from "lucide-react";
import brandMark from "../../../../../../public/brand/Linkurst_Logo_V10-removebg-preview.png";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/lib/listicle/store";
import { freshness, opportunityScore, tierOf, rankStyle } from "@/lib/listicle/score";
import { ScoreRing, TrafficMeter } from "@/components/tools/metric-cells";
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
  const maxTraffic = Math.max(1, ...order.listicles.map((l) => l.traffic ?? 0));
  const meta = [
    { label: "Website", value: order.meta.website },
    { label: "Keyword", value: order.meta.keyword },
    { label: "Industry", value: order.meta.industry },
    { label: "Location", value: order.meta.location },
  ].filter((r) => r.value);

  const daVals = order.listicles.map((l) => l.da).filter((d): d is number => d != null);
  const avgDa = daVals.length
    ? Math.round(daVals.reduce((s, d) => s + d, 0) / daVals.length)
    : null;
  const primeTargets = order.listicles.filter((l) => opportunityScore(l) >= 72).length;
  const stats = [
    { n: order.listicles.length, l: "Selected" },
    { n: primeTargets, l: "Prime targets", coral: true },
    { n: avgDa ?? "—", l: `Avg ${drLabel}` },
  ];

  return (
    <section className="py-12 sm:py-16">
      <Container size="default">
        <div className="mx-auto max-w-5xl space-y-4">
          {/* header */}
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-gradient-to-br from-coral-wash/70 via-surface to-surface shadow-[var(--shadow-panel)]">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="eyebrow-mono text-coral">Placement request received</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Selected listicles
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed text-fog">
                  {order.contact.name.split(" ")[0]}, here are the{" "}
                  <span className="font-semibold text-foreground">{order.listicles.length}</span>{" "}
                  listicle{order.listicles.length === 1 ? "" : "s"} you selected for placement. Our
                  team is reviewing them.
                </p>

                {meta.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 font-[family-name:var(--font-mono)] text-[11px] text-muted">
                    {meta.map((r) => (
                      <span key={r.label} className="rounded-full border border-border px-2.5 py-1">
                        {r.label}: {r.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {order.reportUrl && (
                <a
                  href={order.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-coral/40 px-4 text-[13px] font-semibold text-coral-600 transition-colors hover:bg-coral-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <ExternalLink size={15} />
                  View full report
                </a>
              )}
            </div>

            <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-center">
              {stats.map((s) => (
                <div key={s.l} className="px-3 py-4">
                  <p
                    className={
                      "text-2xl font-bold tabular-nums " +
                      (s.coral ? "text-coral-600" : "text-foreground")
                    }
                  >
                    {s.n}
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-wider text-muted">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* table (dashboard window) */}
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-gradient-to-b from-surface to-coral-wash/15 shadow-[var(--shadow-panel)]">
            <div className="flex items-center gap-2 border-b border-border bg-foreground/[0.03] px-4 py-2.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
              <div className="mx-auto flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1">
                <ListChecks size={12} className="text-coral-600" />
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-fog">
                  {order.listicles.length} selected
                </span>
              </div>
              <Image
                src={brandMark}
                alt="Linkurst"
                width={22}
                height={22}
                className="h-5 w-auto opacity-70"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-foreground/[0.015] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
                    <th className="px-4 py-3 font-medium">Listicle</th>
                    <th className="px-3 py-3 text-center font-medium">{drLabel}</th>
                    <th className="px-3 py-3 text-center font-medium">PA</th>
                    <th className="px-3 py-3 text-center font-medium">Traffic</th>
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
                        <td className="px-3 py-3 align-middle">
                          <ScoreRing value={l.da} tone="coral" />
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <ScoreRing value={l.pa} tone="slate" />
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <TrafficMeter value={l.traffic} max={maxTraffic} />
                        </td>
                        <td className="px-3 py-3 align-middle text-center">
                          <span
                            style={rankStyle(l.bestPosition)}
                            className="inline-block min-w-[42px] rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[12px] font-bold text-foreground"
                          >
                            {l.bestPosition > 0 ? `#${l.bestPosition}` : "—"}
                          </span>
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

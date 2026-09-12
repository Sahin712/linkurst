"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Loader2,
  ArrowUpRight,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Gauge,
  FileText,
  Search,
  Clock,
  Users,
  ListChecks,
  Minus,
  BadgeCheck,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import brandMark from "../../../public/brand/Linkurst_Logo_V10-removebg-preview.png";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import type { FindResult, Listicle } from "@/lib/listicle/find";
import { downloadListiclesXlsx } from "@/lib/listicle/xlsx";
import {
  freshness,
  opportunityScore,
  rankStyle,
  relativeAge,
  type FreshTone,
} from "@/lib/listicle/score";
import { ScoreRing, TrafficMeter } from "@/components/tools/metric-cells";
import { ServicesGrid } from "@/components/sections/services";
import { cn } from "@/lib/utils";

function isGap(l: Listicle) {
  return l.mentionsBrand === false && l.competitorsMentioned.length > 0;
}

/** Signal-strength style freshness gauge: 3 bars for Fresh, stepping down. */
function FreshnessBars({ tone }: { tone: FreshTone }) {
  const filled = tone === "fresh" ? 3 : tone === "aging" ? 2 : tone === "stale" ? 1 : 0;
  const color =
    tone === "fresh" ? "bg-coral" : tone === "aging" ? "bg-slate" : "bg-gray";
  const heights = ["h-2", "h-3", "h-[18px]"];
  return (
    <span className="inline-flex items-end gap-[3px]" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-[3.5px] rounded-full",
            h,
            i < filled ? color : "bg-foreground/[0.1]",
          )}
        />
      ))}
    </span>
  );
}

/** Live pulsing beacon — a solid coral dot with a radiating ring. */
function BeaconDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75 motion-reduce:hidden" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
    </span>
  );
}

/**
 * Whether the brand already appears on a listicle. "Not yet" (the placement
 * opportunity — the point of the tool) gets the coral highlight with a live
 * pulsing beacon; "Featured" gets a solid dark badge so it stands apart;
 * unknown stays quiet.
 */
function MentionBadge({ value }: { value: boolean | null }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-[11.5px] font-semibold text-white">
        <Check size={13} strokeWidth={3} />
        Featured
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-coral/40 bg-coral-wash px-3 py-1.5 text-[11.5px] font-semibold text-coral-600">
        <BeaconDot />
        Not yet
      </span>
    );
  }
  return (
    <span
      title="Couldn't read this page — mention unknown"
      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-[11.5px] font-medium text-muted"
    >
      <Minus size={12} />
      Unknown
    </span>
  );
}

export function ListicleReport({ result }: { result: FindResult }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(false);

  // Show every listicle found (the brand's own page is already excluded
  // upstream). Each row is flagged with whether it already mentions the brand,
  // so opportunities (not yet mentioned) and existing features both stay visible.
  const filtered = useMemo(() => {
    const listicles = result.listicles;
    const daValues = listicles
      .map((l) => l.da)
      .filter((d): d is number => d != null);
    const mentioned = listicles.filter((l) => l.mentionsBrand === true).length;
    const opportunities = listicles.filter((l) => l.mentionsBrand !== true).length;
    return {
      ...result,
      listicles,
      totals: {
        listicles: listicles.length,
        featured: mentioned,
        gaps: listicles.filter(isGap).length,
        avgDa: daValues.length
          ? Math.round(daValues.reduce((s, d) => s + d, 0) / daValues.length)
          : null,
      },
      mentioned,
      opportunities,
    };
  }, [result]);

  // Opportunities (not yet mentioned) first, best score on top; listicles that
  // already feature the brand sink to the bottom.
  const rows = useMemo(() => {
    return [...filtered.listicles].sort((a, b) => {
      const am = a.mentionsBrand === true ? 1 : 0;
      const bm = b.mentionsBrand === true ? 1 : 0;
      if (am !== bm) return am - bm;
      return opportunityScore(b) - opportunityScore(a);
    });
  }, [filtered]);

  const maxTraffic = useMemo(
    () => Math.max(1, ...filtered.listicles.map((l) => l.traffic ?? 0)),
    [filtered],
  );

  const drLabel = filtered.daSource === "ahrefs" ? "DR" : "DA";
  const allSelected = selected.size === rows.length && rows.length > 0;

  function toggle(url: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(url)) n.delete(url);
      else n.add(url);
      return n;
    });
  }
  function toggleAll() {
    setSelected((s) => (s.size === rows.length ? new Set() : new Set(rows.map((r) => r.url))));
  }

  async function download(onlySelected: boolean) {
    setDownloading(true);
    try {
      await downloadListiclesXlsx(filtered, onlySelected ? selected : undefined);
    } finally {
      setDownloading(false);
    }
  }

  const stats = [
    { n: filtered.opportunities, l: "Opportunities", coral: true },
    { n: filtered.mentioned, l: "Already mentioned" },
    { n: filtered.totals.avgDa ?? "—", l: `Avg ${drLabel}` },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* header */}
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-gradient-to-br from-coral-wash/70 via-surface to-surface shadow-[var(--shadow-panel)]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow-mono text-coral">Analysis complete</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Found <span className="text-coral">{filtered.totals.listicles} listicles</span> for
              &ldquo;{result.keyword}&rdquo;
            </h1>
            <div className="mt-3 flex flex-wrap gap-2 font-[family-name:var(--font-mono)] text-[11px] text-muted">
              <span className="rounded-full border border-border px-2.5 py-1">{result.location}</span>
              {result.brandDomain && (
                <span className="rounded-full border border-border px-2.5 py-1">
                  {result.brandDomain}
                </span>
              )}
              {result.industry && (
                <span className="rounded-full border border-border px-2.5 py-1">
                  {result.industry}
                </span>
              )}
              {result.competitors.length > 0 && (
                <span className="rounded-full border border-border px-2.5 py-1">
                  {result.competitors.length} competitors
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => download(false)}
            disabled={downloading}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-coral px-4 text-[13px] font-medium text-white transition-colors hover:bg-coral-600 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            Download .xlsx
          </button>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-center">
          {stats.map((s) => (
            <div key={s.l} className="px-3 py-4">
              <p className={cn("text-2xl font-bold tabular-nums", s.coral ? "text-coral-600" : "text-foreground")}>
                {s.n}
              </p>
              <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-wider text-muted">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-coral/30 bg-gradient-to-br from-coral-wash to-coral-wash/40 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coral text-white shadow-[var(--shadow-card)]">
              <Sparkles size={19} />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                We&rsquo;ll get your brand featured on these listicles
              </h2>
              <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-fog">
                These are the lists AI answers cite and buyers shortlist from. Pick the ones you want
                to be on, hit{" "}
                <span className="font-semibold text-coral-600">Request placement</span>, and we build
                the case to earn your spot.
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-coral/30 bg-surface/70 px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11px] font-medium text-coral-600 sm:inline-flex">
            <Check size={13} />
            {filtered.opportunities} ready to pitch
          </div>
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
              {result.location} · {filtered.totals.listicles} listicles
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
          <table className="w-full min-w-[860px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-foreground/[0.02] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
                <th className="w-10 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                    className="h-4 w-4 accent-coral"
                  />
                </th>
                <th className="px-3 py-3.5 font-medium">Listicle</th>
                <th className="px-3 py-3.5 text-center font-medium">{drLabel}&nbsp;/&nbsp;PA</th>
                <th className="px-3 py-3.5 text-center font-medium">Traffic</th>
                <th className="px-3 py-3.5 text-center font-medium">Rank</th>
                <th className="px-3 py-3.5 text-center font-medium">Mentioned</th>
                <th className="px-4 py-3.5 font-medium">Freshness</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => {
                const on = selected.has(l.url);
                const fresh = freshness(l.updated);
                return (
                  <tr
                    key={l.url}
                    className={cn(
                      "border-b border-border last:border-b-0 transition-colors",
                      on ? "bg-coral-wash/50" : "hover:bg-foreground/[0.015]",
                    )}
                  >
                    <td className="px-4 py-3.5 align-top">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(l.url)}
                        aria-label={`Select ${l.title}`}
                        className="mt-0.5 h-4 w-4 accent-coral"
                      />
                    </td>
                    <td className="px-3 py-3.5 align-top">
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1 font-semibold text-foreground hover:text-coral-600"
                      >
                        {l.title}
                        <ArrowUpRight size={13} className="mt-0.5 shrink-0 text-muted" />
                      </a>
                      <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10.5px] text-muted">
                        {l.domain}
                      </p>
                      {l.competitorsMentioned.length > 0 && (
                        <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                          <span className="text-coral-600/80">vs</span>{" "}
                          {l.competitorsMentioned.slice(0, 3).join(", ")}
                          {l.competitorsMentioned.length > 3
                            ? ` +${l.competitorsMentioned.length - 3}`
                            : ""}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3.5 align-middle">
                      <div className="flex flex-col items-center">
                        <ScoreRing value={l.da} tone="coral" />
                        <span className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                          PA {l.pa ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 align-middle">
                      <TrafficMeter value={l.traffic} max={maxTraffic} />
                    </td>
                    <td className="px-3 py-3.5 align-middle text-center">
                      <span
                        style={rankStyle(l.bestPosition)}
                        className="inline-block min-w-[42px] rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[12px] font-bold text-foreground"
                      >
                        {l.bestPosition > 0 ? `#${l.bestPosition}` : "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 align-middle text-center">
                      <MentionBadge value={l.mentionsBrand} />
                    </td>
                    <td className="px-4 py-3.5 align-middle">
                      <div className="flex items-center gap-2.5">
                        <FreshnessBars tone={fresh.tone} />
                        <div className="leading-tight">
                          <p
                            className={cn(
                              "text-[12px] font-semibold",
                              fresh.tone === "fresh"
                                ? "text-coral-600"
                                : fresh.tone === "aging"
                                  ? "text-foreground"
                                  : "text-muted",
                            )}
                          >
                            {fresh.label}
                          </p>
                          <p
                            className="font-[family-name:var(--font-mono)] text-[10px] text-muted"
                            title={l.updated ?? undefined}
                          >
                            {relativeAge(l.updated) ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* metrics legend */}
      <MetricsLegend drLabel={drLabel} />

      {/* services grid + closing CTA */}
      <div className="pt-16 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-mono flex items-center justify-center gap-2 text-coral">
            <span className="inline-block h-px w-6 bg-coral" />
            Beyond listicles
            <span className="inline-block h-px w-6 bg-coral" />
          </p>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            The full system that gets you{" "}
            <span className="accent-serif font-normal text-coral">discovered</span>
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-fog">
            Listicles are one surface. Linkurst builds visibility across every place buyers and AI
            look for answers.
          </p>
        </div>
        <ServicesGrid className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" />

        {/* small CTA — homepage dark styling, compact */}
        <div
          className="relative mt-8 overflow-hidden rounded-[var(--radius-xl)] border border-coral/25 p-5 shadow-[0_20px_60px_-30px_rgba(232,85,58,0.35)] sm:p-6"
          style={{
            background:
              "radial-gradient(130% 130% at 50% 0%, rgba(232,85,58,0.16) 0%, #17171b 45%, #0e0e11 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full opacity-25 blur-[80px]"
            style={{ background: "var(--color-coral)" }}
          />
          <div className="relative flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-[15px] font-bold tracking-tight text-ivory">
                Want Linkurst to run this for you?
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ivory/70">
                Book a free 30-minute call and we&rsquo;ll map your fastest organic wins.
              </p>
            </div>
            <Button
              href={siteConfig.bookingUrl}
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full shrink-0 sm:w-auto"
            >
              Book a call
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="text-[13.5px] text-fog">
            {selected.size > 0 ? (
              <>
                <span className="font-semibold text-foreground">{selected.size}</span> selected
              </>
            ) : (
              "Select the listicles you want to get on."
            )}
          </p>
          <div className="flex gap-2">
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => download(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium text-fog transition-colors hover:bg-foreground/[0.03]"
              >
                <Download size={15} />
                Export selected
              </button>
            )}
            <button
              type="button"
              onClick={() => setPlaceOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-coral px-4 text-[13px] font-medium text-white transition-colors hover:bg-coral-600"
            >
              Request placement
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {placeOpen && (
        <PlacementModal
          result={filtered}
          selectedUrls={selected}
          onClose={() => setPlaceOpen(false)}
        />
      )}
    </div>
  );
}

const METRICS: {
  icon: typeof Sparkles;
  title: string;
  body: React.ReactNode;
  visual: React.ReactNode;
  highlight?: boolean;
}[] = [
  {
    icon: Gauge,
    title: "DR",
    visual: <ScoreRing value={82} tone="coral" />,
    body: (
      <>
        <a
          href="https://ahrefs.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-coral-600 underline decoration-coral/30 underline-offset-2 hover:decoration-coral"
        >
          Domain Rating by Ahrefs
        </a>{" "}
        — the whole site&rsquo;s authority, 0–100. Higher means a more valuable backlink.
      </>
    ),
  },
  {
    icon: FileText,
    title: "PA",
    visual: (
      <span className="font-[family-name:var(--font-mono)] text-[11px] text-muted">
        PA 46
      </span>
    ),
    body: (
      <>
        Page authority for that specific article, 0–100 — shown under the authority ring. Often
        low for individual blog posts.
      </>
    ),
  },
  {
    icon: Users,
    title: "Traffic",
    visual: <TrafficMeter value={140000} max={160000} />,
    body: <>Estimated monthly organic visits to the site — how many buyers actually see the list.</>,
  },
  {
    icon: BadgeCheck,
    title: "Mentioned",
    visual: (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-coral/40 bg-coral-wash px-3 py-1.5 text-[11.5px] font-semibold text-coral-600">
        <BeaconDot />
        Not yet
      </span>
    ),
    body: (
      <>
        Whether your brand already appears on the list. <strong className="font-semibold text-coral-600">Not yet</strong> is
        the opportunity to chase; <strong className="font-semibold text-foreground">Featured</strong> means you&rsquo;re already
        on it; <strong className="font-semibold text-foreground">Unknown</strong> means we couldn&rsquo;t read the page.
      </>
    ),
  },
  {
    icon: Search,
    title: "Rank",
    visual: (
      <span
        style={rankStyle(3)}
        className="rounded-md px-2.5 py-1 font-[family-name:var(--font-mono)] text-[13px] font-bold text-foreground"
      >
        #3
      </span>
    ),
    body: <>Where the listicle sits in Google for your keyword. Higher rank drives more traffic to you once you&rsquo;re on it.</>,
  },
  {
    icon: Clock,
    title: "Freshness",
    visual: (
      <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-coral-600">
        <FreshnessBars tone="fresh" />
        Fresh
      </span>
    ),
    body: <>How recently the list was updated — the bars step down from <strong className="font-semibold text-foreground">Fresh</strong> to Aging to Stale. Fresher lists are far likelier to add a new tool.</>,
  },
];

function MetricsLegend({ drLabel }: { drLabel: string }) {
  return (
    <div className="pt-8">
      <h3 className="mb-4 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-fog">
        <span className="h-px w-6 bg-coral/40" />
        How to read this report
      </h3>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {METRICS.map((m) => (
          <motion.div
            key={m.title}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            className={cn(
              "rounded-[var(--radius-lg)] border p-5 transition-colors",
              m.highlight
                ? "border-coral/30 bg-gradient-to-br from-coral-wash to-coral-wash/30"
                : "border-border bg-surface hover:border-coral/30",
            )}
          >
            <div className="flex min-h-11 items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                    m.highlight ? "bg-coral text-white" : "bg-coral-wash text-coral-600",
                  )}
                >
                  <m.icon size={15} />
                </span>
                <span className="text-[14px] font-bold text-foreground">
                  {m.title === "DR" ? drLabel : m.title}
                </span>
              </div>
              <div className="shrink-0">{m.visual}</div>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-fog">{m.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function PlacementModal({
  result,
  selectedUrls,
  onClose,
}: {
  result: FindResult;
  selectedUrls: Set<string>;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const chosen = result.listicles.filter((l) => selectedUrls.has(l.url));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/listicle/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company"),
          message: form.get("message"),
          keyword: result.keyword,
          website: result.brandDomain ?? undefined,
          industry: result.industry ?? undefined,
          location: result.location,
          daSource: result.daSource,
          reportUrl: typeof window !== "undefined" ? window.location.href : undefined,
          listicles: chosen,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("sent");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const inputCls =
    "min-h-11 w-full rounded-lg border border-border bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted focus:border-coral/50 focus-visible:ring-2 focus-visible:ring-coral/30";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-panel)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
        >
          <X size={18} />
        </button>

        {status === "sent" ? (
          <div className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-wash text-coral-600">
              <Check size={22} />
            </span>
            <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">Request received</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-fog">
              Linkurst will review {chosen.length > 0 ? `these ${chosen.length} listicles` : "your goals"}{" "}
              and reach out about getting your brand placed.
            </p>
            <Button
              href={siteConfig.bookingUrl}
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full"
            >
              Book a call now
              <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3 className="text-xl font-bold tracking-tight text-foreground">Request placement</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-fog">
              {chosen.length > 0
                ? `Get Linkurst's help landing your brand on the ${chosen.length} listicle${chosen.length > 1 ? "s" : ""} you selected.`
                : "Tell us your goals and we'll find the best placements to chase."}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <input name="name" placeholder="Your name" required className={inputCls} />
              <input name="email" type="email" placeholder="Work email" required className={inputCls} />
              <input name="company" placeholder="Company" className={inputCls} />
              <textarea
                name="message"
                rows={3}
                placeholder="Anything we should know? (optional)"
                className={cn(inputCls, "resize-y py-2.5")}
              />
            </div>
            {error && <p className="mt-3 text-[13px] text-coral-600">{error}</p>}
            <Button
              type="submit"
              size="lg"
              className="mt-5 w-full"
              {...(status === "sending" ? { disabled: true } : {})}
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send request
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

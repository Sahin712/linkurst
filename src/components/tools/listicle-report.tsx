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
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import brandMark from "../../../public/brand/Linkurst_Logo_V10-removebg-preview.png";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import type { FindResult, Listicle } from "@/lib/listicle/find";
import { downloadListiclesXlsx } from "@/lib/listicle/xlsx";
import { freshness, opportunityScore, tierOf } from "@/lib/listicle/score";
import { ScoreRing, TrafficMeter } from "@/components/tools/metric-cells";
import { cn } from "@/lib/utils";

function isGap(l: Listicle) {
  return l.mentionsBrand === false && l.competitorsMentioned.length > 0;
}

export function ListicleReport({ result }: { result: FindResult }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(false);

  // Only listicles that don't already feature the brand — these are the
  // placement opportunities. Featured listicles are excluded entirely.
  const filtered = useMemo(() => {
    const listicles = result.listicles.filter((l) => l.mentionsBrand !== true);
    const daValues = listicles
      .map((l) => l.da)
      .filter((d): d is number => d != null);
    return {
      ...result,
      listicles,
      totals: {
        listicles: listicles.length,
        featured: 0,
        gaps: listicles.filter(isGap).length,
        avgDa: daValues.length
          ? Math.round(daValues.reduce((s, d) => s + d, 0) / daValues.length)
          : null,
      },
    };
  }, [result]);

  // Best pitch targets first (highest opportunity score).
  const rows = useMemo(() => {
    return [...filtered.listicles].sort(
      (a, b) => opportunityScore(b) - opportunityScore(a),
    );
  }, [filtered]);

  const primeTargets = useMemo(
    () => filtered.listicles.filter((l) => opportunityScore(l) >= 72).length,
    [filtered],
  );
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
    { n: filtered.totals.listicles, l: "Opportunities" },
    { n: primeTargets, l: "Prime targets", coral: true },
    { n: filtered.totals.avgDa ?? "—", l: `Avg ${drLabel}` },
  ];

  return (
    <div className="space-y-6 pb-28">
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
            {rows.length} ready to pitch
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
          <table className="w-full min-w-[980px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-foreground/[0.015] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                    className="h-4 w-4 accent-coral"
                  />
                </th>
                <th className="px-3 py-3 font-medium">Listicle</th>
                <th className="px-3 py-3 text-center font-medium">{drLabel}</th>
                <th className="px-3 py-3 text-center font-medium">PA</th>
                <th className="px-3 py-3 text-center font-medium">Traffic</th>
                <th className="px-3 py-3 text-center font-medium">Rank</th>
                <th className="px-3 py-3 font-medium">Freshness</th>
                <th className="px-4 py-3 font-medium">Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => {
                const gap = isGap(l);
                const on = selected.has(l.url);
                const fresh = freshness(l.updated);
                const score = opportunityScore(l);
                const tier = tierOf(score);
                return (
                  <tr
                    key={l.url}
                    className={cn(
                      "border-b border-border last:border-b-0 transition-colors",
                      on ? "bg-coral-wash/50" : "hover:bg-foreground/[0.015]",
                    )}
                  >
                    <td className="px-4 py-3 align-top">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(l.url)}
                        aria-label={`Select ${l.title}`}
                        className="mt-0.5 h-4 w-4 accent-coral"
                      />
                    </td>
                    <td className="px-3 py-3">
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
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wide text-coral-600">
                            Competitors:
                          </span>
                          {l.competitorsMentioned.map((c) => (
                            <span
                              key={c}
                              className="rounded border border-coral/30 bg-coral-wash/40 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9.5px] text-coral-600"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
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

      {/* metrics legend */}
      <MetricsLegend drLabel={drLabel} />

      {/* service CTA */}
      <div className="overflow-hidden rounded-[var(--radius-xl)] bg-charcoal p-7 text-center sm:p-9">
        <p className="eyebrow-mono text-coral">Beyond listicles</p>
        <h3 className="mx-auto mt-2 max-w-xl text-xl font-bold tracking-tight text-white sm:text-2xl">
          Finding the lists is step one. We get you on them, and everywhere else buyers look.
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-[14px] leading-relaxed text-gray">
          Linkurst builds organic visibility across Google, AI search, and Reddit, so your brand is
          the answer whether a person or an AI is asking.
        </p>
        <Button
          href={siteConfig.bookingUrl}
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6"
        >
          Book a strategy call
          <ArrowRight size={18} />
        </Button>
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
    icon: Sparkles,
    title: "Opportunity",
    highlight: true,
    visual: (
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-coral text-[13px] font-bold tabular-nums text-white">
        87
      </span>
    ),
    body: (
      <>
        Our <strong className="font-semibold text-foreground">pitch-priority score</strong> (0–100).
        Blends authority, freshness, and Google rank so you know which listicles to chase first.
      </>
    ),
  },
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
    visual: <ScoreRing value={46} tone="slate" />,
    body: <>Page authority for that specific article, 0–100 — how strong the individual page is.</>,
  },
  {
    icon: Users,
    title: "Traffic",
    visual: <TrafficMeter value={140000} max={160000} />,
    body: <>Estimated monthly organic visits to the site — how many buyers actually see the list.</>,
  },
  {
    icon: Search,
    title: "Rank",
    visual: (
      <span className="rounded-md bg-foreground/[0.05] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[13px] font-bold text-foreground">
        #3
      </span>
    ),
    body: <>Where the listicle sits in Google for your keyword. Higher rank drives more traffic to you once you&rsquo;re on it.</>,
  },
  {
    icon: Clock,
    title: "Freshness",
    visual: (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-coral-600">
        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
        Fresh
      </span>
    ),
    body: <>How recently the list was updated. <strong className="font-semibold text-foreground">Fresh</strong> lists are far likelier to add a new tool.</>,
  },
];

function MetricsLegend({ drLabel }: { drLabel: string }) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-fog">
        <span className="h-px w-6 bg-coral/40" />
        How to read this report
      </h3>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {METRICS.map((m) => (
          <motion.div
            key={m.title}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            className={cn(
              "flex items-center gap-4 rounded-[var(--radius-lg)] border p-4 transition-colors",
              m.highlight
                ? "border-coral/30 bg-gradient-to-br from-coral-wash to-coral-wash/30"
                : "border-border bg-surface hover:border-coral/25",
            )}
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center">{m.visual}</div>
            <div>
              <div className="flex items-center gap-1.5">
                <m.icon size={13} className="text-coral-600" />
                <span className="text-[14px] font-bold text-foreground">
                  {m.title === "DR" ? drLabel : m.title}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-fog">{m.body}</p>
            </div>
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

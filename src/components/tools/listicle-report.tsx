"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Loader2,
  ArrowUpRight,
  Target,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import type { FindResult, Listicle } from "@/lib/listicle/find";
import { downloadListiclesXlsx } from "@/lib/listicle/xlsx";
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

  // Gap-first, then by authority.
  const rows = useMemo(() => {
    return [...filtered.listicles].sort((a, b) => {
      const g = Number(isGap(b)) - Number(isGap(a));
      if (g !== 0) return g;
      return (b.da ?? 0) - (a.da ?? 0);
    });
  }, [filtered]);

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
    { n: filtered.totals.listicles, l: "Listicles" },
    { n: filtered.totals.gaps, l: "Placement gaps", coral: true },
    { n: filtered.totals.avgDa ?? "—", l: `Avg ${drLabel}` },
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* header */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-panel)]">
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

      {/* search results heading */}
      <div className="pt-2">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Search results</h2>
        <p className="mt-1 text-[14px] leading-relaxed text-fog">
          Want your brand featured in these listicles? Select and request placement.
        </p>
      </div>

      {/* table */}
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-border font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
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
                <th className="px-3 py-3 font-medium">{drLabel}</th>
                <th className="px-3 py-3 font-medium">PA</th>
                <th className="px-3 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => {
                const gap = isGap(l);
                const on = selected.has(l.url);
                return (
                  <tr
                    key={l.url}
                    className={cn(
                      "border-b border-border last:border-b-0 transition-colors",
                      gap && "bg-coral-wash/25",
                      on && "bg-coral-wash/50",
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
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {l.competitorsMentioned.map((c) => (
                            <span
                              key={c}
                              className="rounded border border-border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9.5px] text-fog"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 align-top tabular-nums text-fog">{l.da ?? "—"}</td>
                    <td className="px-3 py-3 align-top tabular-nums text-fog">{l.pa ?? "—"}</td>
                    <td className="px-3 py-3 align-top font-[family-name:var(--font-mono)] text-[11px] text-muted">
                      {l.updated ?? "—"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {gap ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-coral/40 bg-surface px-2 py-0.5 text-[11px] font-semibold text-coral-600">
                          <Target size={11} />
                          Gap
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted">
                          Not on it
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* attribution */}
      <p className="px-1 text-[12px] leading-relaxed text-muted">
        {drLabel} ={" "}
        <a
          href="https://ahrefs.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-coral-600 underline decoration-coral/30 underline-offset-2 hover:decoration-coral"
        >
          Domain Rating by Ahrefs
        </a>
        . PA is a page-authority estimate. Gaps are listicles that rank your competitors but not you.
      </p>

      {/* sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
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
          listicles: chosen.map((l) => ({ title: l.title, url: l.url })),
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

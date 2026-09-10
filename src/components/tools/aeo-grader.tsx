"use client";

import { useState } from "react";
import {
  Check,
  AlertTriangle,
  X,
  ArrowRight,
  Sparkles,
  Link2,
  ClipboardPaste,
  Loader2,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import {
  analyzeContent,
  type GradeResult,
  type CheckStatus,
  type Pillar,
} from "@/lib/aeo/analyze";
import { cn } from "@/lib/utils";

const EXAMPLE = `# How does answer engine optimization (AEO) work?

AEO is the practice of structuring content so AI assistants like ChatGPT and Perplexity cite it as the answer. In short: you write the clearest, most extractable answer to a question your buyers actually ask.

## What makes content citable?

Models favor pages that answer directly, use clear headings, and back claims with specifics. In 2026, structured, well-sourced pages earn the most citations.

- Lead with a 2–3 sentence answer
- Use question-based H2s
- Add concrete numbers and dates
- Include FAQ schema

## Why does it matter now?

Roughly 60% of searches now end without a click. If the AI answer doesn't cite you, you're invisible, no matter how well you rank.`;

const STATUS_STYLE: Record<CheckStatus, { icon: typeof Check; ring: string }> = {
  pass: { icon: Check, ring: "bg-coral text-white" },
  warn: { icon: AlertTriangle, ring: "bg-coral-wash text-coral-600" },
  fail: { icon: X, ring: "bg-foreground/10 text-foreground" },
};

function ScoreDial({ score, grade }: { score: number; grade: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--color-coral)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - score / 100)}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums text-foreground">{score}</span>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-muted">
          Grade {grade}
        </span>
      </div>
    </div>
  );
}

function PillarCard({
  p,
  checks,
}: {
  p: Pillar;
  checks: GradeResult["checks"];
}) {
  const pct = Math.round((p.score / p.max) * 100);
  const pass = checks.filter((c) => c.status === "pass").length;
  const warn = checks.filter((c) => c.status === "warn").length;
  const fail = checks.filter((c) => c.status === "fail").length;
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-semibold text-foreground">{p.label}</span>
        <span className="text-lg font-bold tabular-nums text-foreground">
          {pct}
          <span className="text-[11px] font-normal text-muted">%</span>
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
        <div
          className={cn(
            "h-full rounded-full",
            pct >= 70 ? "bg-coral" : pct >= 45 ? "bg-coral/60" : "bg-coral/35",
          )}
          style={{ width: `${pct}%`, transition: "width 900ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </div>
      <div className="mt-3 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[10px] text-muted">
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" />
          {pass}
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-coral/40" />
          {warn}
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
          {fail}
        </span>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 px-3 py-3 text-center">
      <p className="text-xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-wider text-muted">
        {label}
      </p>
    </div>
  );
}

function CheckCard({ c }: { c: GradeResult["checks"][number] }) {
  const s = STATUS_STYLE[c.status];
  const Icon = s.icon;
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-surface p-4">
      <span
        className={cn(
          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
          s.ring,
        )}
      >
        <Icon size={13} strokeWidth={2.5} />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-[15px] font-semibold text-foreground">{c.label}</h4>
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-muted">
            {c.score}/{c.max}
          </span>
        </div>
        <p className="mt-1 text-[13.5px] leading-relaxed text-fog">{c.detail}</p>
        {c.status !== "pass" && (
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            <span className="font-semibold text-coral-600">Fix:</span> {c.tip}
          </p>
        )}
      </div>
    </div>
  );
}

type Mode = "url" | "paste";

export function AeoGrader() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  function reset() {
    setResult(null);
    setError(null);
    setTouched(false);
  }

  async function downloadPdf() {
    if (!result) return;
    setPdfLoading(true);
    try {
      const { downloadReportPdf } = await import("@/lib/aeo/pdf");
      downloadReportPdf(result, { source: sourceLabel || "content" });
    } catch {
      setError("Couldn't generate the PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }

  function gradeText() {
    setTouched(true);
    setError(null);
    const r = analyzeContent(text);
    setResult(r);
    setSourceLabel(r ? "Pasted content" : null);
  }

  async function auditUrl() {
    const raw = url.trim();
    if (!raw) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const res = await fetch("/api/aeo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Something went wrong. Try again.");
      } else {
        setResult(data.result);
        setSourceLabel(data.title || data.url);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const tab = (m: Mode, icon: typeof Link2, label: string) => {
    const Icon = icon;
    const active = mode === m;
    return (
      <button
        type="button"
        onClick={() => {
          setMode(m);
          reset();
        }}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          active
            ? "bg-coral text-white"
            : "border border-border text-fog hover:bg-foreground/[0.03]",
        )}
      >
        <Icon size={15} />
        {label}
      </button>
    );
  };

  return (
    <div className="mt-10">
      {/* mode tabs */}
      <div className="flex gap-2">
        {tab("url", Link2, "Audit a URL")}
        {tab("paste", ClipboardPaste, "Paste content")}
      </div>

      {/* input card */}
      <div className="mt-3 rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow-panel)] sm:p-6">
        {mode === "url" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              auditUrl();
            }}
          >
            <label
              htmlFor="aeo-url"
              className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-muted"
            >
              Page URL
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="aeo-url"
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourdomain.com/blog/post"
                className="min-h-12 w-full rounded-lg border border-border bg-background px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted focus:border-coral/50 focus-visible:ring-2 focus-visible:ring-coral/30"
              />
              <Button
                type="submit"
                size="lg"
                className="w-full shrink-0 sm:w-auto"
                {...(!url.trim() || loading ? { disabled: true } : {})}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Auditing…
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Audit page
                  </>
                )}
              </Button>
            </div>
            <p className="mt-3 font-[family-name:var(--font-mono)] text-[11px] text-muted">
              We fetch the live page&rsquo;s HTML and grade it. JS-rendered pages may read
              thin, use paste mode if so.
            </p>
          </form>
        ) : (
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="aeo-input"
                className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-muted"
              >
                Paste your content (text or HTML)
              </label>
              <button
                type="button"
                onClick={() => {
                  setText(EXAMPLE);
                  reset();
                }}
                className="rounded-sm font-[family-name:var(--font-mono)] text-[11px] font-medium text-coral-600 underline decoration-coral/30 underline-offset-2 transition-colors hover:decoration-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Try an example
              </button>
            </div>
            <textarea
              id="aeo-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={9}
              placeholder="Paste a blog post, landing page copy, or the HTML source of a page you want AI to cite…"
              className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-[15px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted focus:border-coral/50 focus-visible:ring-2 focus-visible:ring-coral/30"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-[family-name:var(--font-mono)] text-[11px] text-muted">
                {text.trim()
                  ? `${text.trim().split(/\s+/).length} words`
                  : "Runs in your browser · nothing is uploaded"}
              </p>
              <Button
                onClick={gradeText}
                size="lg"
                className="w-full sm:w-auto"
                {...(!text.trim() ? { disabled: true } : {})}
              >
                <Sparkles size={18} />
                Grade my content
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* error */}
      {error && (
        <p className="mt-6 rounded-lg border border-coral/30 bg-coral-wash/40 px-4 py-3 text-[14px] text-fog">
          {error}
        </p>
      )}

      {/* invalid paste */}
      {mode === "paste" && touched && !result && !error && (
        <p className="mt-6 rounded-lg border border-border bg-surface px-4 py-3 text-[14px] text-fog">
          Add a bit more text (at least a couple of sentences) and try again.
        </p>
      )}

      {/* ---------- dashboard report ---------- */}
      {result && (() => {
        const counts = {
          pass: result.checks.filter((c) => c.status === "pass").length,
          warn: result.checks.filter((c) => c.status === "warn").length,
          fail: result.checks.filter((c) => c.status === "fail").length,
        };
        return (
        <div className="mt-8 space-y-4">
          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow-mono text-muted">Your AEO report</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={downloadPdf}
                {...(pdfLoading ? { disabled: true } : {})}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-coral px-4 text-[13px] font-medium text-white transition-colors hover:bg-coral-600 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {pdfLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Download size={15} />
                )}
                Download PDF
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium text-fog transition-colors hover:bg-foreground/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <RefreshCw size={15} />
                New audit
              </button>
            </div>
          </div>

          {/* hero: score + verdict + status strip */}
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-panel)]">
            <div className="grid gap-5 p-6 sm:grid-cols-[auto_1fr] sm:gap-8">
              <div className="flex justify-center">
                <ScoreDial score={result.score} grade={result.grade} />
              </div>
              <div className="min-w-0 self-center">
                <p className="eyebrow-mono text-coral">AEO readiness report</p>
                {sourceLabel && (
                  <p className="mt-1 truncate font-[family-name:var(--font-mono)] text-[11px] text-muted">
                    {sourceLabel}
                  </p>
                )}
                <p className="mt-2 text-xl font-semibold leading-snug text-foreground">
                  {result.summary}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-center">
              {[
                { n: counts.pass, l: "Passing", c: "text-coral-600" },
                { n: counts.warn, l: "To improve", c: "text-foreground" },
                { n: counts.fail, l: "To fix", c: "text-foreground" },
              ].map((s) => (
                <div key={s.l} className="px-3 py-3.5">
                  <p className={cn("text-2xl font-bold tabular-nums", s.c)}>{s.n}</p>
                  <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-wider text-muted">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* pillar cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {result.pillars.map((p) => (
              <PillarCard
                key={p.id}
                p={p}
                checks={result.checks.filter((c) => c.pillar === p.id)}
              />
            ))}
          </div>

          {/* content metrics */}
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-6">
            <p className="eyebrow-mono text-muted">Content metrics</p>
            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
              <Stat value={result.stats.words} label="Words" />
              <Stat value={result.stats.headings} label="Headings" />
              <Stat value={result.stats.questionHeadings} label="Questions" />
              <Stat value={result.stats.lists} label="Lists" />
              <Stat value={result.stats.links} label="Links" />
              <Stat value={result.stats.numbers} label="Data pts" />
              <Stat value={result.stats.hasSchema ? "Yes" : "No"} label="Schema" />
              <Stat value={`${result.stats.readingMinutes}m`} label="Read" />
            </div>
          </div>

          {/* priority action plan */}
          {result.priorities.length > 0 && (
            <div className="rounded-[var(--radius-xl)] border border-coral/25 bg-coral-wash/30 p-6">
              <p className="eyebrow-mono text-coral">Priority fixes: start here</p>
              <ol className="mt-4 space-y-4">
                {result.priorities.map((c, i) => (
                  <li key={c.id} className="flex gap-3.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-coral text-[13px] font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <h3 className="text-[15px] font-semibold text-foreground">
                          {c.label}
                        </h3>
                        <span className="rounded-full bg-coral-wash px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-coral-600">
                          +{c.max - c.score} pts
                        </span>
                      </div>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-fog">{c.tip}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* full breakdown, grouped by pillar */}
          <div className="pt-2">
            <p className="eyebrow-mono px-1 text-muted">Full breakdown</p>
            <div className="mt-4 space-y-6">
              {result.pillars.map((p) => (
                <div key={p.id}>
                  <div className="mb-2.5 flex items-center gap-3 px-1">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                      {p.label}
                    </h3>
                    <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-muted">
                      {p.score}/{p.max}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.checks
                      .filter((c) => c.pillar === p.id)
                      .map((c) => (
                        <CheckCard key={c.id} c={c} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* soft CTA */}
          <div className="mt-4 flex flex-col items-center gap-4 rounded-[var(--radius-xl)] border border-coral/25 bg-coral-wash/40 p-6 text-center">
            <p className="max-w-md text-[15px] leading-relaxed text-fog">
              Want Linkurst to turn your content into the{" "}
              <span className="font-semibold text-foreground">cited answer</span> across Google, AI
              search, and Reddit?
            </p>
            <Button
              href={siteConfig.bookingUrl}
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a strategy call
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
        );
      })()}
    </div>
  );
}

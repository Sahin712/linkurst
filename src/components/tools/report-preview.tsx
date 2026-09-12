"use client";

import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { ScoreRing, TrafficMeter } from "@/components/tools/metric-cells";
import { rankStyle } from "@/lib/listicle/score";
import { cn } from "@/lib/utils";

type Fresh = "fresh" | "aging" | "stale";
type Row = {
  title: string;
  domain: string;
  author?: string;
  competitors?: string[];
  da: number;
  pa: number;
  traffic: number;
  rank: number;
  mentioned: boolean;
  aiCited?: boolean;
  fresh: Fresh;
  age: string;
};

/** Compact preview mirroring the real report (CRM software example). */
const ROWS: Row[] = [
  { title: "12 Best CRM Software, Ranked (2026)", domain: "saasreview.io", author: "Priya Nair", competitors: ["salesforce.com", "hubspot.com"], da: 76, pa: 41, traffic: 184000, rank: 2, mentioned: false, aiCited: true, fresh: "fresh", age: "new" },
  { title: "The Best CRM Platforms I Tested in 2026", domain: "techtested.com", author: "Marcus Lee", competitors: ["hubspot.com", "zoho.com"], da: 71, pa: 55, traffic: 96000, rank: 4, mentioned: false, aiCited: true, fresh: "fresh", age: "new" },
  { title: "Top 10 CRM Tools Compared", domain: "comparehub.com", author: "Dana Whitfield", competitors: ["salesforce.com"], da: 59, pa: 44, traffic: 41000, rank: 6, mentioned: false, fresh: "fresh", age: "1mo ago" },
  { title: "Enterprise CRM Platforms Reviewed", domain: "enterprisetech.com", author: "Sam Okoro", competitors: ["salesforce.com"], da: 73, pa: 52, traffic: 118000, rank: 15, mentioned: false, fresh: "fresh", age: "3mo ago" },
  { title: "Best CRM Tools for Sales Teams", domain: "salesstack.com", da: 51, pa: 31, traffic: 16000, rank: 12, mentioned: false, fresh: "stale", age: "2y ago" },
  { title: "Affordable CRM Software Options", domain: "budgetsaas.com", da: 44, pa: 27, traffic: 8400, rank: 14, mentioned: false, fresh: "aging", age: "1.3y ago" },
  { title: "Best CRM for Startups (SoftwareWorld)", domain: "softwareworld.co", competitors: ["hubspot.com"], da: 62, pa: 35, traffic: 38000, rank: 3, mentioned: true, aiCited: true, fresh: "fresh", age: "new" },
  { title: "Best CRM Software Compared (2026)", domain: "toolfinder.com", competitors: ["salesforce.com"], da: 69, pa: 47, traffic: 71000, rank: 8, mentioned: true, fresh: "fresh", age: "1mo ago" },
];
const MAX_TRAFFIC = Math.max(...ROWS.map((r) => r.traffic));

const STATS = [
  { n: "9", l: "Opportunities", coral: true },
  { n: "3", l: "Already mentioned" },
  { n: "61", l: "Avg DR" },
];

function FreshnessBars({ tone }: { tone: Fresh }) {
  const filled = tone === "fresh" ? 3 : tone === "aging" ? 2 : 1;
  const color = tone === "fresh" ? "bg-coral" : tone === "aging" ? "bg-slate" : "bg-gray";
  const heights = ["h-2", "h-3", "h-[18px]"];
  return (
    <span className="inline-flex items-end gap-[3px]" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn("w-[3.5px] rounded-full", h, i < filled ? color : "bg-foreground/[0.1]")}
        />
      ))}
    </span>
  );
}

function MentionBadge({ mentioned }: { mentioned: boolean }) {
  if (mentioned) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-[11.5px] font-semibold text-white">
        <Check size={13} strokeWidth={3} />
        Featured
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-coral/40 bg-coral-wash px-3 py-1.5 text-[11.5px] font-semibold text-coral-600">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
      </span>
      Not yet
    </span>
  );
}

export function ReportPreview() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-gradient-to-b from-surface to-coral-wash/15 shadow-[var(--shadow-panel)]">
      {/* window bar */}
      <div className="flex items-center gap-2 border-b border-border bg-foreground/[0.03] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
        <span className="mx-auto font-[family-name:var(--font-mono)] text-[11px] text-fog">
          United States · 12 listicles
        </span>
        <span className="text-[12px] font-bold tracking-tight text-coral">Linkurst</span>
      </div>

      {/* stats bar */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border text-center">
        {STATS.map((s) => (
          <div key={s.l} className="px-3 py-3.5">
            <p className={"text-xl font-bold tabular-nums " + (s.coral ? "text-coral-600" : "text-foreground")}>
              {s.n}
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-muted">
              {s.l}
            </p>
          </div>
        ))}
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-foreground/[0.015] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
              <th className="px-4 py-2.5 font-medium">Listicle</th>
              <th className="px-3 py-2.5 text-center font-medium">DR&nbsp;/&nbsp;PA</th>
              <th className="px-3 py-2.5 text-center font-medium">Traffic</th>
              <th className="px-3 py-2.5 text-center font-medium">Rank</th>
              <th className="px-3 py-2.5 text-center font-medium">Mentioned</th>
              <th className="px-4 py-2.5 font-medium">Freshness</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.title} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex items-start gap-1 font-semibold text-foreground">
                    {r.title}
                    <ArrowUpRight size={12} className="mt-0.5 shrink-0 text-muted" />
                  </span>
                  {r.aiCited && (
                    <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-coral px-2 py-0.5 align-[2px] text-[10px] font-semibold text-white">
                      <Sparkles size={10} />
                      AI cited
                    </span>
                  )}
                  <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                    {r.domain}
                    {r.author && <span> · by {r.author}</span>}
                  </p>
                  {r.competitors && r.competitors.length > 0 && (
                    <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                      <span className="text-coral-600/80">vs</span> {r.competitors.join(", ")}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex flex-col items-center">
                    <ScoreRing value={r.da} tone="coral" />
                    <span className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                      PA {r.pa}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 align-middle">
                  <TrafficMeter value={r.traffic} max={MAX_TRAFFIC} />
                </td>
                <td className="px-3 py-3 align-middle text-center">
                  <span
                    style={rankStyle(r.rank)}
                    className="inline-block min-w-[42px] rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[12px] font-bold text-foreground"
                  >
                    #{r.rank}
                  </span>
                </td>
                <td className="px-3 py-3 align-middle text-center">
                  <MentionBadge mentioned={r.mentioned} />
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-2.5">
                    <FreshnessBars tone={r.fresh} />
                    <div className="leading-tight">
                      <p
                        className={cn(
                          "text-[12px] font-semibold",
                          r.fresh === "fresh"
                            ? "text-coral-600"
                            : r.fresh === "aging"
                              ? "text-foreground"
                              : "text-muted",
                        )}
                      >
                        {r.fresh === "fresh" ? "Fresh" : r.fresh === "aging" ? "Aging" : "Stale"}
                      </p>
                      <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                        {r.age}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

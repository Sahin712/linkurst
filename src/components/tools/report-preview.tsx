"use client";

import { ArrowUpRight } from "lucide-react";
import { ScoreRing, TrafficMeter } from "@/components/tools/metric-cells";
import { rankStyle } from "@/lib/listicle/score";

/** Compact, illustrative preview of the real report dashboard (not live data). */
const ROWS = [
  { title: "12 Best CRM Software, Ranked", domain: "saasreview.io", da: 76, pa: 41, traffic: 184000, rank: 2, opp: 87, tier: "High" as const },
  { title: "The Best CRM Platforms I Tested", domain: "techtested.com", da: 71, pa: 55, traffic: 96000, rank: 4, opp: 81, tier: "High" as const },
  { title: "Best CRM Software for Small Business", domain: "smbpicks.com", da: 66, pa: 38, traffic: 52000, rank: 5, opp: 77, tier: "High" as const },
  { title: "Top 10 CRM Tools Compared", domain: "comparehub.com", da: 59, pa: 44, traffic: 41000, rank: 6, opp: 72, tier: "High" as const },
  { title: "Best CRM Software 2026: Buyer's Guide", domain: "b2bdigest.com", da: 54, pa: 33, traffic: 23000, rank: 7, opp: 68, tier: "Medium" as const },
];
const MAX_TRAFFIC = Math.max(...ROWS.map((r) => r.traffic));

const STATS = [
  { n: "9", l: "Opportunities" },
  { n: "6", l: "Prime targets", coral: true },
  { n: "71", l: "Avg DR" },
];

export function ReportPreview() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-gradient-to-b from-surface to-coral-wash/15 shadow-[var(--shadow-panel)]">
      {/* window bar */}
      <div className="flex items-center gap-2 border-b border-border bg-foreground/[0.03] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
        <span className="mx-auto font-[family-name:var(--font-mono)] text-[11px] text-fog">
          United States · 9 listicles
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
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-foreground/[0.015] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
              <th className="px-4 py-2.5 font-medium">Listicle</th>
              <th className="px-3 py-2.5 text-center font-medium">DR</th>
              <th className="px-3 py-2.5 text-center font-medium">PA</th>
              <th className="px-3 py-2.5 text-center font-medium">Traffic</th>
              <th className="px-3 py-2.5 text-center font-medium">Rank</th>
              <th className="px-4 py-2.5 font-medium">Opportunity</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.title} className="border-b border-border last:border-b-0">
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-start gap-1 font-semibold text-foreground">
                    {r.title}
                    <ArrowUpRight size={12} className="mt-0.5 shrink-0 text-muted" />
                  </span>
                  <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                    {r.domain}
                  </p>
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <ScoreRing value={r.da} tone="coral" />
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <ScoreRing value={r.pa} tone="slate" />
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <TrafficMeter value={r.traffic} max={MAX_TRAFFIC} />
                </td>
                <td className="px-3 py-2.5 align-middle text-center">
                  <span
                    style={rankStyle(r.rank)}
                    className="inline-block min-w-[42px] rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[12px] font-bold text-foreground"
                  >
                    #{r.rank}
                  </span>
                </td>
                <td className="px-4 py-2.5 align-middle">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[13px] font-bold tabular-nums " +
                        (r.tier === "High" ? "bg-coral text-white" : "bg-coral-wash text-coral-600")
                      }
                    >
                      {r.opp}
                    </span>
                    <span
                      className={
                        "text-[12px] font-semibold " +
                        (r.tier === "High" ? "text-coral-600" : "text-foreground")
                      }
                    >
                      {r.tier}
                    </span>
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

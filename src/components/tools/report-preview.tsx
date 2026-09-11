"use client";

import { ArrowUpRight } from "lucide-react";
import { ScoreRing, TrafficMeter } from "@/components/tools/metric-cells";
import { rankStyle } from "@/lib/listicle/score";

/** Compact preview of a real report ("sales engagement platform"). */
const ROWS = [
  { title: "Best Sales Engagement Platform | Sales Cloud", domain: "salesforce.com", da: 92, pa: 23, traffic: 1100000, rank: 6, opp: 89, tier: "High" as const },
  { title: "The 5 Best Sales Engagement Tools for Salesforce", domain: "revenue.io", da: 72, pa: 0, traffic: 2000, rank: 8, opp: 76, tier: "High" as const },
  { title: "Salesforce Alternatives: Top CRM Competitors", domain: "rox.com", da: 72, pa: 0, traffic: 4000, rank: 16, opp: 66, tier: "Medium" as const },
  { title: "The 56 Best Sales Engagement Apps for HubSpot", domain: "ecosystem.hubspot.com", da: 93, pa: 0, traffic: 25000, rank: 22, opp: 65, tier: "Medium" as const },
  { title: "7 Best Sales Engagement Tools in 2026", domain: "sybill.ai", da: 65, pa: 0, traffic: 4000, rank: 8, opp: 61, tier: "Medium" as const },
];
const MAX_TRAFFIC = Math.max(...ROWS.map((r) => r.traffic));

const STATS = [
  { n: "11", l: "Opportunities" },
  { n: "2", l: "Prime targets", coral: true },
  { n: "68", l: "Avg DR" },
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
          United States · 11 listicles
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

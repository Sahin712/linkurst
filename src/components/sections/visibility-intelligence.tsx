"use client";

import { useState } from "react";
import { ArrowRight, Target } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const tabs = ["Google", "AI Search", "Reddit", "Authority"] as const;

const rows = [
  { signal: "Organic Keywords", brand: "4,280", competitor: "8,920" },
  { signal: "AI Citations", brand: "82", competitor: "214" },
  { signal: "Brand Mentions", brand: "47", competitor: "129" },
  { signal: "Relevant Links", brand: "310", competitor: "640" },
  { signal: "Reddit Mentions", brand: "8", competitor: "76" },
];

const opportunities = [
  { value: "12", label: "AI citation gaps" },
  { value: "7", label: "Competitor link gaps" },
  { value: "4", label: "Relevant Reddit opportunities" },
];

export function VisibilityIntelligence() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Google");

  return (
    <Section id="insights" spacing="lg" className="bg-surface">
      <SectionHeader
        eyebrow="Visibility intelligence"
        title="See where your competitors are visible, and you're not."
        description="We identify the gaps between your brand and the companies already winning attention across search, AI answers, publications, and communities."
      />

      <Reveal className="mt-12 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background/40 shadow-[var(--shadow-panel)]">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Visibility channels"
          className="flex flex-wrap gap-1 border-b border-border bg-surface p-2"
        >
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={active === t}
              onClick={() => setActive(t)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium tracking-tight transition-colors",
                active === t
                  ? "bg-charcoal text-ivory"
                  : "text-fog hover:bg-background",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.6fr_1fr]">
          {/* Table */}
          <div className="overflow-x-auto p-5 sm:p-6">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <caption className="sr-only">
                Illustrative comparison of visibility signals between your brand
                and a competitor.
              </caption>
              <thead>
                <tr className="text-left">
                  <th className="pb-3 font-semibold text-muted">
                    Visibility Signal
                  </th>
                  <th className="pb-3 text-right font-semibold text-foreground">
                    Your Brand
                  </th>
                  <th className="pb-3 text-right font-semibold text-coral-600">
                    Competitor
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.signal} className="border-t border-border">
                    <td className="py-3 text-fog">{r.signal}</td>
                    <td className="py-3 text-right font-semibold tabular-nums text-foreground">
                      {r.brand}
                    </td>
                    <td className="py-3 text-right font-semibold tabular-nums text-coral-600">
                      {r.competitor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="caption mt-4 text-[0.7rem]">
              Illustrative visibility analysis · {active}
            </p>
          </div>

          {/* Opportunities */}
          <div className="border-t border-border bg-surface p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2 text-foreground">
              <Target size={16} className="text-coral-600" />
              <p className="text-sm font-semibold tracking-tight">
                17 visibility opportunities identified
              </p>
            </div>
            <ul className="mt-4 space-y-3">
              {opportunities.map((o) => (
                <li key={o.label} className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coral-100 text-sm font-bold text-coral-600">
                    {o.value}
                  </span>
                  <span className="text-sm text-fog">{o.label}</span>
                </li>
              ))}
            </ul>
            <Button href="#contact" size="md" className="mt-6 w-full">
              Find Your Visibility Gaps
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

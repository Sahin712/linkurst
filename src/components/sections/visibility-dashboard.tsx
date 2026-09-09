"use client";

import { motion, useReducedMotion } from "motion/react";
import { TrendingUp, Search, Sparkles, MessageSquare, Target } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Illustrative "Organic Visibility" dashboard — the hero centerpiece.
 * NOTE: all numbers are example UI values, not real client data.
 * This represents the analysis/reporting Linkurst delivers as a service;
 * it is not a live software product.
 */

const metrics = [
  { icon: Search, label: "Google", value: "82%", unit: "Visibility" },
  { icon: Sparkles, label: "AI Search", value: "64%", unit: "Citations" },
  { icon: MessageSquare, label: "Reddit", value: "41%", unit: "Mentions" },
];

const opportunities = [
  { value: "12", label: "AI citation gaps" },
  { value: "7", label: "Competitor link gaps" },
  { value: "4", label: "Reddit opportunities" },
];

// Chart series (0–100, left→right). Coral is the primary growth line.
const series = [
  {
    name: "Google",
    color: "var(--color-slate)",
    dash: "0",
    points: [38, 42, 47, 51, 58, 63, 69, 74],
  },
  {
    name: "AI Search",
    color: "var(--color-charcoal)",
    dash: "5 4",
    points: [20, 24, 28, 35, 41, 49, 56, 62],
  },
  {
    name: "Reddit",
    color: "var(--color-coral)",
    dash: "0",
    primary: true,
    points: [12, 18, 22, 30, 44, 55, 68, 84],
  },
];

const W = 560;
const H = 220;
const PAD = 8;

function toPath(points: number[]) {
  const stepX = (W - PAD * 2) / (points.length - 1);
  return points
    .map((p, i) => {
      const x = PAD + i * stepX;
      const y = PAD + (1 - p / 100) * (H - PAD * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function VisibilityDashboard({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative w-full rounded-[20px] border border-border bg-surface p-5 shadow-[var(--shadow-panel)] sm:p-6",
        className,
      )}
      role="img"
      aria-label="Illustrative Organic Visibility dashboard showing visibility scores across Google, AI Search, and Reddit, with an upward growth trend and identified opportunities."
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-coral-100 text-coral-600">
            <TrendingUp size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">
              Organic Visibility
            </p>
            <p className="caption text-xs not-italic text-gray">
              Cross-channel discovery score
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold leading-none tracking-tight text-foreground">
              78<span className="text-base font-medium text-gray"> / 100</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-coral-100 px-2.5 py-1 text-xs font-semibold text-coral-600">
            <TrendingUp size={13} />
            +24%
          </span>
        </div>
      </div>

      {/* Metric tiles */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {metrics.map(({ icon: Icon, label, value, unit }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-background/60 p-3"
          >
            <div className="flex items-center gap-1.5 text-gray">
              <Icon size={13} />
              <span className="text-[0.7rem] font-medium tracking-tight">
                {label}
              </span>
            </div>
            <p className="mt-1.5 text-lg font-bold tracking-tight text-foreground">
              {value}
            </p>
            <p className="caption text-[0.7rem] not-italic text-gray">{unit}</p>
          </div>
        ))}
      </div>

      {/* Chart + opportunities */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="mb-3 flex items-center gap-4">
            {series.map((s) => (
              <span
                key={s.name}
                className="flex items-center gap-1.5 text-[0.7rem] font-medium text-fog"
              >
                <span
                  className="inline-block h-1.5 w-4 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
              </span>
            ))}
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* gridlines */}
            {[0.25, 0.5, 0.75].map((g) => (
              <line
                key={g}
                x1={PAD}
                x2={W - PAD}
                y1={PAD + g * (H - PAD * 2)}
                y2={PAD + g * (H - PAD * 2)}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
            ))}

            {/* coral growth area under primary line */}
            <path
              d={`${toPath(series[2].points)} L ${W - PAD} ${H - PAD} L ${PAD} ${H - PAD} Z`}
              fill="var(--color-coral)"
              opacity={0.07}
            />

            {series.map((s) => (
              <motion.path
                key={s.name}
                d={toPath(s.points)}
                fill="none"
                stroke={s.color}
                strokeWidth={s.primary ? 2.5 : 1.5}
                strokeDasharray={s.dash}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            ))}

            {/* endpoint marker on primary line */}
            <circle
              cx={W - PAD}
              cy={PAD + (1 - series[2].points[7] / 100) * (H - PAD * 2)}
              r={4}
              fill="var(--color-coral)"
              stroke="var(--color-surface)"
              strokeWidth={2}
            />
          </svg>
        </div>

        {/* Opportunities panel */}
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center gap-1.5 text-fog">
            <Target size={14} className="text-coral-600" />
            <p className="text-xs font-semibold tracking-tight">
              Visibility opportunities
            </p>
          </div>
          <ul className="mt-3 space-y-2.5">
            {opportunities.map((o) => (
              <li key={o.label} className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-coral-100 text-xs font-bold text-coral-600">
                  {o.value}
                </span>
                <span className="text-xs leading-tight text-fog">
                  {o.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Illustrative label */}
      <p className="caption mt-4 text-[0.7rem]">Illustrative visibility analysis</p>
    </div>
  );
}

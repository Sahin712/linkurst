"use client";

import { motion } from "motion/react";
import { formatTraffic } from "@/lib/listicle/score";

const RING = { r: 15.5, get c() { return 2 * Math.PI * this.r; } };

/**
 * Ahrefs-style circular gauge for a 0–100 metric (DR / PA). The ring animates
 * to its value on scroll-in. Coral for authority (DR), slate for page (PA).
 */
export function ScoreRing({
  value,
  tone,
}: {
  value: number | null;
  tone: "coral" | "slate";
}) {
  const v = Math.min(100, Math.max(0, value ?? 0));
  const c = RING.c;
  const stroke = tone === "coral" ? "#E8553A" : "#3A3A3D";
  return (
    <div className="relative mx-auto h-11 w-11">
      <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={RING.r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          className="text-foreground/[0.08]"
        />
        <motion.circle
          cx="20"
          cy="20"
          r={RING.r}
          fill="none"
          stroke={stroke}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (v / 100) * c }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[12px] font-bold tabular-nums text-foreground">
        {value ?? "—"}
      </span>
    </div>
  );
}

/**
 * Traffic meter: the estimated monthly visits with an animated gradient bar
 * scaled to the biggest-traffic listicle in the report.
 */
export function TrafficMeter({ value, max }: { value: number | null; max: number }) {
  const pct = value && value > 0 ? Math.max(6, Math.round((value / max) * 100)) : 0;
  return (
    <div className="mx-auto w-[84px]">
      <div className="text-center">
        <span className="font-[family-name:var(--font-mono)] text-[13px] font-bold tabular-nums text-foreground">
          {formatTraffic(value)}
        </span>
        <span className="ml-0.5 text-[9px] text-muted">/mo</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-coral/60 to-coral"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

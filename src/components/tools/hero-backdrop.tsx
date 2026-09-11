"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Star } from "lucide-react";

/** Ambient, thematic animated backdrop for the hero. Purely decorative. */
const DOTS = [
  { top: "14%", left: "6%", size: 6, dur: 4.2, delay: 0 },
  { top: "24%", left: "92%", size: 8, dur: 5.1, delay: 0.5 },
  { top: "9%", left: "44%", size: 4, dur: 3.6, delay: 1 },
  { top: "54%", left: "3%", size: 7, dur: 5.4, delay: 0.8 },
  { top: "74%", left: "94%", size: 5, dur: 4.1, delay: 1.2 },
  { top: "86%", left: "8%", size: 6, dur: 5.0, delay: 0.3 },
  { top: "44%", left: "85%", size: 4, dur: 3.7, delay: 1.1 },
  { top: "90%", left: "80%", size: 7, dur: 5.3, delay: 0.4 },
  { top: "6%", left: "20%", size: 5, dur: 4.4, delay: 1.3 },
  { top: "64%", left: "11%", size: 4, dur: 4.0, delay: 0.6 },
];

// Floating thematic ranking chips.
const PILLS = [
  { top: "12%", left: "5%", label: "#1", dur: 6, delay: 0 },
  { top: "30%", left: "90%", label: "Top 10", dur: 7, delay: 0.8 },
  { top: "68%", left: "4%", label: "Best of 2026", dur: 6.5, delay: 1.4 },
  { top: "80%", left: "88%", label: "#3", dur: 6.2, delay: 0.4 },
  { top: "50%", left: "93%", label: "★ 4.9", dur: 7.5, delay: 1 },
];

const SPARKLES = [
  { top: "10%", left: "82%", size: 18, dur: 4.5, delay: 0.2, Icon: Sparkles },
  { top: "42%", left: "7%", size: 15, dur: 5.2, delay: 1.0, Icon: Star },
  { top: "84%", left: "66%", size: 16, dur: 4.8, delay: 0.6, Icon: Sparkles },
];

export function HeroBackdrop() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* drifting gradient blobs */}
      <motion.div
        className="absolute -left-24 top-24 h-72 w-72 rounded-full blur-[110px]"
        style={{ background: "var(--color-coral)", opacity: 0.1 }}
        animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 top-52 h-80 w-80 rounded-full blur-[120px]"
        style={{ background: "var(--color-coral)", opacity: 0.1 }}
        animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 24, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* radar rings — discovery motif */}
      <div className="absolute right-[10%] top-[20%]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={`r${i}`}
            className="absolute rounded-full border border-coral/30"
            style={{ width: 240, height: 240, marginLeft: -120, marginTop: -120 }}
            animate={reduce ? { opacity: 0.12 } : { scale: [0.45, 1.35], opacity: [0.45, 0] }}
            transition={{ duration: 5.4, repeat: Infinity, delay: i * 1.8, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* floating dots */}
      {DOTS.map((d, i) => (
        <motion.span
          key={`d${i}`}
          className="absolute rounded-full bg-coral"
          style={{ top: d.top, left: d.left, width: d.size, height: d.size, opacity: 0.3 }}
          animate={
            reduce ? undefined : { opacity: [0.15, 0.5, 0.15], scale: [1, 1.4, 1], y: [0, -10, 0] }
          }
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
        />
      ))}

      {/* thematic ranking chips */}
      {PILLS.map((p, i) => (
        <motion.span
          key={`p${i}`}
          className="absolute rounded-full border border-coral/20 bg-surface/70 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-coral-600 shadow-[var(--shadow-card)] backdrop-blur-sm"
          style={{ top: p.top, left: p.left, opacity: 0.55 }}
          animate={reduce ? undefined : { y: [0, -16, 0], opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        >
          {p.label}
        </motion.span>
      ))}

      {/* twinkling sparkles */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={`s${i}`}
          className="absolute text-coral/40"
          style={{ top: s.top, left: s.left }}
          animate={reduce ? undefined : { opacity: [0.2, 0.65, 0.2], rotate: [0, 25, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        >
          <s.Icon size={s.size} />
        </motion.span>
      ))}
    </div>
  );
}

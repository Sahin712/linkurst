"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Star } from "lucide-react";

/**
 * Global ambient backdrop rendered once in the root layout: drifting coral
 * dots, twinkling stars, and a subtle radar in the top-right corner. Fixed
 * behind all content (opaque sections cover it; it shows through the ivory
 * page background). Purely decorative and reduced-motion aware.
 */
const DOTS = [
  { top: "14%", left: "8%", size: 6, dur: 4.2, delay: 0 },
  { top: "72%", left: "6%", size: 7, dur: 5.4, delay: 0.8 },
  { top: "40%", left: "3%", size: 5, dur: 4.4, delay: 0.9 },
  { top: "88%", left: "14%", size: 6, dur: 5.0, delay: 0.3 },
  { top: "22%", left: "93%", size: 8, dur: 5.1, delay: 0.5 },
  { top: "58%", left: "95%", size: 5, dur: 4.1, delay: 1.2 },
  { top: "82%", left: "88%", size: 7, dur: 5.3, delay: 0.4 },
  { top: "34%", left: "48%", size: 4, dur: 3.6, delay: 1 },
  { top: "92%", left: "52%", size: 5, dur: 4.6, delay: 0.6 },
];

const STARS = [
  { top: "12%", left: "84%", size: 18, dur: 4.5, delay: 0.2, Icon: Sparkles },
  { top: "46%", left: "6%", size: 15, dur: 5.2, delay: 1.0, Icon: Star },
  { top: "80%", left: "70%", size: 16, dur: 4.8, delay: 0.6, Icon: Sparkles },
  { top: "66%", left: "24%", size: 13, dur: 5.6, delay: 1.4, Icon: Star },
];

const GUIDES = [280, 460, 660];
const PULSES = [0, 1, 2];

export function SiteBackdrop() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* subtle warm glow, top-right */}
      <div
        className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: "var(--color-coral)", opacity: 0.07 }}
      />

      {/* radar in the top-right corner */}
      <div className="absolute right-[4%] top-[14%]">
        {GUIDES.map((d, i) => (
          <span
            key={`g${i}`}
            className="absolute rounded-full border border-coral/12"
            style={{ width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2 }}
          />
        ))}
        {PULSES.map((i) => (
          <motion.span
            key={`p${i}`}
            className="absolute rounded-full border border-coral/30"
            style={{ width: 240, height: 240, marginLeft: -120, marginTop: -120 }}
            animate={reduce ? { opacity: 0.1 } : { scale: [0.4, 2.8], opacity: [0.4, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: i * 2.2, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* floating dots */}
      {DOTS.map((d, i) => (
        <motion.span
          key={`d${i}`}
          className="absolute rounded-full bg-coral"
          style={{ top: d.top, left: d.left, width: d.size, height: d.size, opacity: 0.25 }}
          animate={
            reduce ? undefined : { opacity: [0.12, 0.42, 0.12], scale: [1, 1.4, 1], y: [0, -10, 0] }
          }
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
        />
      ))}

      {/* twinkling stars */}
      {STARS.map((s, i) => (
        <motion.span
          key={`s${i}`}
          className="absolute text-coral/35"
          style={{ top: s.top, left: s.left }}
          animate={reduce ? undefined : { opacity: [0.2, 0.6, 0.2], rotate: [0, 25, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        >
          <s.Icon size={s.size} />
        </motion.span>
      ))}
    </div>
  );
}

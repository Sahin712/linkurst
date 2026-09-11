"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";

/** Ambient animated dots + sparkles behind the hero. Purely decorative. */
const DOTS = [
  { top: "12%", left: "7%", size: 6, dur: 4.2, delay: 0 },
  { top: "22%", left: "90%", size: 8, dur: 5.1, delay: 0.5 },
  { top: "8%", left: "40%", size: 4, dur: 3.6, delay: 1 },
  { top: "34%", left: "94%", size: 5, dur: 4.6, delay: 0.2 },
  { top: "52%", left: "4%", size: 7, dur: 5.4, delay: 0.8 },
  { top: "72%", left: "92%", size: 5, dur: 4.1, delay: 1.2 },
  { top: "84%", left: "9%", size: 6, dur: 5.0, delay: 0.3 },
  { top: "16%", left: "72%", size: 5, dur: 4.8, delay: 0.9 },
  { top: "46%", left: "83%", size: 4, dur: 3.7, delay: 1.1 },
  { top: "88%", left: "82%", size: 7, dur: 5.3, delay: 0.4 },
  { top: "6%", left: "22%", size: 5, dur: 4.4, delay: 1.3 },
  { top: "62%", left: "12%", size: 4, dur: 4.0, delay: 0.6 },
];

const STARS = [
  { top: "10%", left: "84%", size: 18, dur: 4.5, delay: 0.2 },
  { top: "40%", left: "6%", size: 14, dur: 5.2, delay: 1.0 },
  { top: "80%", left: "70%", size: 16, dur: 4.8, delay: 0.6 },
];

export function HeroBackdrop() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {DOTS.map((d, i) => (
        <motion.span
          key={`d${i}`}
          className="absolute rounded-full bg-coral"
          style={{ top: d.top, left: d.left, width: d.size, height: d.size, opacity: 0.25 }}
          animate={
            reduce ? undefined : { opacity: [0.12, 0.45, 0.12], scale: [1, 1.35, 1], y: [0, -8, 0] }
          }
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
        />
      ))}
      {STARS.map((s, i) => (
        <motion.span
          key={`s${i}`}
          className="absolute text-coral/40"
          style={{ top: s.top, left: s.left }}
          animate={reduce ? undefined : { opacity: [0.2, 0.6, 0.2], rotate: [0, 20, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        >
          <Sparkles size={s.size} />
        </motion.span>
      ))}
    </div>
  );
}

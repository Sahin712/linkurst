"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Star } from "lucide-react";

/** Ambient animated backdrop for the hero: a radar/discovery pulse, dots, stars. */
const DOTS = [
  { top: "16%", left: "9%", size: 6, dur: 4.2, delay: 0 },
  { top: "26%", left: "90%", size: 8, dur: 5.1, delay: 0.5 },
  { top: "10%", left: "40%", size: 4, dur: 3.6, delay: 1 },
  { top: "70%", left: "94%", size: 5, dur: 4.1, delay: 1.2 },
  { top: "86%", left: "10%", size: 6, dur: 5.0, delay: 0.3 },
  { top: "60%", left: "5%", size: 5, dur: 4.4, delay: 0.9 },
  { top: "90%", left: "78%", size: 7, dur: 5.3, delay: 0.4 },
  { top: "8%", left: "72%", size: 4, dur: 4.0, delay: 1.3 },
];

const STARS = [
  { top: "12%", left: "84%", size: 20, dur: 4.5, delay: 0.2, Icon: Sparkles },
  { top: "40%", left: "6%", size: 15, dur: 5.2, delay: 1.0, Icon: Star },
  { top: "82%", left: "66%", size: 17, dur: 4.8, delay: 0.6, Icon: Sparkles },
  { top: "72%", left: "20%", size: 13, dur: 5.6, delay: 1.4, Icon: Star },
  { top: "20%", left: "56%", size: 14, dur: 4.2, delay: 0.8, Icon: Star },
];

// Static concentric guide rings (px diameters) for depth.
const GUIDES = [340, 560, 800, 1060];
// Expanding radar pulses.
const PULSES = [0, 1, 2, 3];

export function HeroBackdrop() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[900px] overflow-hidden"
    >
      {/* soft warm glow behind the radar */}
      <div
        className="absolute right-[2%] top-[34%] h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: "var(--color-coral)", opacity: 0.1 }}
      />

      {/* radar — concentric rings + expanding pulses (right side) */}
      <div className="absolute right-[6%] top-[34%] -translate-y-1/2">
        {GUIDES.map((d, i) => (
          <span
            key={`g${i}`}
            className="absolute rounded-full border border-coral/15"
            style={{ width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2 }}
          />
        ))}
        {PULSES.map((i) => (
          <motion.span
            key={`p${i}`}
            className="absolute rounded-full border border-coral/40"
            style={{ width: 300, height: 300, marginLeft: -150, marginTop: -150 }}
            animate={reduce ? { opacity: 0.15 } : { scale: [0.4, 3.4], opacity: [0.5, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: i * 1.75, ease: "easeOut" }}
          />
        ))}
        {/* pulsing core */}
        <motion.span
          className="absolute rounded-full bg-coral"
          style={{ width: 10, height: 10, marginLeft: -5, marginTop: -5 }}
          animate={reduce ? undefined : { scale: [1, 1.8, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
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

      {/* twinkling stars */}
      {STARS.map((s, i) => (
        <motion.span
          key={`s${i}`}
          className="absolute text-coral/45"
          style={{ top: s.top, left: s.left }}
          animate={reduce ? undefined : { opacity: [0.25, 0.7, 0.25], rotate: [0, 25, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        >
          <s.Icon size={s.size} />
        </motion.span>
      ))}
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Target } from "lucide-react";

/**
 * Illustrative hero visual (not real data): a dark "demo screen" showing a
 * listicle AI cites, with competitors on it and the brand missing. Dark styling
 * keeps it clearly distinct from the white input form below.
 */
const ROWS = [
  { rank: 1, name: "Apollo" },
  { rank: 2, name: "Outreach" },
  { rank: 3, name: "Salesloft" },
];

export function HeroListiclePreview() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* floating AI badge */}
      <div className="absolute -left-3 -top-4 z-10 flex items-center gap-1.5 rounded-full border border-coral/40 bg-charcoal px-3 py-1.5 text-[11px] font-semibold text-coral shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
        <motion.span
          animate={reduce ? undefined : { scale: [1, 1.25, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="grid place-items-center"
        >
          <Sparkles size={13} />
        </motion.span>
        AI cites this list
      </div>

      <div
        className="overflow-hidden rounded-[var(--radius-xl)] border border-white/10 p-5 shadow-[0_30px_80px_-30px_rgba(232,85,58,0.4)]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, #22222a 0%, #17171b 55%, #101014 100%)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] font-bold tracking-tight text-ivory">
              12 Best Sales Engagement Platforms
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10.5px] text-ivory/45">
              saasreview.io · updated 2026
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-coral/20 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-coral">
            #3 on Google
          </span>
        </div>

        <ul className="mt-4 space-y-2">
          {ROWS.map((r) => (
            <li
              key={r.rank}
              className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/[0.08] text-[11px] font-bold text-ivory/70">
                {r.rank}
              </span>
              <span className="text-[13px] font-semibold text-ivory">{r.name}</span>
              <span className="ml-auto font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-wide text-ivory/40">
                competitor
              </span>
            </li>
          ))}

          {/* the gap — your brand, pulsing */}
          <motion.li
            animate={
              reduce
                ? undefined
                : {
                    boxShadow: [
                      "0 0 0 0 rgba(232,85,58,0)",
                      "0 0 0 4px rgba(232,85,58,0.18)",
                      "0 0 0 0 rgba(232,85,58,0)",
                    ],
                  }
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-3 rounded-lg border border-dashed border-coral/60 bg-coral/[0.12] px-3 py-2"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-coral text-[11px] font-bold text-white">
              ?
            </span>
            <span className="text-[13px] font-semibold text-coral">Your brand</span>
            <span className="ml-auto font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-wide text-coral/80">
              not listed yet
            </span>
          </motion.li>
        </ul>

        <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-3">
          <Target size={13} className="text-coral" />
          <p className="text-[12px] text-ivory/70">
            Competitors are on it. <span className="font-semibold text-ivory">You&rsquo;re not.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

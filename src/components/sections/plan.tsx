"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, fadeInUp, inViewOnce } from "@/lib/motion";

/**
 * "Your 90-Day Plan" — a three-phase onboarding plan (gradient-header cards
 * with week labels, serif titles, and bullet chips). Coral-family gradients
 * only. Expectation copy (opinion), no fabricated guarantees.
 */

type Phase = {
  phase: string;
  label: string;
  headerDesc: string;
  weeks: string;
  title: React.ReactNode;
  body: string;
  chips: string[];
  gradient: string;
};

const phases: Phase[] = [
  {
    phase: "Phase 01",
    label: "Foundations",
    headerDesc: "We map where you can win across search, AI, and Reddit before shipping a thing.",
    weeks: "Days 1–30",
    title: (
      <>
        Get <span className="accent-serif font-normal">started.</span>
      </>
    ),
    body: "We audit your brand across every surface, identify quick wins, and build your custom playbook.",
    chips: [
      "Brand + competitor audit",
      "AI visibility baseline",
      "Tracking systems live",
      "Custom 90-day playbook",
    ],
    gradient: "linear-gradient(135deg, #f0785f 0%, #e8553a 100%)",
  },
  {
    phase: "Phase 02",
    label: "Momentum",
    headerDesc: "Content starts flowing and the first signals appear across your channels.",
    weeks: "Days 31–60",
    title: (
      <>
        Content <span className="accent-serif font-normal">flowing.</span>
      </>
    ),
    body: "We ship content, earn the first links and placements, and structure answers so models start citing you.",
    chips: [
      "Content published on cadence",
      "First links & Digital PR",
      "AEO answer blocks",
      "Priority pages optimized",
    ],
    gradient: "linear-gradient(135deg, #e8553a 0%, #d0442c 100%)",
  },
  {
    phase: "Phase 03",
    label: "Compounding",
    headerDesc: "We amplify what works and track real impact on SEO and AI answers.",
    weeks: "Days 61–90",
    title: (
      <>
        Real <span className="accent-serif font-normal">impact.</span>
      </>
    ),
    body: "We scale the winners, expand citations and share of voice, and tie visibility to qualified demand.",
    chips: [
      "AI citations appearing",
      "Share of voice rising",
      "Content refreshes",
      "Revenue-linked reporting",
    ],
    gradient: "linear-gradient(135deg, #c9412a 0%, #9c3320 100%)",
  },
];

export function Plan() {
  return (
    <Section
      id="plan"
      spacing="lg"
      className="relative overflow-hidden bg-charcoal"
    >
      {/* ambient coral glow + dotted field for the dark band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 h-[440px] w-[620px] rounded-full opacity-[0.14] blur-[130px]"
        style={{ background: "var(--color-coral)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 78%)",
        }}
      />

      <Reveal className="relative max-w-3xl">
        <p className="eyebrow-mono flex items-center gap-2 text-coral">
          <span className="inline-block h-px w-6 bg-coral" />
          Your 90-day plan
        </p>
        <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-ivory sm:text-5xl">
          From first audit{" "}
          <span className="accent-serif font-normal text-coral">
            to cited default.
          </span>
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-ivory/70">
          Here&rsquo;s how a Linkurst engagement ramps, and what to expect in
          each phase over your first 90 days.
        </p>
      </Reveal>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        variants={staggerContainer}
        className="relative mt-14 grid gap-6 lg:grid-cols-3"
      >
        {phases.map((p) => (
          <motion.div
            key={p.phase}
            variants={fadeInUp}
            className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-white/[0.03]"
          >
            {/* gradient header */}
            <div className="relative overflow-hidden p-6 text-ivory" style={{ background: p.gradient }}>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 1px, transparent 1px 7px)",
                }}
              />
              <div className="relative flex items-start justify-between gap-3">
                <span className="font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em]">
                  {p.label}
                </span>
                <span className="shrink-0 rounded-full bg-ivory px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wider text-charcoal">
                  {p.phase}
                </span>
              </div>
              <p className="relative mt-3 max-w-[22ch] text-[14px] leading-relaxed text-ivory/90">
                {p.headerDesc}
              </p>
            </div>

            {/* body */}
            <div className="flex flex-1 flex-col p-6">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-ivory/45">
                {p.weeks}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-ivory">
                {p.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ivory/65">
                {p.body}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {p.chips.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-[12.5px] text-ivory/75"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Reveal className="relative mt-8 flex items-center justify-center gap-3 text-center">
        <span className="text-coral">✦</span>
        <p className="font-[family-name:var(--font-serif)] text-[15px] italic text-ivory/55">
          Day 91 onward: compound the winners, cut the rest, keep shipping.
        </p>
        <span className="text-coral">✦</span>
      </Reveal>
    </Section>
  );
}

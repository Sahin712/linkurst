"use client";

import { ArrowRight, Search, Link2, PenLine } from "lucide-react";
import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, fadeInUp, inViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * "The New Organic" — how SEO changed. A split OLD PLAYBOOK vs NEW ORGANIC
 * comparison panel with an animated seam, plus the market-gap
 * frustration. Positioning copy (opinion), no fabricated stats.
 */

const shifts = [
  {
    category: "Discovery",
    icon: Search,
    before: "Rank on Google's ten blue links",
    now: "Show up across Google, AI answers & Reddit",
  },
  {
    category: "Authority",
    icon: Link2,
    before: "Chase backlinks and guest posts for DR",
    now: "Earn the mentions & citations AI models trust",
  },
  {
    category: "Content",
    icon: PenLine,
    before: "Ship generic briefs at volume and hope",
    now: "Engineer entity-rich content built to be the answer",
  },
];

const gaps = [
  {
    title: "Dashboards, not decisions.",
    body: "You can already see where you rank and where you're cited. What's missing is the plan that turns it into next week's work.",
  },
  {
    title: "Your current team is still catching up.",
    body: "Ask how they'll get you cited in ChatGPT or Perplexity, and the specifics get thin fast.",
  },
  {
    title: "Reports explain the past, not the play.",
    body: "Charts show what moved. You need the read on why, and where to push next to compound it.",
  },
];

export function Shift() {
  return (
    <Section id="shift" spacing="lg" className="relative overflow-hidden">
      {/* ambient coral glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-[440px] w-[760px] -translate-x-1/2 rounded-full opacity-[0.10] blur-[130px]"
        style={{ background: "var(--color-coral)" }}
      />

      {/* Beat 1 — thesis */}
      <Reveal className="relative max-w-3xl">
        <p className="eyebrow-mono flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-coral" />
          The New Organic
        </p>
        <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance sm:text-5xl">
          <span className="text-foreground">
            Search <span className="accent-serif font-normal">outgrew</span> the
            search bar.
          </span>
          <br />
          <span className="text-gray">
            Most agencies are still optimizing for one box.
          </span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog">
          For fifteen years, SEO meant rankings, keywords, and backlinks,
          because Google was the only front door. Now your buyers discover you
          across{" "}
          <strong className="font-semibold text-foreground">
            Google, AI answers, and Reddit
          </strong>
          . The old playbook only sees a third of the picture.
        </p>
      </Reveal>

      {/* Beat 2 — split OLD vs NEW comparison panel */}
      <Reveal className="relative mt-14">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
          {/* animated seam */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-coral/20 md:block"
          >
            <div className="seam-dot absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-coral to-transparent motion-reduce:hidden" />
          </div>

          {/* column headers */}
          <div className="hidden grid-cols-[1fr_auto_1fr] border-b border-border md:grid">
            <div className="flex items-center gap-2 px-6 py-4">
              <span className="eyebrow-mono text-gray">The old playbook</span>
              <span className="rounded border border-border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-gray">
                2015
              </span>
            </div>
            <div className="w-10" aria-hidden="true" />
            <div className="flex items-center gap-2 px-6 py-4">
              <span className="eyebrow-mono text-coral">The new organic</span>
              <span className="rounded border border-coral-100 bg-coral-wash px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-coral-600">
                NOW
              </span>
            </div>
          </div>

          {/* rows */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
            variants={staggerContainer}
          >
            {shifts.map((s) => (
              <motion.div
                key={s.category}
                variants={fadeInUp}
                className="group grid grid-cols-1 border-b border-border transition-colors duration-300 last:border-b-0 hover:bg-foreground/[0.02] md:grid-cols-[1fr_auto_1fr]"
              >
                {/* BEFORE */}
                <div className="flex items-start gap-3 px-6 py-6">
                  <s.icon
                    size={16}
                    className="mt-0.5 shrink-0 text-gray/70"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-gray/70">
                      {s.category}
                    </span>
                    <p className="mt-1 text-[15px] leading-snug text-gray line-through decoration-gray/40">
                      {s.before}
                    </p>
                  </div>
                </div>

                {/* connector */}
                <div className="flex items-center justify-center px-6 pb-2 md:px-4 md:pb-0">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-coral/40 bg-coral-wash text-coral transition-transform duration-300 group-hover:scale-110">
                    <ArrowRight
                      size={15}
                      className="rotate-90 transition-transform duration-300 group-hover:translate-x-0.5 md:rotate-0"
                    />
                  </span>
                </div>

                {/* NOW */}
                <div className="px-6 py-6">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-coral-600">
                    {s.category}
                  </span>
                  <p className="mt-1 text-base font-semibold leading-snug text-foreground transition-transform duration-300 group-hover:translate-x-0.5">
                    {s.now}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Reveal>

      {/* Beat 3 — the market gap */}
      <div className="relative mt-20">
        <Reveal>
          <h3 className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-balance sm:text-[2rem]">
            <span className="text-foreground">
              You&rsquo;re not short on dashboards.
            </span>{" "}
            <span className="text-gray">
              You&rsquo;re short on someone who turns them into moves.
            </span>
          </h3>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={staggerContainer}
          className="mt-10 grid overflow-hidden rounded-[var(--radius-xl)] border border-border sm:grid-cols-3"
        >
          {gaps.map((g, i) => (
            <motion.div
              key={g.title}
              variants={fadeInUp}
              className={cn(
                "group relative p-6 transition-colors duration-300 hover:bg-foreground/[0.02] sm:p-7",
                i > 0 && "border-t border-border sm:border-l sm:border-t-0",
              )}
            >
              {/* coral top-accent that grows in on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-coral transition-transform duration-300 group-hover:scale-x-100"
              />
              <h4 className="text-base font-bold leading-snug tracking-tight text-foreground">
                {g.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-fog">{g.body}</p>
            </motion.div>
          ))}
        </motion.div>

        <Reveal>
          <p className="mt-10 text-lg font-semibold tracking-tight text-foreground">
            Linkurst is built for the search that exists now,{" "}
            <span className="text-coral">not the one from 2015.</span>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

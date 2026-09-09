"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { staggerContainer, fadeInUp, inViewOnce } from "@/lib/motion";

const channels = [
  "SEO",
  "AI Search",
  "Digital PR",
  "Link Building",
  "Brand Mentions",
  "Reddit",
  "Content",
];

const pipeline = [
  { label: "Organic Visibility", strong: true },
  { label: "Authority", strong: false },
  { label: "Qualified Inbound Demand", strong: false },
];

export function LinkurstSystem() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="methodology" spacing="lg" className="bg-charcoal">
      <SectionHeader
        tone="dark"
        eyebrow="The Linkurst system"
        title="One organic growth system. Multiple discovery channels."
        description="We connect the channels that influence organic discovery instead of treating SEO, AI search, Digital PR, links, content, and Reddit as isolated activities."
      />

      <div className="mt-14">
        {/* Channel nodes */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={staggerContainer}
          className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3"
        >
          {channels.map((c) => (
            <motion.li key={c} variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate/70 bg-slate/20 px-4 py-2 text-sm font-medium text-ivory">
                <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                {c}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Converging connector */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inViewOnce}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="my-8 flex justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 400 60" className="h-14 w-full max-w-md">
            {[40, 120, 200, 280, 360].map((x) => (
              <motion.line
                key={x}
                x1={x}
                y1={4}
                x2={200}
                y2={56}
                stroke="var(--color-coral)"
                strokeWidth={1.5}
                strokeOpacity={0.5}
                initial={reduceMotion ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={inViewOnce}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Pipeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={staggerContainer}
          className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
        >
          {pipeline.map((stage, i) => (
            <motion.div
              key={stage.label}
              variants={fadeInUp}
              className="flex flex-col items-center gap-3 sm:flex-row"
            >
              <div
                className={
                  stage.strong
                    ? "rounded-2xl border border-coral bg-coral px-6 py-4 text-center shadow-[0_8px_30px_-8px_rgba(232,85,58,0.6)]"
                    : "rounded-2xl border border-slate/70 bg-slate/20 px-6 py-4 text-center"
                }
              >
                <span
                  className={
                    stage.strong
                      ? "text-sm font-bold tracking-tight text-ivory sm:text-base"
                      : "text-sm font-semibold tracking-tight text-ivory sm:text-base"
                  }
                >
                  {stage.label}
                </span>
              </div>
              {i < pipeline.length - 1 && (
                <>
                  <ArrowRight
                    size={20}
                    className="hidden text-coral sm:block"
                    aria-hidden="true"
                  />
                  <ArrowDown
                    size={18}
                    className="text-coral sm:hidden"
                    aria-hidden="true"
                  />
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

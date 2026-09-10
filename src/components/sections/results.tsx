"use client";

import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { staggerContainer, fadeInUp, inViewOnce } from "@/lib/motion";
import { motion } from "motion/react";

const stats = [
  { value: "10X", label: "Organic traffic growth" },
  { value: "DR 4 → 43", label: "Domain authority growth" },
  { value: "80+", label: "DR80+ publications" },
  { value: "2,000+", label: "Links acquired" },
];

export function Results() {
  return (
    <Section spacing="lg" className="bg-charcoal">
      <SectionHeader
        tone="dark"
        eyebrow="Results"
        title="Organic growth, backed by evidence."
      />

      <motion.dl
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        variants={staggerContainer}
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeInUp}
            className="rounded-[var(--radius-xl)] border border-slate/50 bg-slate/10 p-8"
          >
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <p className="text-4xl font-bold tracking-tight text-coral sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {s.label}
              </p>
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </Section>
  );
}

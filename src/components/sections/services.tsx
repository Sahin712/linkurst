"use client";

import {
  Search,
  Sparkles,
  PenLine,
  Newspaper,
  Link2,
  MessageSquare,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, fadeInUp, inViewOnce } from "@/lib/motion";

/**
 * "Services" — a scannable deliverables grid: each service with what you
 * actually get. Editorial (not a product UI), distinct from the Engine Room.
 */

const services = [
  {
    icon: Search,
    title: "SEO Strategy",
    body: "The technical and content foundation to compete for high-value search.",
    deliverables: [
      "Technical & crawl audit",
      "Site architecture & internal linking",
      "Keyword & content roadmap",
    ],
  },
  {
    icon: Sparkles,
    title: "AI Search: AEO & GEO",
    body: "Become the cited answer across ChatGPT, Perplexity, Gemini, and AI Overviews.",
    deliverables: [
      "Entity & schema optimization",
      "Citable answer-block content",
      "AI citation tracking",
    ],
  },
  {
    icon: PenLine,
    title: "Content Engineering",
    body: "Content built to rank on Google and to be quoted as the answer.",
    deliverables: [
      "Search-led content briefs",
      "Editorial & original research",
      "Content refreshes",
    ],
  },
  {
    icon: Newspaper,
    title: "Digital PR",
    body: "Earned media that builds the authority search and AI models reward.",
    deliverables: [
      "Story angles & data studies",
      "Journalist outreach",
      "Placement reporting",
    ],
  },
  {
    icon: Link2,
    title: "Strategic Link Building",
    body: "Relevance-first links that compound topical authority.",
    deliverables: [
      "Prospecting & vetting",
      "Editorial & guest placements",
      "Anchor & profile QA",
    ],
  },
  {
    icon: MessageSquare,
    title: "Reddit & Community",
    body: "Show up in the threads and communities shaping buyer decisions.",
    deliverables: [
      "Subreddit & thread research",
      "On-brand participation",
      "Mention & citation tracking",
    ],
  },
];

/** The reusable services card grid (used on the homepage and in tool reports). */
export function ServicesGrid({ className }: { className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={staggerContainer}
      className={className ?? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"}
    >
      {services.map((s) => (
        <motion.div
          key={s.title}
          variants={fadeInUp}
          className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background/40 p-6 transition-colors duration-300 hover:border-coral/40"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-coral transition-transform duration-300 group-hover:scale-x-100"
          />
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-coral-wash text-coral-600">
            <s.icon size={19} />
          </span>
          <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
            {s.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fog">{s.body}</p>
          <ul className="mt-5 space-y-2 border-t border-border pt-4">
            {s.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-[13.5px] text-fog">
                <Check size={15} className="mt-0.5 shrink-0 text-coral-600" />
                {d}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function Services() {
  return (
    <Section id="services" spacing="lg" className="bg-surface">
      <Reveal className="max-w-3xl">
        <p className="eyebrow-mono flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-coral" />
          Services
        </p>
        <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
          Everything you need to become{" "}
          <span className="accent-serif font-normal text-coral">
            discoverable
          </span>
          .
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-fog">
          Engage the full stack or just the pieces you need most. Here&rsquo;s
          what each service delivers.
        </p>
      </Reveal>

      <ServicesGrid className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" />
    </Section>
  );
}

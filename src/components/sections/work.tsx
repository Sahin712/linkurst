"use client";

import {
  Settings2,
  PenLine,
  Sparkles,
  Newspaper,
  Link2,
  MessageSquare,
  ArrowUp,
  Check,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, fadeInUp, inViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Counts up from 0 to `value` once, when it scrolls into view. */
function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const dur = 1000;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  );
}

/**
 * "The Engine Room" — every channel shown at once as a live dashboard wall
 * (a bento of compact widgets inside one "organic OS" window). Illustrative
 * interface, NOT a live product; every figure is an example, brand is a
 * "YourBrand" placeholder.
 */

function Widget({
  icon: Icon,
  name,
  status,
  className,
  children,
}: {
  icon: React.ElementType;
  name: string;
  status: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "flex flex-col rounded-xl border border-border bg-background/60 p-4 transition-colors duration-300 hover:border-coral/30",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-coral-wash text-coral-600">
          <Icon size={13} />
        </span>
        <span className="text-[13px] font-semibold text-foreground">{name}</span>
        <span className="ml-auto flex items-center gap-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-muted">
          <span className="ember scale-[0.5]" aria-hidden="true" />
          {status}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function Ring({ value }: { value: number }) {
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(28,28,30,0.10)" strokeWidth="7" />
        <motion.circle
          cx="40" cy="40" r="34" fill="none" stroke="var(--color-coral)" strokeWidth="7"
          strokeLinecap="round" strokeDasharray={213}
          initial={{ strokeDashoffset: 213 }}
          whileInView={{ strokeDashoffset: 213 * (1 - value / 100) }}
          viewport={inViewOnce}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp value={value} className="text-lg font-bold text-foreground tabular-nums" />
        <span className="font-[family-name:var(--font-mono)] text-[7px] uppercase tracking-wider text-muted">
          Health
        </span>
      </div>
    </div>
  );
}

export function Work() {
  return (
    <Section id="approach" spacing="lg" containerSize="wide" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.10] blur-[130px]"
        style={{ background: "var(--color-coral)" }}
      />

      <Reveal className="relative max-w-3xl">
        <p className="eyebrow-mono flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-coral" />
          The Engine Room
        </p>
        <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
          Every channel, running in{" "}
          <span className="accent-serif font-normal text-coral">one place</span>.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-fog">
          Search, AI answers, links, and communities don&rsquo;t run in
          isolation. Linkurst operates them as a single system. Here&rsquo;s
          every channel, on one screen.
        </p>
      </Reveal>

      <Reveal className="relative mt-12">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-panel)]">
          {/* chrome */}
          <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
            </span>
            <span className="ml-1 font-[family-name:var(--font-mono)] text-[11px] tracking-tight text-muted">
              linkurst · organic OS
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] text-fog">
              <span className="ember scale-75" aria-hidden="true" />
              6 channels live
            </span>
          </div>

          {/* dashboard wall */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
            variants={staggerContainer}
            className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Technical SEO */}
            <Widget icon={Settings2} name="Technical SEO" status="Site audit">
              <div className="flex items-center gap-4">
                <Ring value={96} />
                <div className="space-y-1 text-[12px]">
                  <p className="text-fog">
                    <span className="font-bold text-coral-600">3</span> critical
                  </p>
                  <p className="text-muted">8 warnings · 12 notices</p>
                  <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                    4,280 URLs crawled
                  </p>
                </div>
              </div>
            </Widget>

            {/* Content */}
            <Widget icon={PenLine} name="Content" status="Pipeline">
              <div className="flex items-end justify-between">
                <div>
                  <CountUp value={48} className="block text-2xl font-bold text-foreground tabular-nums" />
                  <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-muted">
                    briefs live
                  </p>
                </div>
                <p className="text-[11px] font-semibold text-coral-600">+134% sessions</p>
              </div>
              <div className="mt-3 flex h-8 items-end gap-1">
                {[30, 42, 38, 55, 64, 78, 92].map((h, i) => (
                  <motion.span
                    key={i}
                    className={cn(
                      "flex-1 origin-bottom rounded-t-sm",
                      i === 6 ? "bg-coral" : "bg-border",
                    )}
                    style={{ height: `${h}%` }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={inViewOnce}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  />
                ))}
              </div>
            </Widget>

            {/* AI Search */}
            <Widget icon={Sparkles} name="AI Search" status="Citations">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                <CountUp value={64} suffix="%" />
                <span className="ml-1 text-[10px] font-normal text-muted">share of answer</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[["ChatGPT", true], ["Perplexity", true], ["Gemini", true], ["Copilot", false]].map(
                  ([n, cited]) => (
                    <span
                      key={n as string}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px]",
                        cited ? "bg-coral-wash text-coral-600" : "border border-border text-muted",
                      )}
                    >
                      {cited && <Check size={9} />}
                      {n}
                    </span>
                  ),
                )}
              </div>
            </Widget>

            {/* Reddit */}
            <Widget icon={MessageSquare} name="Reddit" status="Threads">
              <div className="rounded-lg border border-border bg-background/60 p-2.5">
                <div className="flex items-center gap-2 text-[10px] text-muted">
                  <span className="font-semibold text-coral-600">r/SaaS</span>
                  <span className="inline-flex items-center gap-0.5">
                    <ArrowUp size={10} className="text-coral" /> 1.4k
                  </span>
                </div>
                <p className="mt-1 text-[12px] font-semibold text-foreground">
                  Best onboarding tool for B2B?
                </p>
                <p className="mt-1.5 text-[11px] leading-snug text-fog">
                  <span className="mark font-semibold text-foreground">YourBrand</span> got us live in a day.
                </p>
              </div>
            </Widget>

            {/* Links */}
            <Widget icon={Link2} name="Links" status="Backlinks">
              <div className="flex items-end justify-between">
                <div>
                  <CountUp value={310} className="block text-2xl font-bold text-foreground tabular-nums" />
                  <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-muted">
                    referring domains
                  </p>
                </div>
                <p className="text-[11px] font-semibold text-coral-600">+18 / mo</p>
              </div>
              <div className="mt-3 flex h-8 items-end gap-2">
                {[45, 68, 82, 96].map((h, i) => (
                  <motion.span
                    key={i}
                    className={cn(
                      "flex-1 origin-bottom rounded-t-sm",
                      i === 3 ? "bg-coral" : "bg-border",
                    )}
                    style={{ height: `${h}%` }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={inViewOnce}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  />
                ))}
              </div>
            </Widget>

            {/* Digital PR */}
            <Widget icon={Newspaper} name="Digital PR" status="Coverage">
              <div className="flex gap-4">
                <div>
                  <CountUp value={24} className="block text-2xl font-bold text-foreground tabular-nums" />
                  <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-muted">
                    placements
                  </p>
                </div>
                <div className="border-l border-border pl-4">
                  <CountUp value={80} suffix="+" className="block text-2xl font-bold text-foreground tabular-nums" />
                  <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-muted">
                    DR80+ links
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-fog">
                Latest: <span className="text-foreground">Tier-1 business title</span>{" "}
                <span className="rounded bg-coral-wash px-1 text-[10px] font-semibold text-coral-600">DR 88</span>
              </p>
            </Widget>
          </motion.div>
        </div>
      </Reveal>
    </Section>
  );
}

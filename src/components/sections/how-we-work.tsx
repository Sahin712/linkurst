"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { inViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * "How We Work" — the Linkurst method as four stacked steps (visual + text +
 * tags), styled after a discipline-showcase layout. Step content adapts a
 * four-part method; each step has its own animated illustrative visual.
 * Positioning copy (opinion), illustrative figures, no testimonials.
 */

const stagger = { visible: { transition: { staggerChildren: 0.09 } } };
const rise = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={stagger}
      className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow-panel)]"
    >
      {children}
    </motion.div>
  );
}

/* ---------- visuals ---------- */

function DiscoverMap() {
  const C = { x: 160, y: 112 };
  const nodes = [
    { label: "Product", x: 52, y: 46 },
    { label: "Customers", x: 268, y: 42 },
    { label: "Competitors", x: 38, y: 118 },
    { label: "Footprint", x: 284, y: 118 },
    { label: "Category", x: 108, y: 192 },
    { label: "Signals", x: 214, y: 190 },
  ];
  const pathOf = (n: { x: number; y: number }) =>
    `M ${n.x} ${n.y} Q ${(n.x + C.x) / 2} ${n.y} ${C.x} ${C.y}`;
  return (
    <Panel>
      <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
        Living knowledge base
      </p>
      <div className="relative h-52">
        <svg viewBox="0 0 320 224" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {nodes.map((n, i) => (
            <g key={n.label}>
              <path d={pathOf(n)} fill="none" stroke="var(--color-coral)" strokeOpacity={0.16} strokeWidth={1} />
              {/* data packet flowing node → business */}
              <circle r="2" fill="var(--color-coral)" className="motion-reduce:hidden">
                <animateMotion dur={`${2.2 + i * 0.25}s`} repeatCount="indefinite" path={pathOf(n)} />
              </circle>
            </g>
          ))}
        </svg>
        <motion.span
          variants={rise}
          className="animate-glow-pulse absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-coral px-3 py-2 text-xs font-bold text-white motion-reduce:animate-none"
          style={{ left: `${(C.x / 320) * 100}%`, top: `${(C.y / 224) * 100}%` }}
        >
          Your business
        </motion.span>
        {nodes.map((n) => (
          <motion.span
            key={n.label}
            variants={rise}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-background px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] text-fog"
            style={{ left: `${(n.x / 320) * 100}%`, top: `${(n.y / 224) * 100}%` }}
          >
            {n.label}
          </motion.span>
        ))}
      </div>
    </Panel>
  );
}

function PlanMatrix() {
  // animated channel-mix allocation for the growth plan
  const mix: [string, number][] = [
    ["Google", 82],
    ["AI Search", 64],
    ["Reddit", 41],
    ["Digital PR", 55],
    ["Links", 48],
  ];
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
          Unified plan · channel mix
        </p>
        <span className="inline-flex items-center gap-1 rounded-md bg-coral-wash px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-semibold text-coral-600">
          <span className="ember scale-[0.5]" aria-hidden="true" /> Prioritized
        </span>
      </div>
      <div className="flex h-52 flex-col justify-center gap-3">
        {mix.map(([name, val], i) => (
          <div key={name}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[12px] text-fog">{name}</span>
              <span className="font-[family-name:var(--font-mono)] text-[11px] font-semibold text-coral-600 tabular-nums">
                {val}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray/15">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  i === 0 ? "bg-coral" : "bg-coral/55",
                )}
                initial={{ width: 0 }}
                whileInView={{ width: `${val}%` }}
                viewport={inViewOnce}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ExecuteBoard() {
  const rows: { label: string; status: "live" | "publishing" | "queued" }[] = [
    { label: "Pillar: onboarding guide", status: "live" },
    { label: "Digital PR: 3 placements", status: "live" },
    { label: "AEO answer block", status: "publishing" },
    { label: "Reddit thread", status: "queued" },
  ];
  const surfaces = ["G", "AI", "R", "PR"];
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
          Deploying across surfaces
        </p>
        <div className="flex gap-1">
          {surfaces.map((s, i) => (
            <span
              key={s}
              className={cn(
                "grid h-5 min-w-5 place-items-center rounded px-1 font-[family-name:var(--font-mono)] text-[8.5px] font-semibold",
                i < 3 ? "bg-coral-wash text-coral-600" : "border border-border text-muted",
              )}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <motion.div
            key={r.label}
            variants={rise}
            className="relative flex items-center gap-2.5 overflow-hidden rounded-lg border border-border bg-background/50 px-3 py-2.5"
          >
            {r.status === "live" ? (
              <span className="grid h-4 w-4 place-items-center rounded-full bg-coral text-[9px] font-bold text-white">
                ✓
              </span>
            ) : r.status === "publishing" ? (
              <span className="ember scale-[0.7]" aria-hidden="true" />
            ) : (
              <span className="h-2 w-2 rounded-full border border-gray/50" />
            )}
            <span className="flex-1 text-[12px] text-fog">{r.label}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider",
                r.status === "live"
                  ? "bg-coral-wash text-coral-600"
                  : r.status === "publishing"
                    ? "text-coral-600"
                    : "text-muted",
              )}
            >
              {r.status}
            </span>
            {r.status === "publishing" && (
              <span className="absolute bottom-0 left-0 block h-0.5 rounded-full bg-coral animate-work motion-reduce:w-1/2" />
            )}
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

function TrackTrends() {
  const bars = [26, 33, 41, 48, 58, 70, 84, 100];
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
          Compounding visibility
        </p>
        <span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold text-coral-600">
          ▲ 10× over time
        </span>
      </div>
      <div className="flex h-40 items-end gap-2">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className={cn(
              "flex-1 origin-bottom rounded-t-sm",
              i >= bars.length - 3 ? "bg-coral" : "bg-gray/25",
            )}
            style={{ height: `${h}%` }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={inViewOnce}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Ranking ▲ #3 → #1", "AI citations ▲", "Revenue ↑ 29%"].map((a) => (
          <motion.span
            key={a}
            variants={rise}
            className="rounded-md border border-coral-100 bg-coral-wash px-2 py-0.5 text-[10px] font-medium text-coral-600"
          >
            {a}
          </motion.span>
        ))}
      </div>
    </Panel>
  );
}

/* ---------- steps ---------- */

const steps = [
  {
    title: "Get inside your business",
    body: "We learn your product, customers, competitors, and footprint until we plug in just like your own team. No long ramp, no hand-holding.",
    tags: ["Company profile", "ICP & personas", "Competitor map", "Category audit"],
    Visual: DiscoverMap,
  },
  {
    title: "Build your growth plan",
    body: "A unified strategy across Google and LLMs, prioritized by impact so you get seen fast, not eventually.",
    tags: ["Opportunity scoring", "Channel strategy", "Roadmap", "Quick wins"],
    Visual: PlanMatrix,
  },
  {
    title: "Execute what moves the needle",
    body: "Product-led content, high-authority links, AEO, and brand signals that push you across every search surface, shipped on a predictable cadence.",
    tags: ["Content engineering", "AEO / GEO", "Digital PR", "Link building", "Reddit"],
    Visual: ExecuteBoard,
  },
  {
    title: "Scale what works",
    body: "Continuous iteration, clear reporting, and ongoing collaboration focused on revenue, not vanity metrics.",
    tags: ["Rank & citation tracking", "Reporting", "Content refreshes", "Always-on"],
    Visual: TrackTrends,
  },
];

export function HowWeWork() {
  return (
    <Section
      id="methodology"
      spacing="lg"
      className="bg-[#f1ede4]"
    >
      <Reveal className="max-w-3xl">
        <p className="eyebrow-mono flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-coral" />
          How we work
        </p>
        <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
          The Linkurst{" "}
          <span className="accent-serif font-normal text-coral">method</span>.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-fog">
          Designed for speed, scale, and revenue. One connected engine across
          Google, AI search, and Reddit.
        </p>
      </Reveal>

      <div className="mt-16 flex flex-col gap-16 lg:gap-24">
        {steps.map((s, i) => {
          const Visual = s.Visual;
          return (
            <div
              key={s.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <div>
                <Visual />
              </div>
              <Reveal>
                <p className="font-[family-name:var(--font-mono)] text-sm font-medium text-coral-600">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-fog">
                  {s.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-tight text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

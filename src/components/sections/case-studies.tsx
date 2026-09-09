import { TrendingUp } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";

const cases = [
  {
    tag: "SaaS",
    title: "From 8K to 80K monthly organic visitors.",
    metric: "10X organic traffic",
    curve: [12, 16, 20, 28, 34, 46, 60, 82],
  },
  {
    tag: "Travel",
    title: "From DR 4 to DR 43 in 9 months.",
    metric: "+39 DR",
    curve: [6, 10, 14, 22, 30, 41, 58, 74],
  },
  {
    tag: "E-commerce",
    title: "From 219 to 5.9K organic visitors.",
    metric: "5K+ additional monthly organic visitors",
    curve: [4, 8, 12, 18, 30, 44, 62, 88],
  },
];

export function CaseStudies() {
  return (
    <Section spacing="lg">
      <SectionHeader
        eyebrow="Selected work"
        title="Strategies that turned visibility into growth."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {cases.map((c) => (
          <Reveal
            key={c.title}
            className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-card)]"
          >
            <div className="border-b border-border p-5">
              <GrowthCurve points={c.curve} />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="w-fit rounded-full bg-charcoal px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-ivory">
                {c.tag}
              </span>
              <h3 className="mt-4 text-xl font-bold leading-snug tracking-tight text-foreground">
                {c.title}
              </h3>
              <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-coral-600">
                <TrendingUp size={15} />
                {c.metric}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="caption mt-6 text-xs">
        Anonymized client engagements. Results reflect Linkurst&rsquo;s work and
        vary by market and starting point.
      </p>
    </Section>
  );
}

function GrowthCurve({ points }: { points: number[] }) {
  const W = 300;
  const H = 90;
  const P = 6;
  const stepX = (W - P * 2) / (points.length - 1);
  const line = points
    .map((p, i) => {
      const x = P + i * stepX;
      const y = P + (1 - p / 100) * (H - P * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${line} L ${W - P} ${H - P} L ${P} ${H - P} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={area} fill="var(--color-coral)" opacity={0.08} />
      <path
        d={line}
        fill="none"
        stroke="var(--color-coral)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

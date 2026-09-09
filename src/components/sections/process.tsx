import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";

const steps = [
  {
    num: "01",
    title: "Discover",
    body: "Understand your market, competitors, audience, and current organic visibility.",
  },
  {
    num: "02",
    title: "Diagnose",
    body: "Identify where competitors are winning and where your brand is underrepresented.",
  },
  {
    num: "03",
    title: "Prioritize",
    body: "Focus on opportunities based on relevance, potential impact, authority, and effort.",
  },
  {
    num: "04",
    title: "Execute",
    body: "Deploy the right combination of SEO, content, Digital PR, links, citations, and visibility campaigns.",
  },
  {
    num: "05",
    title: "Measure",
    body: "Track visibility, authority, mentions, citations, rankings, and qualified organic demand.",
  },
];

export function Process() {
  return (
    <Section spacing="lg" className="bg-surface">
      <SectionHeader
        eyebrow="How it works"
        title="From visibility gaps to organic growth."
      />

      <Reveal>
        <ol className="mt-12 grid gap-y-10 md:grid-cols-5 md:gap-x-6">
          {steps.map((step, i) => (
            <li
              key={step.num}
              className="relative flex gap-4 md:flex-col md:gap-0"
            >
              {/* connector line */}
              <div className="relative flex flex-col items-center md:h-auto md:w-full md:flex-row">
                <span className="z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-coral bg-background text-sm font-bold text-coral-600">
                  {step.num}
                </span>
                {/* vertical line (mobile) */}
                {i < steps.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-border md:hidden" />
                )}
                {/* horizontal line (desktop) */}
                {i < steps.length - 1 && (
                  <span className="hidden h-px flex-1 bg-border md:block" />
                )}
              </div>
              <div className="pb-2 md:mt-5 md:pr-4">
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fog">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

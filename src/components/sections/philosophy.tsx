import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/motion/reveal";

export function Philosophy() {
  return (
    <Section spacing="lg" className="bg-surface" containerSize="narrow">
      <Reveal className="flex flex-col gap-6">
        <Eyebrow className="font-medium uppercase not-italic tracking-[0.18em] text-coral-600">
          Our approach
        </Eyebrow>

        <Heading size="xl">SEO shouldn&rsquo;t exist in silos.</Heading>

        <p className="text-lg leading-relaxed text-fog">
          Search visibility is no longer built through one channel. Your
          customers discover brands through Google, AI answers, Reddit,
          publications, communities, and recommendations.
        </p>

        <p className="text-lg leading-relaxed text-fog">
          Rather than treating these channels separately, Linkurst connects them
          into one organic growth system designed to build visibility,
          authority, and qualified inbound demand.
        </p>

        <p className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Find the gap. Build the authority.{" "}
          <span className="text-coral-600">Become more discoverable.</span>
        </p>
      </Reveal>
    </Section>
  );
}

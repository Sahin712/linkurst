import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";

export function Founder() {
  return (
    <Section spacing="lg">
      <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          {/* Founder photo placeholder — replace with a professional portrait. */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[var(--radius-xl)] border border-border bg-charcoal">
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl font-bold tracking-tight text-ivory/90">
                SK
              </span>
            </div>
            <span className="caption absolute bottom-3 left-4 text-[0.7rem] text-ivory/50">
              Founder portrait
            </span>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeader
            eyebrow="The person behind Linkurst"
            title="Built from years in the SEO trenches."
          />
          <Reveal className="mt-6 flex flex-col gap-5">
            <p className="text-lg leading-relaxed text-fog">
              I&rsquo;ve spent 5+ years working across SEO, link acquisition,
              Digital PR, and organic growth.
            </p>
            <p className="text-lg leading-relaxed text-fog">
              After seeing how fragmented organic strategies can become, I built
              Linkurst around a simple idea: don&rsquo;t optimize for one search
              engine. Build visibility everywhere your customers are looking.
            </p>
            <div className="mt-2 border-l-2 border-coral pl-4">
              <p className="text-base font-bold tracking-tight text-foreground">
                SK Sahin
              </p>
              <p className="caption text-sm">Founder, Linkurst</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

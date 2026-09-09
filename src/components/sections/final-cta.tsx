import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  return (
    <Section id="contact" spacing="lg" className="bg-charcoal">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Heading size="xl" className="text-ivory">
          Ready to build your organic visibility?
        </Heading>
        <p className="mt-5 text-lg leading-relaxed text-gray">
          Find the gaps. Build the authority. Turn organic discovery into
          qualified demand.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="#contact" size="lg">
            Get Your Growth Strategy
            <ArrowRight size={18} />
          </Button>
          <Button
            href="#contact"
            variant="ghost"
            size="lg"
            className="border-slate/60 text-ivory hover:bg-slate/20"
          >
            Book a Call
          </Button>
        </div>

        <p className="caption mt-8 max-w-md text-sm text-gray">
          No generic SEO packages. No vanity metrics. A strategy built around
          your growth goals.
        </p>
      </Reveal>
    </Section>
  );
}

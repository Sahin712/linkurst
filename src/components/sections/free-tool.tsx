import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { ReportPreview } from "@/components/tools/report-preview";

/**
 * Homepage promo for the free Listicle Finder tool — the lead magnet.
 * Shows the real report dashboard preview, then a CTA into the tool.
 */
export function FreeTool() {
  return (
    <Section id="free-tool" spacing="lg" className="bg-surface">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow-mono flex items-center justify-center gap-2 text-coral">
          <span className="inline-block h-px w-6 bg-coral" />
          Free tool
          <span className="inline-block h-px w-6 bg-coral" />
        </p>
        <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
          See the listicles{" "}
          <span className="accent-serif font-normal text-coral">AI cites</span> for your
          category.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-fog">
          Our free Listicle Finder scores every &ldquo;best of&rdquo; list ranking for your keyword
          by authority, traffic, and freshness, then flags the placements where competitors beat
          you. No signup.
        </p>
      </Reveal>

      <Reveal className="mt-12 sm:mt-14">
        <ReportPreview />
      </Reveal>

      <Reveal className="mt-8 flex flex-col items-center gap-3">
        <Button href="/tools/listicle-finder" size="lg">
          Try the Listicle Finder free
          <ArrowRight size={18} />
        </Button>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted">
          Free · No signup · Report sent to your inbox
        </p>
      </Reveal>
    </Section>
  );
}

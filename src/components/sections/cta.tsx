import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";

/**
 * Closing CTA — a highlighted, contained panel that stands off the page:
 * coral-tinted glow, centered roman + serif-italic headline, and CTAs.
 */
export function Cta() {
  return (
    <Section id="contact" spacing="lg">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-[28px] border border-coral/25 px-6 py-16 text-center shadow-[0_30px_80px_-30px_rgba(232,85,58,0.35)] sm:px-12 sm:py-20"
          style={{
            background:
              "radial-gradient(130% 130% at 50% 0%, rgba(232,85,58,0.16) 0%, #17171b 42%, #0e0e11 100%)",
          }}
        >
          {/* corner glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-[90px]"
            style={{ background: "var(--color-coral)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full opacity-20 blur-[100px]"
            style={{ background: "var(--color-coral)" }}
          />

          <div className="relative mx-auto max-w-2xl">
            <p className="eyebrow-mono text-coral">[ The first move ]</p>
            <h2 className="mx-auto mt-6 text-4xl font-bold leading-[1.06] tracking-[var(--tracking-tighter)] text-balance sm:text-[3.25rem]">
              <span className="text-ivory">Your buyers are already searching.</span>{" "}
              <span className="accent-serif font-normal text-coral">
                Make sure they find you.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">
              A free 30-minute strategy call. We&rsquo;ll show you where you show
              up across Google, AI answers, and Reddit today: what&rsquo;s
              working, and the fastest wins to fix first.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button
                href={siteConfig.bookingUrl}
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a strategy call
                <ArrowRight size={18} />
              </Button>
              <Button
                href="#methodology"
                variant="ghost"
                size="lg"
                className="border-white/20 text-ivory hover:bg-white/5"
              >
                See how it works
              </Button>
            </div>

            <p className="mt-7 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.1em] text-ivory/55">
              No generic packages · No vanity metrics · No obligation
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

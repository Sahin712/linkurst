import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20">
      {/* dotted field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(58,58,61,0.11) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 0%, #000 22%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 0%, #000 22%, transparent 80%)",
        }}
      />
      {/* warm coral highlight, top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-[460px] w-[560px] rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(232,85,58,0.7), transparent 65%)",
        }}
      />
      {/* soft light lift behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-70 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,252,248,0.9), transparent 70%)",
        }}
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left column — above the fold, visible at rest (no scroll-reveal) */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-[12.5px] text-fog shadow-[var(--shadow-card)]">
                <span className="ember" aria-hidden="true" />
                Organic-growth studio for SaaS &amp; B2B
              </span>
              <span className="eyebrow-mono flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11px] text-gray">
                SEO
                <span className="h-1 w-1 rounded-full bg-coral" />
                AEO
                <span className="h-1 w-1 rounded-full bg-coral" />
                GEO
              </span>
            </div>

            <h1 className="mt-6 text-balance text-[2.75rem] font-bold leading-[1.03] tracking-[var(--tracking-tighter)] text-foreground sm:text-6xl lg:text-[4.25rem]">
              Build organic visibility across{" "}
              <span className="accent-serif font-normal">Google</span>,{" "}
              <span className="mark">AI search</span>, and Reddit.
            </h1>

            <p className="eyebrow-mono mt-6 text-fog">
              Turn search, AI answers &amp; Reddit into{" "}
              <span className="mark text-coral-600">qualified demand</span>
            </p>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fog">
              We help SaaS and B2B companies become the answer buyers find
              first, wherever they search. One strategy, every surface that
              drives qualified demand.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                href={siteConfig.bookingUrl}
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book your strategy call
                <ArrowRight size={18} />
              </Button>
              <Button href="#methodology" variant="ghost" size="lg">
                See How It Works
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          {/* Right column — interface specimen */}
          <div>
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}

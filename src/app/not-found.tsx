import { ArrowRight, Search, Home } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* dotted field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(58,58,61,0.11) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 20%, transparent 78%)",
        }}
      />
      {/* warm coral glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[620px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(232,85,58,0.6), transparent 65%)",
        }}
      />

      <Container size="default" className="relative">
        <div className="mx-auto max-w-2xl text-center">
          {/* 404 lockup */}
          <p className="eyebrow-mono flex items-center justify-center gap-2 text-coral">
            <span className="inline-block h-px w-6 bg-coral" />
            Error 404
            <span className="inline-block h-px w-6 bg-coral" />
          </p>

          {/* empty search-result specimen */}
          <div className="mx-auto mt-8 max-w-md select-none rounded-2xl border border-border bg-surface p-4 text-left shadow-[var(--shadow-panel)]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="ml-2 flex-1 truncate rounded-md bg-background px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10.5px] text-muted">
                google.com/search
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
              <Search size={13} className="text-muted" />
              <span className="truncate text-[12px] text-fog">
                the page you were looking for
              </span>
            </div>
            <div className="mt-3 rounded-xl border border-dashed border-border bg-background/60 px-3 py-5 text-center">
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-muted">
                0 results found
              </p>
              <p className="mt-1.5 text-[12.5px] text-fog">
                This page isn&rsquo;t in the index.
              </p>
            </div>
          </div>

          <h1 className="mt-10 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
            Even we can&rsquo;t rank a page{" "}
            <span className="accent-serif font-normal text-coral">
              that doesn&rsquo;t exist.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-fog">
            The link you followed is broken or the page has moved. Let&rsquo;s
            get you back to something discoverable.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
            <Button href="/" size="lg" className="w-full sm:w-auto">
              <Home size={18} />
              Back to homepage
            </Button>
            <Button
              href={siteConfig.bookingUrl}
              variant="ghost"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              Book a strategy call
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/ui/container";

/**
 * Shared layout for legal/policy pages (Privacy, Terms). Editorial single-column
 * reading layout with brand-tokened prose styling applied to child elements.
 */
export function LegalShell({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* soft top glow to match the rest of the site */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-[360px] w-[520px] rounded-full opacity-[0.12] blur-[120px]"
        style={{ background: "var(--color-coral)" }}
      />
      <Container size="default" className="relative">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow-mono flex items-center gap-2 text-coral">
            <span className="inline-block h-px w-6 bg-coral" />
            {eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-muted">
            Last updated: {updated}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-fog">{intro}</p>

          <div
            className={[
              "mt-12 text-[15px] leading-relaxed text-fog",
              "[&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:sm:text-2xl",
              "[&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground",
              "[&_p]:mt-4",
              "[&_ul]:mt-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-0",
              "[&_li]:relative [&_li]:pl-6",
              "[&_li:before]:absolute [&_li:before]:left-0 [&_li:before]:top-[0.6em] [&_li:before]:h-1.5 [&_li:before]:w-1.5 [&_li:before]:rounded-full [&_li:before]:bg-coral [&_li:before]:content-['']",
              "[&_a]:font-medium [&_a]:text-coral-600 [&_a]:underline [&_a]:decoration-coral/30 [&_a]:underline-offset-2 hover:[&_a]:decoration-coral",
              "[&_strong]:font-semibold [&_strong]:text-foreground",
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

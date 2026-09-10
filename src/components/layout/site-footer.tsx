import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";
import logoMark from "../../../public/brand/logo.png";

const columns = [
  {
    heading: "Explore",
    links: [
      { label: "The System", href: "#approach" },
      { label: "How it works", href: "#methodology" },
      { label: "Services", href: "#services" },
      { label: "90-Day Plan", href: "#plan" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "AEO Content Grader", href: "/tools/aeo-content-grader" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "Book a call", href: siteConfig.bookingUrl, external: true },
      { label: "Sahin@linkurst.com", href: "mailto:Sahin@linkurst.com" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/sk-sahin/",
        external: true,
      },
      { label: "Twitter / X", href: "https://x.com/sksahin03", external: true },
    ],
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container size="wide" className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* brand */}
          <div className="max-w-sm">
            <Link href="/" aria-label={`${siteConfig.name} — home`}>
              <Image
                src={logoMark}
                alt="Linkurst"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              The organic-visibility studio for SaaS &amp; B2B. We help founders
              get found across Google, AI answers, and Reddit, not just ranked.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-1">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-11 items-center rounded-sm text-[15px] text-foreground/75 transition-colors hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-7 sm:flex-row sm:items-center">
          <p className="font-[family-name:var(--font-mono)] text-xs text-muted">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="inline-flex items-center rounded-sm py-2 text-xs text-muted transition-colors hover:text-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-flex items-center rounded-sm py-2 text-xs text-muted transition-colors hover:text-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

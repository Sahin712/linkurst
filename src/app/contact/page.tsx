import type { Metadata } from "next";
import { Calendar, Mail, ArrowUpRight, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/tools/contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Linkurst | Let's get you found",
  description:
    "Get in touch with Linkurst about organic visibility across Google, AI search, and Reddit. Book a strategy call or send us a message — we reply within one business day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Linkurst",
    description: "Book a strategy call or send a message — we reply within one business day.",
    url: "/contact",
    type: "website",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Linkurst",
  url: `${siteConfig.url}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.name,
    email: siteConfig.email,
    url: siteConfig.url,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.email,
      url: siteConfig.bookingUrl,
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <Section spacing="lg" className="relative overflow-hidden">
        {/* soft coral wash behind the header */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 hidden h-[360px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-[110px] sm:block"
          style={{ background: "radial-gradient(circle, rgba(232,85,58,0.14), transparent 70%)" }}
        />

        <div className="relative">
          <div className="max-w-2xl">
            <p className="eyebrow-mono flex items-center gap-2 text-coral">
              <span className="ember" aria-hidden="true" />
              Contact
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
              Let&rsquo;s make you the{" "}
              <span className="accent-serif font-normal text-coral">answer</span> buyers find.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fog">
              Tell us what you want to get found for. Book a call to map it live, or send a note and
              we&rsquo;ll get back to you within one business day.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
            {/* Left — ways to reach us (below the form on mobile) */}
            <div className="order-2 flex flex-col gap-4 lg:order-1">
              {/* Book a call — primary */}
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-coral/25 p-6 shadow-[0_20px_60px_-30px_rgba(232,85,58,0.4)] transition-transform hover:-translate-y-0.5"
                style={{
                  background:
                    "radial-gradient(130% 130% at 0% 0%, rgba(232,85,58,0.18) 0%, #17171b 45%, #0e0e11 100%)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-30 blur-[70px]"
                  style={{ background: "var(--color-coral)" }}
                />
                <div className="relative flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coral text-white shadow-[var(--shadow-card)]">
                    <Calendar size={20} />
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-[16px] font-bold tracking-tight text-ivory">
                      Book a strategy call
                      <ArrowUpRight
                        size={16}
                        className="text-coral transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ivory/70">
                      A free 30-minute call. We&rsquo;ll audit your visibility and map your fastest
                      wins across Google, AI answers, and Reddit.
                    </p>
                  </div>
                </div>
              </a>

              {/* Direct channels */}
              <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
                <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted">
                  Prefer direct?
                </p>
                <div className="mt-4 flex flex-col divide-y divide-border">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="group flex items-center gap-3 py-3 first:pt-0"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-coral-wash text-coral-600">
                      <Mail size={16} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-muted">
                        Email
                      </span>
                      <span className="text-[14px] font-medium text-foreground group-hover:text-coral-600">
                        {siteConfig.email}
                      </span>
                    </span>
                    <ArrowUpRight size={15} className="text-muted group-hover:text-coral-600" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sk-sahin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 py-3"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-coral-wash text-[13px] font-bold text-coral-600">
                      in
                    </span>
                    <span className="flex-1">
                      <span className="block text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-muted">
                        LinkedIn
                      </span>
                      <span className="text-[14px] font-medium text-foreground group-hover:text-coral-600">
                        Connect with Linkurst
                      </span>
                    </span>
                    <ArrowUpRight size={15} className="text-muted group-hover:text-coral-600" />
                  </a>
                  <a
                    href={siteConfig.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 py-3 last:pb-0"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-coral-wash font-bold text-coral-600">
                      𝕏
                    </span>
                    <span className="flex-1">
                      <span className="block text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-muted">
                        X / Twitter
                      </span>
                      <span className="text-[14px] font-medium text-foreground group-hover:text-coral-600">
                        @sksahin03
                      </span>
                    </span>
                    <ArrowUpRight size={15} className="text-muted group-hover:text-coral-600" />
                  </a>
                </div>
              </div>

              {/* Free tools nudge */}
              <a
                href="/tools/listicle-finder"
                className="group inline-flex items-center gap-2 px-1 text-[13.5px] font-medium text-fog transition-colors hover:text-coral-600"
              >
                Not ready to talk? Try the free Listicle Finder
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>

            {/* Right — the form (first on mobile) */}
            <div className="order-1 lg:order-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

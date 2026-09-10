"use client";

import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";
import { faqs } from "@/lib/faqs";
import { cn } from "@/lib/utils";

/**
 * FAQ — two-column: sticky header + CTA on the left, accordion on the right.
 * Honest answers (no guarantees). Content lives in @/lib/faqs (shared with the
 * FAQPage JSON-LD schema).
 */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" spacing="lg">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* left — sticky header + CTA */}
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow-mono flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral" />
            FAQ
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
            Everything you need{" "}
            <span className="accent-serif font-normal text-coral">
              to know.
            </span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-fog">
            Organic visibility works differently now. Here&rsquo;s what founders
            ask us most.
          </p>
          <Button
            href={siteConfig.bookingUrl}
            size="lg"
            className="mt-8"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call
            <ArrowRight size={18} />
          </Button>
        </Reveal>

        {/* right — accordion */}
        <Reveal>
          <ul className="border-t border-border">
            {faqs.map((item, i) => {
              const isOpen = i === open;
              return (
                <li key={item.q} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 rounded-lg py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    <span
                      className={cn(
                        "text-[17px] font-semibold tracking-tight transition-colors sm:text-lg",
                        isOpen ? "text-foreground" : "text-fog group-hover:text-foreground",
                      )}
                    >
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors",
                        isOpen ? "border-coral bg-coral-wash text-coral-600" : "border-border text-muted group-hover:text-foreground",
                      )}
                    >
                      <Plus
                        size={16}
                        className={cn("transition-transform duration-300", isOpen && "rotate-45")}
                      />
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pr-12 text-[15px] leading-relaxed text-fog">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

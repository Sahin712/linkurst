"use client";

import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * FAQ — two-column: sticky header + CTA on the left, accordion on the right.
 * Honest answers (no guarantees).
 */

const faqs = [
  {
    q: "What exactly does Linkurst do?",
    a: "We build organic visibility for SaaS and B2B companies across Google, AI search, and Reddit, running SEO, AEO/GEO, Digital PR, links, content, and community as one connected system.",
  },
  {
    q: "How is this different from a traditional SEO agency?",
    a: "Traditional SEO optimizes for Google's ten blue links. We optimize for where buyers actually discover you now: search, AI answers, and communities. The old playbook only sees a third of the picture.",
  },
  {
    q: "What is AI Search (AEO / GEO), and why does it matter?",
    a: "It's making your brand the cited answer in ChatGPT, Perplexity, Gemini, and Google's AI Overviews. As buyers ask models instead of searching, being the referenced source becomes the new ranking.",
  },
  {
    q: "Do you guarantee rankings or results?",
    a: "No one credible can guarantee rankings or citations. We commit to a clear methodology, transparent reporting, and measurable progress on visibility, authority, and qualified demand.",
  },
  {
    q: "How long until we see results?",
    a: "It varies by market and starting point. Foundations land in the first 30 days; content, links, and citations compound over the following weeks. You'll see progress reported every step.",
  },
  {
    q: "Can we engage one service, or is it all-or-nothing?",
    a: "You can start with the pieces you need most. The disciplines work best together, but we'll scope an engagement around your goals and budget.",
  },
  {
    q: "How do you work with our in-house team?",
    a: "We plug in like an extension of your team, sharing the plan, the reporting, and the workflows, so you always know what's happening and why.",
  },
  {
    q: "How do we get started?",
    a: "Book a call. We'll audit your current visibility across search, AI, and Reddit, map the biggest opportunities, and propose a plan.",
  },
];

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
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left"
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
                        isOpen ? "border-coral bg-coral-wash text-coral-600" : "border-border text-gray group-hover:text-foreground",
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

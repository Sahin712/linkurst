import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AeoGrader } from "@/components/tools/aeo-grader";
import { Reveal } from "@/components/motion/reveal";
import { Cta } from "@/components/sections/cta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free AEO Content Grader | Score Your Content for AI Search",
  description:
    "Paste your content and get an instant AEO readiness score. See exactly what to fix so ChatGPT, Perplexity, and Google's AI answers cite your page. Free, no signup.",
  alternates: { canonical: "/tools/aeo-content-grader" },
  openGraph: {
    title: "Free AEO Content Grader | Linkurst",
    description:
      "Score any page for AI-search readiness in seconds. Free, runs in your browser, no signup.",
    url: "/tools/aeo-content-grader",
    type: "website",
  },
};

const steps = [
  {
    n: "01",
    t: "Enter a URL or paste",
    d: "Give us a page URL and we fetch the live HTML, or paste your copy directly, whichever is easier.",
  },
  {
    n: "02",
    t: "Get your score",
    d: "We grade the content against ten AEO best practices, from direct answers and question headings to schema and specificity.",
  },
  {
    n: "03",
    t: "Fix what's failing",
    d: "Each check comes with a concrete fix, ranked so you know what to change first to become the cited answer.",
  },
];

const pillars = [
  {
    name: "Answerability",
    weight: 45,
    blurb: "Can an AI lift a clean, self-contained answer straight from the page?",
    signals: [
      ["Direct answer up top", 15],
      ["Question-based headings", 15],
      ["Scannable structure", 15],
    ],
  },
  {
    name: "Structure",
    weight: 30,
    blurb: "Is the page organized so sections map to what people ask?",
    signals: [
      ["Clear heading structure", 10],
      ["Readability", 10],
      ["Content depth", 10],
    ],
  },
  {
    name: "Authority & Trust",
    weight: 20,
    blurb: "Does the content read as credible, specific, and sourced?",
    signals: [
      ["Specific facts & data", 10],
      ["Freshness signals", 5],
      ["Sources & links", 5],
    ],
  },
  {
    name: "Technical",
    weight: 5,
    blurb: "Is the page machine-readable to search and answer engines?",
    signals: [["Structured data (schema)", 5]],
  },
] as const;

const gradeBands = [
  ["A", "85–100", "Strong AI-search readiness"],
  ["B", "70–84", "Good foundation, a few fixes"],
  ["C", "55–69", "Middling, real work needed"],
  ["D / F", "Below 55", "Not built to be the answer yet"],
] as const;

export default function AeoContentGraderPage() {
  return (
    <>
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-[360px] w-[520px] rounded-full opacity-[0.12] blur-[120px]"
        style={{ background: "var(--color-coral)" }}
      />
      <Container size="default" className="relative">
        <div className="mx-auto max-w-3xl">
          {/* header */}
          <Reveal>
            <p className="eyebrow-mono flex items-center gap-2 text-coral">
              <span className="inline-block h-px w-6 bg-coral" />
              Free tool
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
              AEO Content{" "}
              <span className="accent-serif font-normal text-coral">Grader</span>.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-fog">
              Will AI search cite your content? Enter a URL (or paste your copy)
              and get an instant readiness score, plus the exact fixes that make
              ChatGPT, Perplexity, and Google&rsquo;s AI answers pick you as the
              source.
            </p>
          </Reveal>

          {/* the tool */}
          <AeoGrader />

          {/* how it works */}
          <Reveal id="methodology" className="mt-20 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              How it works
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n}>
                  <p className="font-[family-name:var(--font-mono)] text-sm font-medium text-coral-600">
                    {s.n}
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-foreground">{s.t}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-fog">{s.d}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* methodology */}
          <Reveal className="mt-16 border-t border-border pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Methodology
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-fog">
              The grader scores <strong className="font-semibold text-foreground">ten signals</strong>{" "}
              that consistently correlate with getting cited by AI search and
              ranking in traditional search, grouped into{" "}
              <strong className="font-semibold text-foreground">four pillars</strong>{" "}
              worth 100 points total. It&rsquo;s a transparent, rules-based
              analysis that runs on the page&rsquo;s text and HTML, not a live
              AI query, so the same content always gets the same score.
            </p>

            {/* pillar breakdown */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {pillars.map((p) => (
                <div
                  key={p.name}
                  className="rounded-[var(--radius-xl)] border border-border bg-surface p-5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      {p.name}
                    </h3>
                    <span className="rounded-full bg-coral-wash px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-coral-600">
                      {p.weight} pts
                    </span>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-fog">{p.blurb}</p>
                  <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                    {p.signals.map(([label, pts]) => (
                      <li
                        key={label}
                        className="flex items-center justify-between text-[13px]"
                      >
                        <span className="flex items-center gap-2 text-fog">
                          <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                          {label}
                        </span>
                        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-muted">
                          {pts}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* grade bands */}
            <h3 className="mt-10 text-base font-semibold text-foreground">Grade bands</h3>
            <div className="mt-4 overflow-hidden rounded-[var(--radius-xl)] border border-border">
              {gradeBands.map(([g, range, meaning], i) => (
                <div
                  key={g}
                  className={cn(
                    "grid grid-cols-[auto_1fr] items-center gap-4 bg-surface px-5 py-3.5 sm:grid-cols-[80px_120px_1fr]",
                    i > 0 && "border-t border-border",
                  )}
                >
                  <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-coral-600">
                    {g}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[12px] tabular-nums text-muted">
                    {range}
                  </span>
                  <span className="col-span-2 text-[13.5px] text-fog sm:col-span-1">
                    {meaning}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              Note: this tool checks how <em>citable</em> your content is, it
              does not query ChatGPT, Perplexity, or Gemini to see whether they
              currently cite you. It measures the on-page signals you control.
            </p>
          </Reveal>

          {/* context */}
          <Reveal className="mt-16 border-t border-border pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              What is AEO, and why grade for it?
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-fog">
              Answer engine optimization (AEO) is the practice of structuring
              content so AI assistants cite it as the answer. As more buyers ask
              ChatGPT, Perplexity, and Gemini instead of scrolling ten blue
              links, being the <strong className="font-semibold text-foreground">referenced source</strong>{" "}
              becomes the new ranking.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-fog">
              This grader is a transparent, rules-based checklist, not a live
              model query. It scores the signals that consistently correlate
              with getting cited: a direct answer up top, question-based
              headings, scannable structure, concrete specifics, readability,
              freshness, schema, and sources. Fix the fails and you give every
              answer engine a cleaner, more quotable page to pull from.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>

    {/* closing CTA, same treatment as the homepage */}
    <Cta />
    </>
  );
}

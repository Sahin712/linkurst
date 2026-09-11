import type { Metadata } from "next";
import Image from "next/image";
import { Target, Download, Check, Search, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ListicleFinder } from "@/components/tools/listicle-finder";
import { EngineChips } from "@/components/tools/engine-chips";
import { ReportPreview } from "@/components/tools/report-preview";
import { ScoreRing } from "@/components/tools/metric-cells";
import { AiAnswerDemo } from "@/components/tools/ai-answer-demo";
import { Reveal } from "@/components/motion/reveal";
import { Cta } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Free Listicle Finder | Get Featured on Listicles AI Cites",
  description:
    "Find the 'best of' and 'top' listicles ranking for your keyword, see which rank your competitors but not you, and get the placement opportunities that win AI-search citations. Free, no signup.",
  alternates: { canonical: "/tools/listicle-finder" },
  openGraph: {
    title: "Free Listicle Finder | Linkurst",
    description:
      "Find listicles ranking for your keyword and the placement gaps where competitors beat you.",
    url: "/tools/listicle-finder",
    type: "website",
  },
};

// Full-color brand marks served from /public/tools (real SEO toolstack).
const toolLogos = [
  { name: "Google", file: "google" },
  { name: "Ahrefs", file: "ahrefs" },
  { name: "Spreadsheet", file: "spreadsheet" },
  { name: "Gmail", file: "gmail" },
] as const;

const faqs = [
  { q: "What exactly does the Listicle Finder do?", a: "It finds the 'best of' and 'top' listicles ranking for your keyword, scores each by domain and page authority, checks how recently they were updated, and flags which ones feature your competitors but not you." },
  { q: "Do I need to sign up?", a: "No. Enter your keyword, get your report by email, no account and no credit card. If you want help actually landing the placements, that's where Linkurst comes in." },
  { q: "Why do listicles matter for AI search?", a: "When buyers ask ChatGPT, Perplexity, or Gemini for the best tool in a category, the answers lean heavily on third-party 'best of' listicles. Being on those pages is one of the highest-leverage ways to get recommended in AI answers." },
  { q: "How is this different from outreach tools?", a: "Outreach tools scrape editor contacts and push you into cold email. We stay focused on the intelligence: which listicles matter and where your gaps are. Cleaner, free, and no contact data required." },
  { q: "How long does it take?", a: "A few minutes. We analyze each listicle live, so rather than making you wait on the page, we email your report the moment it's ready." },
];

export default function ListicleFinderPage() {
  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-[360px] w-[520px] rounded-full opacity-[0.12] blur-[120px]"
          style={{ background: "var(--color-coral)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-40 h-[320px] w-[420px] rounded-full opacity-[0.08] blur-[120px]"
          style={{ background: "var(--color-coral)" }}
        />
        {/* glow behind the form so the frosted glass reads */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[64%] h-[420px] w-[680px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[130px]"
          style={{ background: "var(--color-coral)" }}
        />
        <Container size="default" className="relative">
          <div className="mx-auto max-w-3xl">
            {/* hero */}
            <Reveal>
              <p className="eyebrow-mono flex items-center gap-2 text-coral">
                <span className="inline-block h-px w-6 bg-coral" />
                Free tool · No signup
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-[1.04] tracking-[var(--tracking-tighter)] text-balance text-foreground sm:text-5xl">
                Get on the listicles{" "}
                <span className="accent-serif font-normal text-coral">AI actually cites</span>.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-fog">
                When buyers ask AI for the best tool in your category, it answers
                from &ldquo;best of&rdquo; listicles. Find the ones ranking for
                your topic, see where competitors beat you, and win the
                placements that get you recommended.
              </p>
              {/* engines strip */}
              <EngineChips />
            </Reveal>

            {/* the form */}
            <div id="finder" className="scroll-mt-24">
              <ListicleFinder />
            </div>
          </div>

          {/* ---- problem / solution ---- */}
          <Reveal className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Finding placements by hand doesn&rsquo;t scale
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-relaxed text-fog">
              Getting your brand onto the right listicles by hand means jumping
              between tools, pulling the data yourself, and checking every
              article one by one. Linkurst does it in one pass, then helps you
              actually land the placements.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
                <div className="flex items-center gap-2">
                  {toolLogos.map((logo) => (
                    <span
                      key={logo.name}
                      title={logo.name}
                      className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background"
                    >
                      <Image
                        src={`/tools/${logo.file}.svg`}
                        alt={logo.name}
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-2xl font-bold text-foreground">~1 hour, by hand</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-fog">
                  Searching Google, checking authority in Ahrefs, opening every
                  article to see who&rsquo;s mentioned, and tracking it all in a
                  spreadsheet. All for a single keyword.
                </p>
              </div>
              <div className="rounded-[var(--radius-xl)] border border-coral/30 bg-coral-wash/30 p-6">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-coral/20 bg-surface">
                  <Image
                    src="/brand/logo.png"
                    alt="Linkurst"
                    width={22}
                    height={22}
                    className="h-5 w-5 object-contain"
                  />
                </span>
                <p className="mt-4 text-2xl font-bold text-coral-600">~5 minutes, with Linkurst</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-fog">
                  Get every listicle scored by authority and freshness, with
                  your gaps flagged. Then let Linkurst help get your brand placed
                  on the ones that matter.
                </p>
              </div>
            </div>
          </Reveal>

          {/* ---- how it works (detailed) ---- */}
          <Reveal id="how" className="mt-24 scroll-mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                How it works
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-fog">
                Once you hit &ldquo;Find listicles&rdquo;, we turn your search
                into a complete placement report.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-4">
              {/* 1, query */}
              <div className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border">
                <div className="relative min-h-[150px] bg-coral-wash/40 px-5 pb-5 pt-4">
                  <span className="font-[family-name:var(--font-serif)] text-5xl font-bold text-coral/25">
                    1
                  </span>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-foreground shadow-[var(--shadow-card)]">
                      <Search size={13} className="text-muted" />
                      CRM software
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] text-fog shadow-[var(--shadow-card)]">
                      <MapPin size={12} className="text-coral-600" />
                      United States
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-surface p-5">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Add your query
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-fog">
                    Enter a keyword, plus your website, competitors, industry, or
                    location to focus the search.
                  </p>
                  <p className="mt-3 text-[13px] italic leading-relaxed text-muted">
                    e.g. &ldquo;CRM software&rdquo; in the United States, or check
                    how your domain shows up in listicles.
                  </p>
                </div>
              </div>

              {/* 2, email */}
              <div className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border">
                <div className="relative min-h-[150px] bg-coral-wash/40 px-5 pb-5 pt-4">
                  <span className="font-[family-name:var(--font-serif)] text-5xl font-bold text-coral/25">
                    2
                  </span>
                  <div className="mt-3 rounded-lg border border-border bg-surface px-3 py-2 shadow-[var(--shadow-card)]">
                    <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-muted">
                      Email address
                    </p>
                    <p className="mt-0.5 text-[13px] text-foreground">you@company.com</p>
                  </div>
                </div>
                <div className="flex-1 bg-surface p-5">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Drop your email
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-fog">
                    We analyze each listicle live, so we email your report the
                    moment it&rsquo;s ready.
                  </p>
                  <p className="mt-3 text-[13px] italic leading-relaxed text-muted">
                    No account, no waiting on the page. Just your report.
                  </p>
                </div>
              </div>

              {/* 3, analyze */}
              <div className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border">
                <div className="relative min-h-[150px] bg-coral-wash/40 px-5 pb-5 pt-4">
                  <span className="font-[family-name:var(--font-serif)] text-5xl font-bold text-coral/25">
                    3
                  </span>
                  <div className="mt-3 space-y-2">
                    <div className="inline-block rounded-md border border-border bg-surface px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] text-muted shadow-[var(--shadow-card)]">
                      Updated: Jun 2026
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ["DR", "72"],
                        ["PA", "55"],
                        ["Traffic", "184K"],
                        ["Rank", "#2"],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 shadow-[var(--shadow-card)]"
                        >
                          <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                            {k}
                          </span>
                          <span className="text-[13px] font-bold text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-surface p-5">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    We analyze the listicles
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-fog">
                    We scan the web for the &ldquo;best of&rdquo; and
                    &ldquo;top&rdquo; articles, then enrich each with DR, PA,
                    traffic, Google rank, freshness dates, and who&rsquo;s
                    mentioned.
                  </p>
                  <p className="mt-3 text-[13px] italic leading-relaxed text-muted">
                    Takes a few minutes, depending on your query.
                  </p>
                </div>
              </div>

              {/* 4, results */}
              <div className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border">
                <div className="relative min-h-[150px] bg-coral-wash/40 px-5 pb-5 pt-4">
                  <span className="font-[family-name:var(--font-serif)] text-5xl font-bold text-coral/25">
                    4
                  </span>
                  <div className="mt-3 space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-coral/30 bg-surface px-3 py-1.5 text-[12px] font-semibold text-coral-600 shadow-[var(--shadow-card)]">
                      <Download size={13} />
                      Download .xlsx
                    </div>
                    <div className="truncate rounded-md border border-border bg-surface px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] text-coral-600 shadow-[var(--shadow-card)]">
                      linkurst.com/listicles/report
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-surface p-5">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Get your report
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-fog">
                    The full ranked list: every listicle scored, your placement
                    gaps flagged, plus a spreadsheet export and a shareable report
                    link.
                  </p>
                  <p className="mt-3 text-[13px] italic leading-relaxed text-muted">
                    Then request placement on the ones that matter.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button href="#finder" size="lg">
                Find listicles
                <ArrowRight size={18} />
              </Button>
            </div>
          </Reveal>

          {/* ---- what's in your report ---- */}
          <Reveal className="mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow-mono flex items-center justify-center gap-2 text-coral">
                <span className="inline-block h-px w-6 bg-coral" />
                Your report
                <span className="inline-block h-px w-6 bg-coral" />
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                What&rsquo;s in your report
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-fog">
                Not a flat list, a scored dashboard. Every listicle ranked by our
                Opportunity score, so you know exactly which to pitch first.
              </p>
            </div>

            <div className="mt-10">
              <ReportPreview />
            </div>

            {/* what you get — each card previews the real dashboard element */}
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  n: "01",
                  t: "Opportunity score",
                  d: "A pitch-priority rank blending authority, freshness, and Google position.",
                  visual: (
                    <div className="flex items-center gap-2">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-coral text-[16px] font-bold tabular-nums text-white">
                        87
                      </span>
                      <span className="text-[13px] font-semibold text-coral-600">High</span>
                    </div>
                  ),
                },
                {
                  n: "02",
                  t: "Gap detection",
                  d: "Listicles that rank your competitors but not you, flagged and sorted first.",
                  visual: (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-coral/40 bg-coral-wash/50 px-3 py-1.5 text-[12px] font-semibold text-coral-600">
                      <Target size={13} />
                      Gap · 3 comp.
                    </span>
                  ),
                },
                {
                  n: "03",
                  t: "Traffic & authority",
                  d: "Real Ahrefs DR, page authority, and estimated monthly organic visits.",
                  visual: (
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-coral/60 text-[13px] font-bold tabular-nums text-foreground">
                        76
                      </span>
                      <div className="w-16">
                        <div className="font-[family-name:var(--font-mono)] text-[11px] font-semibold text-foreground">
                          184K<span className="text-[9px] text-muted">/mo</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-coral/60 to-coral" />
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  n: "04",
                  t: "Report + .xlsx",
                  d: "A shareable dashboard link and a spreadsheet ready for your team.",
                  visual: (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-coral/30 bg-surface px-3 py-2 text-[12px] font-semibold text-coral-600 shadow-[var(--shadow-card)]">
                      <Download size={13} />
                      Download .xlsx
                    </span>
                  ),
                },
              ].map((f) => (
                <div
                  key={f.n}
                  className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-coral/40 hover:shadow-[var(--shadow-panel)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-coral transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-h-11 items-center">{f.visual}</div>
                    <span className="font-[family-name:var(--font-serif)] text-3xl font-bold leading-none text-coral/20">
                      {f.n}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[15px] font-bold tracking-tight text-foreground">{f.t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-fog">{f.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <Button href="#finder" size="lg">
                Find my listicles
                <ArrowRight size={18} />
              </Button>
              <a
                href="/tools/listicle-finder/example"
                className="rounded-sm font-[family-name:var(--font-mono)] text-[12px] font-medium text-coral-600 underline decoration-coral/30 underline-offset-2 transition-colors hover:decoration-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                See an example report
              </a>
            </div>
          </Reveal>

          {/* ---- split: the gap ---- */}
          <Reveal className="mt-24">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="eyebrow-mono text-coral">The gap</p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  See exactly where competitors beat you
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-fog">
                  For every listicle, we check whether you&rsquo;re on it and who
                  else is. The pages that rank your competitors but not you are
                  your fastest wins, so we put them first.
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {[
                    "Whether your brand is featured",
                    "Which competitors are featured",
                    "Domain + page authority",
                    "How recently it was updated",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-[14.5px] text-fog">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-coral text-white">
                        <Check size={12} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* real listicle card — Apollo's outreach-alternatives roundup */}
              <a
                href="https://www.apollo.io/insights/outreach-alternatives"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow-panel)] transition-all duration-300 hover:-translate-y-1 hover:border-coral/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/tools/apollo.png"
                      alt="Apollo"
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px] rounded-md"
                    />
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-fog">
                      apollo.io
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-coral-wash px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wider text-coral-600">
                    Live example
                  </span>
                </div>

                <p className="mt-3 inline-flex items-start gap-1 text-[15px] font-bold leading-snug text-foreground transition-colors group-hover:text-coral-600">
                  Top 8 Outreach Alternatives for Sales Teams in 2026
                  <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-muted" />
                </p>

                {/* metric strip */}
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3">
                  <ScoreRing value={84} tone="coral" />
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-muted">
                      Domain rating
                    </p>
                    <p className="text-[13px] font-bold text-foreground">Ahrefs DR 84</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <div className="rounded-lg border border-coral/30 bg-coral-wash/40 px-2.5 py-1.5 text-center">
                      <p className="text-[14px] font-bold tabular-nums text-coral-600">#4</p>
                      <p className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-wider text-muted">
                        Google
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-center">
                      <p className="inline-flex items-center gap-1 text-[12px] font-semibold text-coral-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                        Fresh
                      </p>
                      <p className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-wider text-muted">
                        2026
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-lg border border-coral/30 bg-coral-wash/40 px-3 py-2.5 text-[13px]">
                  <Target size={15} className="shrink-0 text-coral-600" />
                  <span className="text-fog">
                    <span className="font-semibold text-foreground">Your brand</span> isn&rsquo;t on
                    this list, its competitors are.
                  </span>
                </div>
              </a>
            </div>
          </Reveal>

          {/* ---- how a listicle becomes a recommendation ---- */}
          <Reveal className="mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow-mono text-coral">Why placements win</p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                The list <span className="accent-serif font-normal text-coral">is</span> the
                recommendation
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-fog">
                AI search doesn&rsquo;t invent its picks. When a buyer asks for
                the best tool, it repeats the brands the top listicles already
                name. Get on the lists, get in the answer.
              </p>
            </div>
            <div className="mt-10">
              <AiAnswerDemo />
            </div>
            <p className="mx-auto mt-8 max-w-xl text-center text-[13.5px] leading-relaxed text-muted">
              In an{" "}
              <a
                href="https://ahrefs.com/blog/best-lists-research/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm font-medium text-coral-600 underline decoration-coral/30 underline-offset-2 transition-colors hover:decoration-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Ahrefs study
              </a>{" "}
              of 750 product-recommendation prompts, listicles were{" "}
              <span className="font-semibold text-coral-600">43.8%</span> of the pages
              ChatGPT cited: the single most common source. Recently updated
              &ldquo;best of&rdquo; lists ranked highest of all.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="#finder" size="lg">
                Find my listicles
                <ArrowRight size={18} />
              </Button>
            </div>
          </Reveal>

          <div className="mx-auto max-w-3xl">
            {/* faq */}
            <Reveal className="mt-16 border-t border-border pt-12">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Frequently asked
              </h2>
              <div className="mt-8 flex flex-col divide-y divide-border">
                {faqs.map((item) => (
                  <div key={item.q} className="py-5 first:pt-0">
                    <h3 className="text-[16px] font-semibold text-foreground">{item.q}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-fog">{item.a}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Cta />
    </>
  );
}

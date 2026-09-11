import type { Metadata } from "next";
import Image from "next/image";
import {
  Sparkles,
  Target,
  Gauge,
  CalendarClock,
  Download,
  Users,
  Check,
  Search,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ListicleFinder } from "@/components/tools/listicle-finder";
import { EngineChips } from "@/components/tools/engine-chips";
import { AiAnswerDemo } from "@/components/tools/ai-answer-demo";
import { Reveal } from "@/components/motion/reveal";
import { Cta } from "@/components/sections/cta";
import { cn } from "@/lib/utils";

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

const dashRows: {
  title: string;
  domain: string;
  da: number;
  pa: number;
  updated: string;
  status: "featured" | "gap";
  comps?: number;
}[] = [
  { title: "12 Best Sales Engagement Tools in 2026", domain: "softwareblog.com", da: 78, pa: 61, updated: "Aug 2026", status: "featured" },
  { title: "Top 10 Outreach Alternatives, Ranked", domain: "saasreview.io", da: 71, pa: 55, updated: "Jul 2026", status: "gap", comps: 3 },
  { title: "The 8 Best Cold Email Platforms (2026)", domain: "toptools.co", da: 66, pa: 58, updated: "Aug 2026", status: "gap", comps: 2 },
  { title: "Best Sales Engagement Software Compared", domain: "b2bpicks.com", da: 59, pa: 47, updated: "Jun 2026", status: "featured" },
  { title: "15 Sales Engagement Platforms for SDRs", domain: "revopsdigest.com", da: 52, pa: 44, updated: "May 2026", status: "gap", comps: 4 },
];

const features = [
  { icon: Target, t: "Gap analysis, not just a list", d: "We flag every listicle that ranks your competitors but not you, your highest-intent placement targets, sorted to the top." },
  { icon: Gauge, t: "DA + PA on every result", d: "Domain and page authority for each listicle, so you chase the placements that actually move the needle." },
  { icon: CalendarClock, t: "Freshness dates", d: "See when each listicle was last updated, so you prioritize the ones editors still maintain." },
  { icon: Users, t: "Competitor visibility", d: "See exactly which competitors are featured on each page, so you know what you're up against." },
  { icon: Download, t: "Export everything", d: "Download the full report as a spreadsheet to share with your team or feed your outreach." },
  { icon: Sparkles, t: "Built for AI search", d: "Listicles are the pages ChatGPT, Perplexity, and Gemini cite most. Getting on them is how you get recommended." },
];

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

          {/* ---- dashboard mockup ---- */}
          <Reveal className="mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                See every placement at a glance
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-fog">
                Every listicle ranking for your topic, scored by authority and
                freshness, with the gaps flagged and sorted to the top.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-panel)]">
              {/* browser chrome */}
              <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                </span>
                <span className="ml-1 flex-1 truncate rounded-md bg-background px-3 py-1 text-center font-[family-name:var(--font-mono)] text-[11px] text-muted">
                  linkurst.com/listicles/report
                </span>
              </div>
              {/* summary bar */}
              <div className="grid grid-cols-3 divide-x divide-border border-b border-border text-center">
                {[
                  { n: "24", l: "Listicles found" },
                  { n: "9", l: "Placement gaps", coral: true },
                  { n: "71", l: "Avg. authority" },
                ].map((s) => (
                  <div key={s.l} className="px-3 py-4">
                    <p className={cn("text-2xl font-bold tabular-nums", s.coral ? "text-coral-600" : "text-foreground")}>
                      {s.n}
                    </p>
                    <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-wider text-muted">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
              {/* table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-border font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
                      <th className="px-5 py-2.5 font-medium">Listicle</th>
                      <th className="px-3 py-2.5 font-medium">DA</th>
                      <th className="px-3 py-2.5 font-medium">PA</th>
                      <th className="px-3 py-2.5 font-medium">Updated</th>
                      <th className="px-5 py-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashRows.map((r) => (
                      <tr
                        key={r.title}
                        className={cn(
                          "border-b border-border last:border-b-0",
                          r.status === "gap" && "bg-coral-wash/25",
                        )}
                      >
                        <td className="px-5 py-3">
                          <p className="font-semibold text-foreground">{r.title}</p>
                          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10.5px] text-muted">
                            {r.domain}
                          </p>
                        </td>
                        <td className="px-3 py-3 tabular-nums text-fog">{r.da}</td>
                        <td className="px-3 py-3 tabular-nums text-fog">{r.pa}</td>
                        <td className="px-3 py-3 font-[family-name:var(--font-mono)] text-[11px] text-muted">
                          {r.updated}
                        </td>
                        <td className="px-5 py-3">
                          {r.status === "featured" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-coral-wash px-2 py-0.5 text-[11px] font-semibold text-coral-600">
                              <Check size={11} />
                              Featured
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-coral/40 bg-surface px-2 py-0.5 text-[11px] font-semibold text-coral-600">
                              <Target size={11} />
                              Gap · {r.comps} comp.
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-border px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                Illustrative preview, your report shows real listicles for your keyword.
              </p>
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

              {/* single listicle card mock */}
              <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow-panel)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md bg-coral-wash px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wider text-coral-600">
                    Listicle
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10.5px] text-muted">
                    saasreview.io
                  </span>
                </div>
                <p className="mt-3 text-[15px] font-bold leading-snug text-foreground">
                  Top 10 Outreach Alternatives, Ranked (2026)
                </p>
                <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border text-center">
                  {[
                    { n: "#3", l: "Google rank" },
                    { n: "71", l: "Domain auth" },
                    { n: "55", l: "Page auth" },
                  ].map((s) => (
                    <div key={s.l} className="px-2 py-3">
                      <p className="text-lg font-bold text-foreground">{s.n}</p>
                      <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-muted">
                        {s.l}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-coral/30 bg-coral-wash/40 px-3 py-2.5 text-[13px]">
                  <Target size={15} className="shrink-0 text-coral-600" />
                  <span className="text-fog">
                    <span className="font-semibold text-foreground">YourBrand</span> isn&rsquo;t
                    on this list, 3 competitors are.
                  </span>
                </div>
              </div>
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
          </Reveal>

          {/* ---- what's in your report (wide) ---- */}
          <Reveal className="mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                What&rsquo;s in your report
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-fog">
                Every listicle that matters, scored and sorted, with your gaps
                flagged. Delivered as an online report and a spreadsheet you can
                hand straight to your team.
              </p>
            </div>

            {/* spreadsheet (xlsx) mockup */}
            <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-panel)]">
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <Image src="/tools/spreadsheet.svg" alt="" width={16} height={16} className="h-4 w-4" />
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-muted">
                  linkurst-listicles.xlsx
                </span>
                <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-coral/30 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-coral-600">
                  <Download size={11} />
                  Export
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-background font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-wider text-muted">
                      <th className="w-8 border-b border-r border-border px-1 py-1.5" />
                      <th className="border-b border-r border-border px-3 py-1.5 text-left font-medium">
                        A · Listicle
                      </th>
                      <th className="border-b border-r border-border px-3 py-1.5 font-medium">B · DA</th>
                      <th className="border-b border-r border-border px-3 py-1.5 font-medium">C · PA</th>
                      <th className="border-b border-r border-border px-3 py-1.5 font-medium">D · Updated</th>
                      <th className="border-b border-border px-3 py-1.5 font-medium">E · Mentioned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "The best CRM platforms in 2026 (TechRadar)", da: 91, pa: 51, u: "22.08.26", m: true },
                      { t: "12 Best CRM Software, Ranked", da: 76, pa: 37, u: "15.07.26", m: false },
                      { t: "Best CRM for Startups (SoftwareWorld)", da: 42, pa: 35, u: "01.09.26", m: true },
                      { t: "Top CRM Tools & Platforms Reviewed", da: 49, pa: 31, u: "01.09.26", m: false },
                      { t: "Best CRM Software Compared", da: 53, pa: 31, u: "03.08.26", m: false },
                      { t: "CRM Buyer's Guide & Rankings", da: 33, pa: 33, u: "01.10.26", m: true },
                    ].map((r, i) => (
                      <tr key={r.t}>
                        <td className="border-b border-r border-border bg-background px-1 py-1.5 text-center font-[family-name:var(--font-mono)] text-[10px] text-muted">
                          {i + 1}
                        </td>
                        <td className="border-b border-r border-border px-3 py-1.5 text-foreground">
                          {r.t}
                        </td>
                        <td className="border-b border-r border-border px-3 py-1.5 text-center tabular-nums text-fog">
                          {r.da}
                        </td>
                        <td className="border-b border-r border-border px-3 py-1.5 text-center tabular-nums text-fog">
                          {r.pa}
                        </td>
                        <td className="border-b border-r border-border px-3 py-1.5 text-center font-[family-name:var(--font-mono)] text-[11px] text-muted">
                          {r.u}
                        </td>
                        <td
                          className={
                            "border-b border-border px-3 py-1.5 text-center font-semibold " +
                            (r.m ? "bg-coral-wash/60 text-coral-600" : "text-fog")
                          }
                        >
                          {r.m ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-border px-4 py-2.5 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                Illustrative export, your file lists real listicles for your keyword.
              </p>
            </div>

            {/* feature cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.t}
                  className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 transition-colors hover:border-coral/30"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-coral-wash text-coral-600">
                    <f.icon size={18} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-foreground">{f.t}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-fog">{f.d}</p>
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

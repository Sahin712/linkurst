import { Search, Sparkles, TrendingUp, ArrowUp } from "lucide-react";

/**
 * Hero interface specimen — a stacked cluster of illustrative cards showing
 * Linkurst's story across the three channels: a Google ranking result,
 * an AI answer that cites the brand (AEO), and a citation-growth callout.
 *
 * NOTE: every figure here is an illustrative example, not real client data.
 */
export function HeroVisual() {
  return (
    <div className="group relative mx-auto w-full max-w-[520px] select-none">
      {/* Card A — Google SERP / ranking */}
      <div className="relative z-10 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-panel)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-1 group-hover:shadow-[0_28px_60px_-24px_rgba(232,85,58,0.45)]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="ml-2 flex-1 truncate rounded-md bg-background px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10.5px] text-muted">
            google.com/search
          </span>
          <span className="rounded-md border border-coral-100 bg-coral-wash px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-medium tracking-wider text-coral-600">
            ORGANIC
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
          <Search size={13} className="text-muted" />
          <span className="text-[12px] text-fog">
            best onboarding tool for B2B SaaS
          </span>
        </div>

        <div className="mt-3 rounded-xl border border-border bg-background/60 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-[family-name:var(--font-mono)] text-[10px] text-muted">
                yourbrand.com › platform › onboarding
              </p>
              <p className="mt-0.5 text-[13.5px] font-semibold tracking-tight text-coral-600">
                The onboarding platform built for B2B SaaS teams
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-coral-100 px-2 py-0.5 text-[10.5px] font-bold text-coral-600">
              <ArrowUp size={11} /> #1
            </span>
          </div>
          <div className="mt-2 space-y-1.5">
            <span className="block h-1.5 w-11/12 rounded-full bg-gray/20" />
            <span className="block h-1.5 w-3/4 rounded-full bg-gray/20" />
          </div>
        </div>
      </div>

      {/* Card B — AI answer, cited (AEO) */}
      <div className="relative z-20 mx-auto -mt-6 w-[92%] rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-panel)] transition-all duration-500 ease-out group-hover:translate-y-1.5 group-hover:rotate-1 group-hover:shadow-[0_28px_60px_-24px_rgba(232,85,58,0.45)]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="ml-2 flex-1 truncate rounded-md bg-background px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10.5px] text-muted">
            chatgpt.com
          </span>
          <span className="rounded-md border border-coral-100 bg-coral-wash px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-medium tracking-wider text-coral-600">
            CITED
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-coral-600">
          <Sparkles size={13} />
          <span className="font-[family-name:var(--font-mono)] text-[10px] font-medium tracking-wider">
            AI ANSWER
          </span>
        </div>

        <p className="mt-2 text-[12.5px] font-medium text-fog">
          Q: Which onboarding platform do you recommend for B2B SaaS?
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground">
          For B2B SaaS teams, community and reviews consistently point to{" "}
          <span className="mark font-semibold">YourBrand</span> for fast setup
          and strong support.
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {["yourbrand.com", "r/SaaS", "g2.com"].map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9.5px] text-fog"
            >
              <span className="h-1 w-1 rounded-full bg-coral" />
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Floating citation metric callout */}
      <div className="absolute -right-3 top-16 z-30 w-[168px] rounded-2xl border border-border bg-surface p-3.5 shadow-[var(--shadow-panel)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.06] group-hover:shadow-[0_20px_40px_-16px_rgba(232,85,58,0.5)] sm:-right-6">
        <p className="font-[family-name:var(--font-mono)] text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted">
          AI citations · search
        </p>
        <p className="mt-1 text-[28px] font-bold leading-none tracking-[var(--tracking-tighter)] text-coral-600 tabular-nums">
          +312%
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-fog">
          <TrendingUp size={12} className="text-coral-600" /> YoY · Google AI
          Overviews
        </p>
      </div>
    </div>
  );
}

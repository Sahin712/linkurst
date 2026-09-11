"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, Globe, Sparkles } from "lucide-react";

const STEPS = [
  { icon: Search, label: "Searching listicles ranking for your keyword" },
  { icon: Globe, label: "Scoring authority and checking freshness dates" },
  { icon: Sparkles, label: "Flagging placement gaps" },
];

/**
 * Shown while a report is still generating. Polls the status endpoint and
 * refreshes the page (server component) the moment the report is done or errored.
 */
export function ReportPending({ token, keyword }: { token: string; keyword: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const cycle = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2500);
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/listicle/status/${token}`, { cache: "no-store" });
        const data = await res.json();
        if (data.status === "done" || data.status === "error") {
          clearInterval(poll);
          clearInterval(cycle);
          router.refresh();
        }
      } catch {
        /* keep polling */
      }
    }, 4000);
    return () => {
      clearInterval(poll);
      clearInterval(cycle);
    };
  }, [token, router]);

  return (
    <div className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-border bg-surface p-8 text-center shadow-[var(--shadow-panel)] sm:p-10">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-wash text-coral-600">
        <Loader2 size={24} className="animate-spin motion-reduce:animate-none" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
        Building your report
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-fog">
        We&rsquo;re analyzing listicles for{" "}
        <span className="font-semibold text-foreground">&ldquo;{keyword}&rdquo;</span>. This takes a
        few minutes — the page updates automatically, and we&rsquo;ll email you the link too.
      </p>

      <div className="mx-auto mt-7 max-w-sm space-y-2.5 text-left">
        {STEPS.map((s, i) => {
          const active = i === step;
          return (
            <div
              key={s.label}
              className={
                "flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-colors " +
                (active ? "border-coral/30 bg-coral-wash/40" : "border-border bg-background")
              }
            >
              <s.icon
                size={16}
                className={active ? "text-coral-600" : "text-muted"}
              />
              <span className={"text-[13.5px] " + (active ? "text-foreground" : "text-fog")}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
        You can safely close this tab
      </p>
    </div>
  );
}

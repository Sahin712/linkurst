"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Loader2, Check, Search, Globe, Sparkles, Lightbulb } from "lucide-react";

const STEPS = [
  { icon: Search, label: "Searching listicles ranking for your keyword" },
  { icon: Globe, label: "Scoring authority, traffic & freshness" },
  { icon: Sparkles, label: "Flagging gaps & scoring opportunity" },
];

const TIPS = [
  "43.8% of ChatGPT’s product answers cite “best of” listicles.",
  "Recently updated lists rank highest in AI answers.",
  "One high-authority placement can surface you in dozens of AI answers.",
  "We check every list for who’s featured — including your competitors.",
];

/**
 * Shown while a report is generating. Polls the status endpoint and refreshes
 * the page the moment the report is done or errored. Animated, reduced-motion
 * aware; all animation is decorative (real progress isn't known).
 */
export function ReportPending({ token, keyword }: { token: string; keyword: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0); // 0..STEPS.length (=== length: all done)
  const [tip, setTip] = useState(0);

  useEffect(() => {
    const cycle = setInterval(
      () => setProgress((p) => (p >= STEPS.length ? 0 : p + 1)),
      2200,
    );
    const tips = setInterval(() => setTip((t) => (t + 1) % TIPS.length), 4200);
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/listicle/status/${token}`, { cache: "no-store" });
        const data = await res.json();
        if (data.status === "done" || data.status === "error") {
          clearInterval(poll);
          clearInterval(cycle);
          clearInterval(tips);
          router.refresh();
        }
      } catch {
        /* keep polling */
      }
    }, 4000);
    return () => {
      clearInterval(poll);
      clearInterval(cycle);
      clearInterval(tips);
    };
  }, [token, router]);

  return (
    <div className="relative mx-auto max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-panel)]">
      {/* indeterminate progress bar */}
      <div className="h-1 w-full overflow-hidden bg-coral-wash/60">
        <motion.div
          className="h-full w-1/3 rounded-full bg-coral"
          animate={reduce ? undefined : { x: ["-120%", "360%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="p-8 text-center sm:p-10">
        {/* pulsing orb */}
        <span className="relative mx-auto grid h-14 w-14 place-items-center">
          <motion.span
            className="absolute inset-0 rounded-full bg-coral/25"
            animate={reduce ? undefined : { scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-coral-wash text-coral-600">
            <Loader2 size={26} className="animate-spin motion-reduce:animate-none" />
          </span>
        </span>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
          Building your report
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-fog">
          Analyzing listicles for{" "}
          <span className="font-semibold text-foreground">&ldquo;{keyword}&rdquo;</span>. This takes a
          few minutes — the page updates automatically, and we&rsquo;ll email you the link.
        </p>

        {/* stepper */}
        <div className="mx-auto mt-7 max-w-sm space-y-2 text-left">
          {STEPS.map((s, i) => {
            const done = i < progress;
            const active = i === progress;
            return (
              <div
                key={s.label}
                className={
                  "flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-colors duration-300 " +
                  (active
                    ? "border-coral/40 bg-coral-wash/50"
                    : done
                      ? "border-coral/20 bg-coral-wash/20"
                      : "border-border bg-background")
                }
              >
                <span
                  className={
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors duration-300 " +
                    (done
                      ? "bg-coral text-white"
                      : active
                        ? "bg-coral-wash text-coral-600"
                        : "bg-foreground/[0.06] text-muted")
                  }
                >
                  {done ? (
                    <Check size={13} />
                  ) : active ? (
                    <Loader2 size={13} className="animate-spin motion-reduce:animate-none" />
                  ) : (
                    <s.icon size={13} />
                  )}
                </span>
                <span
                  className={"text-[13.5px] " + (active || done ? "text-foreground" : "text-fog")}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* rotating tip */}
        <div className="mt-6 flex min-h-[54px] items-center gap-3 rounded-lg border border-coral/20 bg-coral-wash/30 px-4 py-3 text-left">
          <Lightbulb size={16} className="shrink-0 text-coral-600" />
          <AnimatePresence mode="wait">
            <motion.p
              key={tip}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-[13px] leading-relaxed text-fog"
            >
              <span className="font-semibold text-coral-600">Did you know?</span> {TIPS[tip]}
            </motion.p>
          </AnimatePresence>
        </div>

        <p className="mt-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
          You can safely close this tab
        </p>
      </div>
    </div>
  );
}

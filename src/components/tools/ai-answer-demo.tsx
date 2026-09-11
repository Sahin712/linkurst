"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUpRight, Target } from "lucide-react";
import { useReducedMotion } from "motion/react";

/**
 * Animated "AI answer" demo. On scroll into view it plays a full chat sequence:
 * the prompt types in, the assistant "thinks", then the answer streams word by
 * word and cites listicles. Illustrative example, honors reduced-motion.
 */

const QUESTION = "What's the best sales engagement platform for B2B?";

// Answer split into stream chunks; `mark` chunks are highlighted brand names.
const ANSWER: { t: string; mark?: boolean }[] = [
  { t: "For B2B teams, the tools most often recommended are " },
  { t: "Apollo", mark: true },
  { t: ", " },
  { t: "Outreach", mark: true },
  { t: ", and " },
  { t: "Salesloft", mark: true },
  { t: ", based on roundups like:" },
];

const CITATIONS = [
  "12 Best Sales Engagement Tools (2026)",
  "Top 10 Outreach Alternatives, Ranked",
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Phase = "idle" | "typing" | "thinking" | "answering" | "cites" | "done";

export function AiAnswerDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const alive = useRef(true);

  const [phase, setPhase] = useState<Phase>("idle");
  const [qLen, setQLen] = useState(0);
  const [aParts, setAParts] = useState(0);
  const [cites, setCites] = useState(0);
  const [punch, setPunch] = useState(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (reduce) {
      setQLen(QUESTION.length);
      setAParts(ANSWER.length);
      setCites(CITATIONS.length);
      setPunch(true);
      setPhase("done");
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        setPhase("typing");
        for (let i = 1; i <= QUESTION.length; i++) {
          if (!alive.current) return;
          setQLen(i);
          await wait(26);
        }
        await wait(400);
        if (!alive.current) return;

        setPhase("thinking");
        await wait(1300);
        if (!alive.current) return;

        setPhase("answering");
        for (let i = 1; i <= ANSWER.length; i++) {
          if (!alive.current) return;
          setAParts(i);
          await wait(130);
        }
        await wait(350);
        if (!alive.current) return;

        setPhase("cites");
        for (let i = 1; i <= CITATIONS.length; i++) {
          if (!alive.current) return;
          setCites(i);
          await wait(300);
        }
        await wait(400);
        if (!alive.current) return;

        setPunch(true);
        setPhase("done");
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const Avatar = (
    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-coral text-white">
      <Sparkles size={13} />
    </span>
  );

  return (
    <div
      ref={ref}
      className="mx-auto max-w-2xl overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-panel)]"
    >
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5 sm:px-6">
        <Sparkles size={15} className="text-coral-600" />
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted">
          AI answer
        </span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-coral-100 bg-coral-wash px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-semibold uppercase tracking-wider text-coral-600">
          Cites listicles
        </span>
      </div>

      <div className="flex min-h-[360px] flex-col p-5 sm:min-h-[400px] sm:p-7">
        {/* question */}
        {qLen > 0 && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-foreground/[0.05] px-4 py-2.5 text-[15px] leading-snug text-foreground">
              {QUESTION.slice(0, qLen)}
              {phase === "typing" && (
                <span className="animate-caret ml-0.5 inline-block h-[1.05em] w-0.5 -translate-y-[1px] rounded-full bg-coral align-middle" />
              )}
            </div>
          </div>
        )}

        {/* thinking */}
        {phase === "thinking" && (
          <div className="mt-5 flex items-center gap-3">
            {Avatar}
            <span className="inline-flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="animate-bob h-2 w-2 rounded-full bg-coral/50"
                  style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
                />
              ))}
            </span>
          </div>
        )}

        {/* answer */}
        {(phase === "answering" || phase === "cites" || phase === "done") && (
          <div className="mt-5 flex gap-3">
            {Avatar}
            <p className="text-[15.5px] leading-relaxed text-fog">
              {ANSWER.slice(0, aParts).map((p, i) =>
                p.mark ? (
                  <span key={i} className="mark font-semibold text-foreground">
                    {p.t}
                  </span>
                ) : (
                  <span key={i}>{p.t}</span>
                ),
              )}
              {phase === "answering" && (
                <span className="animate-caret ml-0.5 inline-block h-[1.05em] w-0.5 -translate-y-[1px] rounded-full bg-coral align-middle" />
              )}
            </p>
          </div>
        )}

        {/* citations */}
        {cites > 0 && (
          <div className="ml-10 mt-3 flex flex-col gap-2">
            {CITATIONS.slice(0, cites).map((c, i) => (
              <div
                key={c}
                className="animate-fade-up inline-flex items-center gap-2 self-start rounded-lg border border-border bg-background/60 px-3 py-1.5 text-[13px] text-fog"
              >
                <span className="grid h-4 w-4 place-items-center rounded bg-coral-wash text-[8px] font-bold text-coral-600">
                  {i + 1}
                </span>
                {c}
                <ArrowUpRight size={13} className="text-muted" />
              </div>
            ))}
          </div>
        )}

        {/* punchline */}
        {punch && (
          <div className="animate-fade-up mt-auto flex items-start gap-2.5 rounded-lg border border-coral/25 bg-coral-wash/40 px-4 py-3">
            <Target size={16} className="mt-0.5 shrink-0 text-coral-600" />
            <p className="text-[14px] leading-relaxed text-fog">
              Every brand it named came from a listicle. If you&rsquo;re not on the
              list, you&rsquo;re not in the answer.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

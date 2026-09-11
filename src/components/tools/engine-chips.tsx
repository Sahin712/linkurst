"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const engines = [
  { name: "ChatGPT", file: "openai" },
  { name: "Perplexity", file: "perplexity" },
  { name: "Gemini", file: "gemini" },
  { name: "Google AI Overviews", file: "google" },
  { name: "Copilot", file: "copilot" },
];

/**
 * "Where buyers ask" AI-engine chips with brand logos. Chips fade up in a
 * stagger on mount and the logos gently float; honors reduced-motion.
 */
export function EngineChips() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-7 flex flex-wrap items-center gap-2">
      <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted">
        Where buyers ask:
      </span>
      <motion.div
        className="flex flex-wrap items-center gap-2"
        initial={reduce ? false : "hidden"}
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
      >
        {engines.map((e, i) => (
          <motion.span
            key={e.name}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={reduce ? undefined : { y: -2 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-surface/70 px-2.5 py-1 text-[12px] font-medium text-fog shadow-[var(--shadow-card)] backdrop-blur-md"
          >
            <motion.span
              className="inline-flex"
              animate={reduce ? undefined : { y: [0, -2.5, 0] }}
              transition={
                reduce
                  ? undefined
                  : { repeat: Infinity, duration: 2.6, delay: i * 0.25, ease: "easeInOut" }
              }
            >
              <Image
                src={`/tools/${e.file}.svg`}
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
            </motion.span>
            {e.name}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

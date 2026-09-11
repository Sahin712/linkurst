"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Interactive FAQ accordion with a smooth expand (grid-rows technique). */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={cn(
              "overflow-hidden rounded-[var(--radius-lg)] border transition-colors duration-200",
              isOpen
                ? "border-coral/30 bg-coral-wash/25"
                : "border-border bg-surface hover:border-coral/25",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-inset"
            >
              <span className="text-[15px] font-semibold text-foreground">{item.q}</span>
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all duration-300",
                  isOpen ? "rotate-45 bg-coral text-white" : "bg-coral-wash text-coral-600",
                )}
              >
                <Plus size={15} />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[14px] leading-relaxed text-fog">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

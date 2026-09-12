"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { mainNav, tools, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import logoMark from "../../../public/brand/logo.png";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

function LogoMark() {
  return (
    <Link
      href="/"
      aria-label="Linkurst — home"
      className="inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
    >
      <Image
        src={logoMark}
        alt="Linkurst"
        width={28}
        height={28}
        priority
        className="h-7 w-7 object-contain"
      />
      <span className="text-[15px] font-bold tracking-tight text-foreground md:hidden">
        Linkurst
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:pt-4">
      {/* floating pill */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-1 rounded-full border border-border bg-surface/80 py-2 pl-4 pr-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md md:max-w-fit md:justify-normal">
        <LogoMark />

        <nav aria-label="Primary" className="hidden items-center md:flex">
          {mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-fog transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {item.label}
            </a>
          ))}

          {/* Tools dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setToolsOpen((v) => !v)}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-fog transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Tools
              <ChevronDown
                size={14}
                className={cn("transition-transform duration-200", toolsOpen && "rotate-180")}
              />
            </button>
            {toolsOpen && (
              <>
                <button
                  type="button"
                  aria-hidden="true"
                  tabIndex={-1}
                  onClick={() => setToolsOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />
                <div className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-2xl border border-border bg-surface p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)]">
                  {tools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setToolsOpen(false)}
                      className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      <span className="block text-sm font-medium text-foreground">{t.label}</span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-muted">
                        {t.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        <a
          href={siteConfig.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-glow-pulse ml-1 hidden items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:animate-none md:inline-flex"
        >
          <span className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_1px_rgba(255,255,255,0.9)] motion-reduce:animate-none" />
          Book a call
        </a>

        {/* mobile toggle — animated hamburger ↔ X */}
        <button
          type="button"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-coral-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-[22px]">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-[22px] rounded-full bg-current transition-all duration-300 ease-out",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 block h-0.5 rounded-full bg-current transition-all duration-300 ease-out",
                open ? "w-0 opacity-0" : "w-[22px] opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-[22px] rounded-full bg-current transition-all duration-300 ease-out",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="mx-auto mt-2 max-w-md origin-top overflow-hidden rounded-[26px] border border-border bg-surface/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md md:hidden"
          >
            <motion.nav
              aria-label="Mobile"
              variants={reduce ? undefined : listVariants}
              initial={reduce ? undefined : "hidden"}
              animate={reduce ? undefined : "show"}
              className="flex flex-col p-3"
            >
              {mainNav.map((item) => (
                <motion.a
                  key={item.href}
                  variants={reduce ? undefined : itemVariants}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex min-h-12 items-center justify-between rounded-xl px-4 text-[15px] font-semibold text-foreground transition-colors hover:bg-coral-wash/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                >
                  {item.label}
                  <ArrowRight
                    size={16}
                    className="-translate-x-1 text-coral-600 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </motion.a>
              ))}

              {/* Tools */}
              <motion.div
                variants={reduce ? undefined : itemVariants}
                className="mt-2 rounded-2xl border border-border bg-background/60 p-2"
              >
                <p className="px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-coral-600">
                  Free tools
                </p>
                {tools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-start gap-2 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-[14px] font-semibold text-foreground">
                        {t.label}
                        <ArrowUpRight
                          size={13}
                          className="text-muted transition-colors group-hover:text-coral-600"
                        />
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-muted">
                        {t.desc}
                      </span>
                    </div>
                  </Link>
                ))}
              </motion.div>

              <motion.a
                variants={reduce ? undefined : itemVariants}
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-coral px-4 text-[15px] font-semibold text-white transition-colors hover:bg-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_1px_rgba(255,255,255,0.9)]" />
                Book a call
                <ArrowRight size={16} />
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

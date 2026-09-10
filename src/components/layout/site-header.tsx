"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { mainNav, tools, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import logoMark from "../../../public/brand/logo.png";

function LogoMark() {
  return (
    <Link
      href="/"
      aria-label="Linkurst — home"
      className="mr-1 inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
    >
      <Image
        src={logoMark}
        alt="Linkurst"
        width={28}
        height={28}
        priority
        className="h-7 w-7 object-contain"
      />
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:pt-4">
      {/* floating pill */}
      <div className="mx-auto flex max-w-fit items-center gap-1 rounded-full border border-border bg-surface/80 py-2 pl-4 pr-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
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
                      <span className="block text-sm font-medium text-foreground">
                        {t.label}
                      </span>
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

        {/* mobile toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* mobile menu */}
      <div
        className={cn(
          "mx-auto mt-2 max-w-sm overflow-hidden rounded-2xl border border-border bg-surface/95 backdrop-blur-md md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-0.5 p-3">
          {mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-medium text-fog hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {item.label}
            </a>
          ))}

          {/* Tools */}
          <div className="mt-1 border-t border-border pt-2">
            <p className="px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
              Tools
            </p>
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-medium text-fog hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {t.label}
              </Link>
            ))}
          </div>

          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-coral px-4 py-2.5 text-sm font-medium text-white hover:bg-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Book a call
            <ArrowRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}

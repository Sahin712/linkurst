# Linkurst — website

Official site for **Linkurst**, a premium organic-visibility consultancy for SaaS & B2B.
Core statement: _We help SaaS and B2B companies build organic visibility across Google, AI search, and Reddit._

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 (CSS-first `@theme` config in `src/app/globals.css`)
- `motion` (Motion for React) for subtle animation
- `lucide-react` for icons — **use Lucide, don't hand-roll SVG icons**

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint

## Brand rules (do not violate)

- **Palette only:** charcoal `#1C1C1E`, slate `#3A3A3D`, coral `#E8553A`, ivory `#F7F4EF`, gray `#8A8A8E`. No blue/purple.
- **Type:** Inter — bold headings, regular body, light-italic captions/labels (`.caption`).
- Direction: premium, editorial, SaaS-inspired, data-driven, minimal, confident, evidence-led.
- Do **not** invent client logos, testimonials, results, or statistics.
- Dashboard/interface UI is **illustrative** — never present it as a real SaaS product.
- No stock photos or generic AI illustrations.

## Design tokens

Defined in `src/app/globals.css` under `@theme` → available as Tailwind utilities
(`bg-coral`, `text-charcoal`, `bg-ivory`, `border-border`, `shadow-[var(--shadow-card)]`, etc.).

## Structure

```
src/
  app/            layout (fonts + header/footer), globals.css, page.tsx
  components/
    ui/           primitives: Container, Section, Heading, Eyebrow, Button, Badge, Logo (barrel: index.ts)
    layout/       SiteHeader, SiteFooter
    motion/       Reveal (scroll-in wrapper, respects reduced-motion)
    sections/     homepage modules go here (empty — build incrementally)
    interfaces/   illustrative product/dashboard mockups go here (empty)
  lib/            utils (cn), motion (variants), site (nav + copy config)
public/brand/     logo + brand guide
```

## Notes

- `src/app/page.tsx` is a **foundation scaffold**, not the final homepage. Build the
  homepage as modules under `src/components/sections/` and compose them in `page.tsx`.
- Keep motion restrained: use `Reveal` / variants in `src/lib/motion.ts`, not everywhere.

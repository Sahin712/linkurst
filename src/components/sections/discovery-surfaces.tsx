import { Fragment } from "react";
import { Search, Bot, MessageSquare, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";

/**
 * Dark auto-scrolling strip of the discovery surfaces Linkurst builds
 * visibility on. Honest analogue of a press-logo bar: these are the channels
 * we optimize for, not client/press claims. Pure-CSS marquee, pauses on hover,
 * static wrapped fallback under reduced-motion.
 */

const surfaces: { label: string; icon: React.ElementType }[] = [
  { label: "Google", icon: Search },
  { label: "ChatGPT", icon: Bot },
  { label: "Perplexity", icon: Sparkles },
  { label: "Gemini", icon: Bot },
  { label: "Claude", icon: Bot },
  { label: "Reddit", icon: MessageSquare },
  { label: "Bing", icon: Search },
  { label: "AI Overviews", icon: Sparkles },
];

export function DiscoverySurfaces() {
  return (
    <section aria-label="Discovery surfaces Linkurst covers" className="bg-charcoal">
      <Container size="wide" className="py-14">
        <div className="grid items-center gap-y-8 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-x-14">
          <div>
            <p className="eyebrow-mono text-coral">Where discovery happens now</p>
            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-[var(--tracking-tighter)] text-ivory sm:text-[1.75rem]">
              Visibility across every{" "}
              <span className="accent-serif font-normal text-coral">surface</span>{" "}
              your buyers search.
            </h2>
          </div>

          <div
            className="marquee-group relative overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
            }}
          >
            <ul className="animate-marquee flex w-max items-center gap-x-10 pr-10">
              {[0, 1].map((copy) => (
                <Fragment key={copy}>
                  {surfaces.map((s, i) => (
                    <li
                      key={`${copy}-${i}`}
                      aria-hidden={copy === 1 ? true : undefined}
                      className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-ivory/70 sm:text-2xl"
                    >
                      <s.icon size={20} className="text-ivory/45" />
                      {s.label}
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

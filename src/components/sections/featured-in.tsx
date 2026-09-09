import { Fragment } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";

/**
 * "Our clients have been featured in" — dark auto-scrolling press strip.
 *
 * IMPORTANT: only include outlets with genuine, verifiable placements.
 * Provide each real outlet below. Drop logo files (mono/white SVG or PNG)
 * into `public/press/` and set `logo`; entries without a `logo` render as a
 * clean text wordmark fallback.
 */

type Outlet = { name: string; logo?: string; width?: number };

// Real, client-supplied placements. Logo files live in public/press/.
const outlets: Outlet[] = [
  { name: "Forbes", logo: "/press/forbes.png", width: 107 },
  { name: "TechCrunch", logo: "/press/techcrunch.png", width: 90 },
  { name: "USA Today", logo: "/press/usa-today.png", width: 60 },
  { name: "HubSpot", logo: "/press/hubspot.png", width: 71 },
  { name: "The Verge", logo: "/press/the-verge.png", width: 154 },
  { name: "Business Insider", logo: "/press/business-insider.png", width: 117 },
  { name: "Semrush", logo: "/press/semrush.png", width: 92 },
];

export function FeaturedIn() {
  return (
    <section aria-label="Publications our clients have been featured in">
      <Container size="wide" className="py-16">
        <div className="grid items-center gap-y-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-x-16">
          <h2 className="font-serif text-[2.5rem] font-normal leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            Our <span className="text-coral">clients</span> have been featured in
          </h2>

          <div
            className="marquee-group relative overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
            }}
          >
            <ul className="animate-marquee flex w-max items-center gap-x-16 pr-16">
              {[0, 1].map((copy) => (
                <Fragment key={copy}>
                  {outlets.map((o, i) => (
                    <li
                      key={`${copy}-${i}`}
                      aria-hidden={copy === 1 ? true : undefined}
                      className="flex shrink-0 items-center"
                    >
                      {o.logo ? (
                        <Image
                          src={o.logo}
                          alt={o.name}
                          width={o.width ?? 160}
                          height={52}
                          className="h-12 w-auto object-contain opacity-70 grayscale"
                        />
                      ) : (
                        <span className="text-[1.75rem] font-bold tracking-tight text-charcoal/50 sm:text-3xl">
                          {o.name}
                        </span>
                      )}
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

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import logoMark from "../../../public/brand/linkurst-logo.png";

type LogoProps = {
  className?: string;
  /** Show the "Linkurst" wordmark next to the mark. */
  withWordmark?: boolean;
};

/**
 * Linkurst brand lockup — the approved coral trend-arrow mark plus wordmark.
 * Uses the supplied brand asset; do not substitute a different mark.
 */
export function Logo({ className, withWordmark = true }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Image
        src={logoMark}
        alt=""
        width={28}
        height={28}
        priority
        className="h-7 w-7 object-contain"
      />
      {withWordmark && (
        <span className="text-lg font-bold tracking-[var(--tracking-tight)] text-foreground">
          {siteConfig.name}
        </span>
      )}
    </Link>
  );
}

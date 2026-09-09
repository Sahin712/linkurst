import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-coral text-ivory hover:bg-coral-600",
  secondary:
    "bg-charcoal text-ivory hover:bg-slate",
  ghost:
    "border border-border bg-transparent text-foreground hover:bg-surface",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm sm:text-[0.9375rem]",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<React.ComponentProps<typeof Link>, keyof CommonProps> & { href: string };

/** Polymorphic button — renders a Next Link when `href` is provided. */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    // In-page hash links (e.g. "#methodology") must be native anchors — Next's
    // Link doesn't reliably scroll to same-page hashes.
    if (typeof href === "string" && href.startsWith("#")) {
      return (
        <a
          href={href}
          className={classes}
          {...(linkRest as React.ComponentProps<"a">)}
        />
      );
    }
    return <Link href={href} className={classes} {...linkRest} />;
  }

  return <button className={classes} {...(rest as ButtonAsButton)} />;
}

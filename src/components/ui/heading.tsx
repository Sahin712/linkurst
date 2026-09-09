import { cn } from "@/lib/utils";

type HeadingProps = React.ComponentProps<"h2"> & {
  as?: "h1" | "h2" | "h3";
  size?: "display" | "xl" | "lg" | "md";
};

const sizes = {
  display: "text-4xl sm:text-5xl lg:text-6xl",
  xl: "text-3xl sm:text-4xl lg:text-5xl",
  lg: "text-2xl sm:text-3xl",
  md: "text-xl sm:text-2xl",
} as const;

/** Bold, tightly-tracked editorial heading. */
export function Heading({
  as: Tag = "h2",
  size = "xl",
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        "font-bold tracking-[var(--tracking-tighter)] text-balance text-foreground",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

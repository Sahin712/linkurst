import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionProps = React.ComponentProps<"section"> & {
  /** Wrap children in a Container. Set false for full-bleed sections. */
  contained?: boolean;
  containerSize?: React.ComponentProps<typeof Container>["size"];
  /** Vertical rhythm. */
  spacing?: "sm" | "md" | "lg";
};

const spacings = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-24 sm:py-32",
} as const;

/** Semantic page section with consistent vertical rhythm. */
export function Section({
  className,
  children,
  contained = true,
  containerSize,
  spacing = "md",
  ...props
}: SectionProps) {
  return (
    <section className={cn(spacings[spacing], className)} {...props}>
      {contained ? (
        <Container size={containerSize}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}

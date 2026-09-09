import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span"> & {
  variant?: "neutral" | "accent";
};

const variants = {
  neutral: "border-border bg-surface text-fog",
  accent: "border-coral-100 bg-coral-100 text-coral-600",
} as const;

/** Small pill label — for tags, statuses, and metric chips. */
export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-tight",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

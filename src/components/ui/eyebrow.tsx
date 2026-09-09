import { cn } from "@/lib/utils";

/**
 * Editorial eyebrow / label — Inter Light Italic per brand typography.
 * Use above headings to introduce a section.
 */
export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "caption text-sm tracking-tight sm:text-[0.9375rem]",
        className,
      )}
      {...props}
    />
  );
}

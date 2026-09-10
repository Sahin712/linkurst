import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { Heading } from "./heading";
import { Reveal } from "@/components/motion/reveal";

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  headingSize?: React.ComponentProps<typeof Heading>["size"];
};

/** Eyebrow + heading + supporting copy — the standard section intro. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  headingSize = "xl",
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow
          className={cn(
            "font-medium uppercase not-italic tracking-[0.18em]",
            tone === "dark" ? "text-coral" : "text-coral-600",
          )}
        >
          {eyebrow}
        </Eyebrow>
      )}
      <Heading
        size={headingSize}
        className={cn(
          align === "center" && "mx-auto",
          "max-w-3xl",
          tone === "dark" && "text-ivory",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-muted" : "text-fog",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}

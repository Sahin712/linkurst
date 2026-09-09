"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeInUp, inViewOnce } from "@/lib/motion";
import type { Variants } from "motion/react";

type RevealProps = React.ComponentProps<typeof motion.div> & {
  variants?: Variants;
};

/**
 * Subtle scroll-reveal wrapper. Fades content up once when it enters view.
 * Honors prefers-reduced-motion by rendering statically.
 * Keep usage restrained — a light touch, not on every element.
 */
export function Reveal({
  children,
  variants = fadeInUp,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div {...(props as React.ComponentProps<"div">)}>
        {children as React.ReactNode}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

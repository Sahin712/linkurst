import type { Variants, Transition } from "motion/react";

/**
 * Shared Motion primitives for Linkurst.
 * Keep motion subtle and editorial — short distances, gentle easing.
 * Components should respect prefers-reduced-motion (handled globally in CSS,
 * and via `useReducedMotion` in interactive components where needed).
 */

export const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: easeOut } },
};

/** Stagger container — reveals children in editorial sequence. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Default viewport config: animate once, a little before fully in view. */
export const inViewOnce = { once: true, margin: "-80px" } as const;

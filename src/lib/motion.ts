import type { Variants, Transition } from "motion/react";

/**
 * Shared Motion primitives for Linkurst.
 * Keep motion subtle and editorial — short distances, gentle easing.
 * Components should respect prefers-reduced-motion (handled globally in CSS,
 * and via `useReducedMotion` in interactive components where needed).
 */

export const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1];

// Transform-only reveal: content is NEVER hidden (no opacity:0), so it stays
// visible through hydration and fast/momentum scrolling — where the
// IntersectionObserver behind whileInView is delayed on iOS Safari and used to
// leave sections blank. The animation is a subtle slide-up instead of a fade.
export const fadeInUp: Variants = {
  hidden: { y: 22 },
  visible: {
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: {},
  visible: { transition: { duration: 0.5, ease: easeOut } },
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

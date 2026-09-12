/**
 * Tiny GA4 event helper. Safe to call anywhere on the client — no-ops on the
 * server or if gtag hasn't loaded. Use it to instrument the Listicle Finder
 * funnel (report started → viewed → placement requested → call booked).
 */
type EventProps = Record<string, string | number | boolean | undefined>;

export function track(event: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    w.gtag?.("event", event, props ?? {});
  } catch {
    // analytics must never break the app
  }
}

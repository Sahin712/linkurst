import type { CSSProperties } from "react";
import type { Listicle } from "./find";

/** Months since an ISO date, or null if unknown/invalid. */
export function monthsSince(iso: string | null): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (isNaN(t)) return null;
  return (Date.now() - t) / (1000 * 60 * 60 * 24 * 30.44);
}

export type FreshTone = "fresh" | "aging" | "stale" | "unknown";

export function freshness(iso: string | null): { label: string; tone: FreshTone } {
  const m = monthsSince(iso);
  if (m == null) return { label: "No date", tone: "unknown" };
  if (m <= 6) return { label: "Fresh", tone: "fresh" };
  if (m <= 18) return { label: "Aging", tone: "aging" };
  return { label: "Stale", tone: "stale" };
}

/** Human "how long ago", e.g. "new", "4mo ago", "2y ago". Null if no date. */
export function relativeAge(iso: string | null): string | null {
  const m = monthsSince(iso);
  if (m == null) return null;
  if (m < 1) return "new";
  if (m < 12) return `${Math.round(m)}mo ago`;
  const y = m / 12;
  return `${y < 2 ? y.toFixed(1).replace(/\.0$/, "") : Math.round(y)}y ago`;
}

/**
 * Opportunity Score (0–100): which listicles to pitch first. Blends domain
 * authority (the prize), freshness (recently updated lists are likelier to add
 * you), and Google rank (higher-ranked lists drive more value).
 */
export function opportunityScore(l: Listicle): number {
  const dr = l.da ?? 40;
  const m = monthsSince(l.updated);
  const fresh = m == null ? 55 : m <= 6 ? 100 : m <= 12 ? 82 : m <= 24 ? 55 : 30;
  const pos = l.bestPosition > 0 ? Math.max(20, 100 - (l.bestPosition - 1) * 6) : 60;
  return Math.round(dr * 0.5 + fresh * 0.25 + pos * 0.25);
}

export function tierOf(score: number): "High" | "Medium" | "Low" {
  return score >= 72 ? "High" : score >= 50 ? "Medium" : "Low";
}

/** Compact traffic label, e.g. 1_565_477 → "1.6M", 184_000 → "184K". */
export function formatTraffic(v: number | null): string {
  if (v == null) return "—";
  if (v <= 0) return "<100";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (v >= 1_000) return Math.round(v / 1000) + "K";
  return String(v);
}

// Heatmap backgrounds (brand palette: coral for DR, slate for PA).
export function drStyle(v: number | null): CSSProperties {
  if (v == null) return {};
  return { backgroundColor: `rgba(232,85,58,${(0.08 + (v / 100) * 0.32).toFixed(3)})` };
}
export function paStyle(v: number | null): CSSProperties {
  if (v == null) return {};
  return { backgroundColor: `rgba(58,58,61,${(0.06 + (v / 100) * 0.2).toFixed(3)})` };
}

/** Google-rank pill tint: better (lower) positions get a stronger coral. */
export function rankStyle(pos: number): CSSProperties {
  if (!pos || pos <= 0) return {};
  const t = Math.max(0.05, Math.min(1, (21 - pos) / 20));
  return { backgroundColor: `rgba(232,85,58,${(0.08 + t * 0.3).toFixed(3)})` };
}

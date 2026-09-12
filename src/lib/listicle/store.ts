/**
 * Report storage for the Listicle Finder async pipeline. Backed by Upstash
 * Redis in production (keyed by an opaque token, 30-day TTL). When Upstash isn't
 * configured it falls back to an in-memory map so the flow works in local dev —
 * that fallback is per-process and NOT shared across serverless instances, so it
 * is for development only.
 */

import { Redis } from "@upstash/redis";
import type { FindResult, Listicle } from "./find";

export type ReportStatus = "pending" | "done" | "error";

export type ReportInput = {
  keyword: string;
  website?: string;
  competitors?: string[];
  location?: string;
  industry?: string;
  email: string;
};

export type ReportRecord = {
  id: string;
  status: ReportStatus;
  input: ReportInput;
  result?: FindResult;
  error?: string;
  createdAt: number;
  completedAt?: number;
};

const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const key = (id: string) => `listicle:report:${id}`;
const orderKey = (id: string) => `listicle:order:${id}`;

// Cache of the (expensive) discovery result, keyed by the query signature so
// identical searches reuse it instead of re-paying DataForSEO. Shorter TTL than
// a report so data stays reasonably fresh.
const FIND_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const findKey = (sig: string) => `listicle:find:${sig}`;
const rlKey = (id: string) => `listicle:rl:${id}`;

/** A placement request: the subset of listicles a visitor selected, plus their
 *  details and a link back to the full research report. */
export type PlacementOrder = {
  id: string;
  createdAt: number;
  contact: { name: string; email: string; company?: string; message?: string };
  meta: {
    keyword?: string;
    website?: string;
    industry?: string;
    location?: string;
  };
  daSource: "ahrefs" | "dataforseo";
  reportUrl?: string;
  listicles: Listicle[];
};

export function hasUpstash(): boolean {
  return (
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

let client: Redis | null = null;
function redis(): Redis {
  if (!client) client = Redis.fromEnv();
  return client;
}

// Dev-only fallback store. Pinned on globalThis so it's shared across module
// instances in the same Node process (Next dev gives route handlers and RSC
// pages separate module graphs otherwise). Still per-process — dev only.
const globalForStore = globalThis as unknown as {
  __listicleStore?: Map<string, ReportRecord>;
};
const mem = globalForStore.__listicleStore ?? new Map<string, ReportRecord>();
globalForStore.__listicleStore = mem;

export async function createReport(input: ReportInput): Promise<ReportRecord> {
  const rec: ReportRecord = {
    id: crypto.randomUUID(),
    status: "pending",
    input,
    createdAt: Date.now(),
  };
  await saveReport(rec);
  return rec;
}

export async function saveReport(rec: ReportRecord): Promise<void> {
  if (hasUpstash()) {
    await redis().set(key(rec.id), rec, { ex: TTL_SECONDS });
  } else {
    mem.set(rec.id, rec);
  }
}

export async function getReport(id: string): Promise<ReportRecord | null> {
  if (hasUpstash()) {
    return (await redis().get<ReportRecord>(key(id))) ?? null;
  }
  return mem.get(id) ?? null;
}

// Dev-only fallback store for orders.
const memOrders = ((globalForStore as unknown as {
  __listicleOrders?: Map<string, PlacementOrder>;
}).__listicleOrders ??= new Map<string, PlacementOrder>());

export async function createOrder(
  data: Omit<PlacementOrder, "id" | "createdAt">,
): Promise<PlacementOrder> {
  const order: PlacementOrder = { id: crypto.randomUUID(), createdAt: Date.now(), ...data };
  if (hasUpstash()) {
    await redis().set(orderKey(order.id), order, { ex: TTL_SECONDS });
  } else {
    memOrders.set(order.id, order);
  }
  return order;
}

export async function getOrder(id: string): Promise<PlacementOrder | null> {
  if (hasUpstash()) {
    return (await redis().get<PlacementOrder>(orderKey(id))) ?? null;
  }
  return memOrders.get(id) ?? null;
}

// ---------------------------------------------------------------------------
// Discovery cache — reuse identical searches so a free tool doesn't re-pay the
// data APIs for the same query. Keyed by a normalized signature.
// ---------------------------------------------------------------------------

/** Stable signature for a query so identical searches share a cached result. */
export function findSignature(input: {
  keyword: string;
  website?: string;
  competitors?: string[];
  location?: string;
  industry?: string;
}): string {
  const norm = (s?: string) => (s ?? "").trim().toLowerCase();
  const comps = (input.competitors ?? []).map(norm).filter(Boolean).sort().join(",");
  return [norm(input.keyword), norm(input.location) || "united states", norm(input.website), comps, norm(input.industry)]
    .join("|")
    .replace(/\s+/g, " ");
}

const memFind = ((globalForStore as unknown as {
  __listicleFind?: Map<string, { result: FindResult; exp: number }>;
}).__listicleFind ??= new Map());

export async function getCachedFind(sig: string): Promise<FindResult | null> {
  if (hasUpstash()) {
    return (await redis().get<FindResult>(findKey(sig))) ?? null;
  }
  const hit = memFind.get(sig);
  if (!hit) return null;
  if (hit.exp < Date.now()) {
    memFind.delete(sig);
    return null;
  }
  return hit.result;
}

export async function setCachedFind(sig: string, result: FindResult): Promise<void> {
  if (hasUpstash()) {
    await redis().set(findKey(sig), result, { ex: FIND_TTL_SECONDS });
  } else {
    memFind.set(sig, { result, exp: Date.now() + FIND_TTL_SECONDS * 1000 });
  }
}

// ---------------------------------------------------------------------------
// Rate limiting — cap runs per identifier (email, IP) per window so a free tool
// can't be abused into a large bill. Returns the running count for the window.
// ---------------------------------------------------------------------------

const memCounters = ((globalForStore as unknown as {
  __listicleCounters?: Map<string, { n: number; exp: number }>;
}).__listicleCounters ??= new Map());

export async function bumpCounter(id: string, windowSeconds: number): Promise<number> {
  if (hasUpstash()) {
    const r = redis();
    const n = await r.incr(rlKey(id));
    if (n === 1) await r.expire(rlKey(id), windowSeconds);
    return n;
  }
  const now = Date.now();
  const cur = memCounters.get(id);
  if (!cur || cur.exp < now) {
    memCounters.set(id, { n: 1, exp: now + windowSeconds * 1000 });
    return 1;
  }
  cur.n += 1;
  return cur.n;
}

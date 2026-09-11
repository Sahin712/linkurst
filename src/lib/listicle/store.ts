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

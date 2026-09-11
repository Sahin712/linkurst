/**
 * Minimal DataForSEO client for the Listicle Finder. Uses HTTP Basic auth from
 * DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD (server-only env vars). Two endpoints:
 * live Google organic SERP, and backlinks bulk ranks (a DA-style 0–100 score).
 */

const BASE = "https://api.dataforseo.com/v3";

export function hasDataForSeoCredentials(): boolean {
  return !!process.env.DATAFORSEO_LOGIN && !!process.env.DATAFORSEO_PASSWORD;
}

/** DataForSEO signals errors in the JSON body (HTTP is usually 200), so we carry the code. */
export class DataForSeoError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.name = "DataForSeoError";
    this.code = code;
  }
}

/** Human-readable message for a DataForSEO failure, by error code. */
export function dataForSeoErrorMessage(e: unknown): string {
  if (e instanceof DataForSeoError) {
    if (e.code === 40104)
      return "DataForSEO account not verified for API access. Complete verification in the DataForSEO dashboard, then try again.";
    if (e.code === 40201)
      return "DataForSEO has temporarily paused this account for review. Contact support@dataforseo.com to restore access.";
    if (e.code === 40200)
      return "DataForSEO balance is too low to run the search. Top up the account, then try again.";
    if (e.code === 40100 || e.code === 40101 || e.code === 40103)
      return "DataForSEO authentication failed. Check DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD.";
    return e.message;
  }
  return "The search failed. Please try again.";
}

function authHeader(): string {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error("DataForSEO credentials are not configured.");
  }
  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

type DfsEnvelope = {
  status_code?: number;
  status_message?: string;
  tasks?: Array<{ status_code?: number; status_message?: string }>;
};

async function dfsPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new DataForSeoError(res.status, `DataForSEO request failed (HTTP ${res.status}).`);
  }
  const json = (await res.json()) as DfsEnvelope;

  // Account/auth-level failures (verify account, bad login, etc.) — HTTP is 200.
  if (typeof json.status_code === "number" && json.status_code !== 20000) {
    throw new DataForSeoError(json.status_code, json.status_message || "DataForSEO API error.");
  }
  // Task-level failures (e.g. 40200 payment required, 40104 verify account).
  const task = json.tasks?.[0];
  if (task && typeof task.status_code === "number" && task.status_code >= 40000) {
    throw new DataForSeoError(task.status_code, task.status_message || "DataForSEO task error.");
  }

  return json as T;
}

export type SerpItem = {
  type: string;
  rank_absolute: number;
  title: string;
  url: string;
  domain: string;
};

type SerpResponse = {
  tasks?: Array<{
    status_code?: number;
    result?: Array<{ items?: SerpItem[] } | null> | null;
  }>;
};

/** Live Google organic results for a keyword. Returns organic items only. */
export async function serpOrganic(
  keyword: string,
  locationName = "United States",
  languageCode = "en",
  depth = 20,
): Promise<SerpItem[]> {
  const data = await dfsPost<SerpResponse>(
    "/serp/google/organic/live/advanced",
    [
      {
        keyword,
        location_name: locationName,
        language_code: languageCode,
        depth,
        device: "desktop",
      },
    ],
  );
  const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
  return items.filter(
    (i): i is SerpItem =>
      !!i && i.type === "organic" && typeof i.url === "string" && !!i.domain,
  );
}

type RanksResponse = {
  tasks?: Array<{
    result?: Array<{
      items?: Array<{ target?: string; rank?: number }>;
    } | null> | null;
  }>;
};

/**
 * DA-style rank (0–100) per domain. DataForSEO's default scale is 0–1000; we
 * request the 0–100 scale and normalize defensively.
 */
export async function bulkRanks(targets: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (!targets.length) return map;
  const data = await dfsPost<RanksResponse>("/backlinks/bulk_ranks/live", [
    { targets, rank_scale: "one_hundred" },
  ]);
  const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
  for (const it of items) {
    if (!it.target) continue;
    let rank = typeof it.rank === "number" ? it.rank : 0;
    if (rank > 100) rank = Math.round(rank / 10); // fell back to 0–1000
    map.set(it.target.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, ""), rank);
  }
  return map;
}

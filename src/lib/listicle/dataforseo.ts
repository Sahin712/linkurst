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

export type SerpResult = {
  items: SerpItem[];
  /** URLs the Google AI Overview cited for this query (empty if none shown). */
  aiOverviewUrls: string[];
};

type SerpResponse = {
  tasks?: Array<{
    status_code?: number;
    result?: Array<{ items?: Array<Record<string, unknown>> } | null> | null;
  }>;
};

/** Recursively collect every http(s) URL under a node (used on the AI Overview item). */
function harvestUrls(node: unknown, out: Set<string>, depth = 0): void {
  if (node == null || depth > 10) return;
  if (typeof node === "string") {
    if (/^https?:\/\/\S+$/i.test(node)) out.add(node);
    return;
  }
  if (Array.isArray(node)) {
    for (const v of node) harvestUrls(v, out, depth + 1);
    return;
  }
  if (typeof node === "object") {
    for (const v of Object.values(node as Record<string, unknown>)) {
      harvestUrls(v, out, depth + 1);
    }
  }
}

/**
 * Live Google organic results for a keyword, plus any AI Overview citations.
 * `load_async_ai_overview` asks DataForSEO to include the AI Overview block
 * (it loads asynchronously in Google); we then harvest the URLs it cites.
 */
export async function serpOrganic(
  keyword: string,
  locationName = "United States",
  languageCode = "en",
  depth = 50,
): Promise<SerpResult> {
  const data = await dfsPost<SerpResponse>(
    "/serp/google/organic/live/advanced",
    [
      {
        keyword,
        location_name: locationName,
        language_code: languageCode,
        depth,
        device: "desktop",
        load_async_ai_overview: true,
      },
    ],
  );
  const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
  const organic = items.filter(
    (i): i is SerpItem =>
      !!i && i.type === "organic" && typeof i.url === "string" && !!i.domain,
  );
  const aiUrls = new Set<string>();
  for (const it of items) {
    if (it && typeof it === "object" && it.type === "ai_overview") {
      harvestUrls(it, aiUrls);
    }
  }
  return { items: organic, aiOverviewUrls: [...aiUrls] };
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

type TrafficResponse = {
  tasks?: Array<{
    result?: Array<{
      items?: Array<{
        target?: string;
        metrics?: { organic?: { etv?: number } | null } | null;
      }>;
    } | null> | null;
  }>;
};

type ContentParsingResponse = {
  tasks?: Array<{ result?: Array<Record<string, unknown> | null> | null }>;
};

/** Recursively harvest visible text (and any markdown) from a parsed page. */
function harvestText(node: unknown, out: string[], depth = 0): void {
  if (node == null || depth > 12) return;
  if (typeof node === "string") {
    out.push(node);
    return;
  }
  if (Array.isArray(node)) {
    for (const v of node) harvestText(v, out, depth + 1);
    return;
  }
  if (typeof node === "object") {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if ((k === "page_as_markdown" || k === "text") && typeof v === "string") {
        out.push(v);
      } else {
        harvestText(v, out, depth + 1);
      }
    }
  }
}

const RENDER_TIMEOUT_MS = 15000;
const RENDER_MAX_TEXT = 2_000_000;

/**
 * Render a JavaScript-heavy page via DataForSEO On-Page (browser rendering) and
 * return its visible text as one string. Best-effort: returns "" on any failure
 * so the caller can fall back to whatever the plain fetch produced. Reads the
 * real content of client-rendered SPAs (e.g. editgpt.app) that serve an empty
 * shell to a non-JS crawler.
 */
export async function renderPageText(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RENDER_TIMEOUT_MS);
  try {
    const res = await fetch(BASE + "/on_page/content_parsing/live", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify([
        {
          url,
          enable_javascript: true,
          enable_browser_rendering: true,
          load_resources: true,
          markdown_view: true,
        },
      ]),
      signal: controller.signal,
    });
    if (!res.ok) return "";
    const json = (await res.json()) as ContentParsingResponse;
    const result = json.tasks?.[0]?.result?.[0];
    if (!result) return "";
    const out: string[] = [];
    harvestText(result, out);
    return out.join("\n").slice(0, RENDER_MAX_TEXT);
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

const LLM_TIMEOUT_MS = 25000;

/**
 * Ask an LLM (via DataForSEO AI Optimization) the query with web search on, and
 * return every source URL it cited. Best-effort: returns [] on any failure.
 * `provider` is a DataForSEO slug: "chat_gpt", "claude", "perplexity", "gemini".
 */
export async function llmCitedUrls(
  provider: string,
  userPrompt: string,
  modelName: string,
): Promise<string[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
  try {
    const res = await fetch(BASE + `/ai_optimization/${provider}/llm_responses/live`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify([
        { user_prompt: userPrompt, model_name: modelName, web_search: true },
      ]),
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      tasks?: Array<{ result?: Array<Record<string, unknown> | null> | null }>;
    };
    const result = json.tasks?.[0]?.result?.[0];
    if (!result) return [];
    const urls = new Set<string>();
    harvestUrls(result, urls);
    return [...urls];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

// DataForSEO location codes for the locations the form offers (defaults to US).
const LOCATION_CODES: Record<string, number> = {
  "united states": 2840,
  "united kingdom": 2826,
  canada: 2124,
  australia: 2036,
  india: 2356,
  germany: 2276,
  france: 2250,
};

/**
 * Estimated monthly organic traffic per domain (DataForSEO Labs). Returns a Map
 * keyed by normalized domain → estimated visits. One flat-priced call.
 */
export async function bulkTrafficEstimation(
  domains: string[],
  locationName = "United States",
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (!domains.length) return map;
  const location_code = LOCATION_CODES[locationName.trim().toLowerCase()] ?? 2840;
  const data = await dfsPost<TrafficResponse>(
    "/dataforseo_labs/google/bulk_traffic_estimation/live",
    [{ targets: domains, location_code, language_code: "en" }],
  );
  const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
  for (const it of items) {
    if (!it.target) continue;
    const etv = it.metrics?.organic?.etv;
    map.set(
      it.target.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, ""),
      Math.round(typeof etv === "number" ? etv : 0),
    );
  }
  return map;
}

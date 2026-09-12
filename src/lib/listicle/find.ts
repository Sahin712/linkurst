import { serpOrganic, bulkRanks, bulkTrafficEstimation } from "./dataforseo";
import { hasAhrefsCredentials, domainRatings } from "./ahrefs";

/**
 * Listicle Finder engine. Given a keyword (and optionally the user's site +
 * competitors), it finds "best of / top" listicles ranking for the topic,
 * enriches each domain with a DA-style score, and — when a brand/competitors
 * are provided — crawls each listicle to flag who's mentioned (placement gaps).
 */

export type Listicle = {
  title: string;
  url: string;
  domain: string;
  da: number | null; // domain authority-style rank (0–100)
  pa: number | null; // page authority-style rank (0–100)
  traffic: number | null; // estimated monthly organic visits to the domain
  updated: string | null; // ISO date (YYYY-MM-DD) the page was last modified
  bestPosition: number;
  appearances: number;
  mentionsBrand: boolean | null;
  competitorsMentioned: string[];
};

export type FindResult = {
  keyword: string;
  location: string;
  brandDomain: string | null;
  competitors: string[];
  industry: string | null;
  daSource: "ahrefs" | "dataforseo";
  totals: {
    listicles: number;
    featured: number; // listicles that mention the brand
    gaps: number; // mention a competitor but not the brand
    avgDa: number | null;
  };
  listicles: Listicle[];
};

export type FindInput = {
  keyword: string;
  website?: string;
  competitors?: string[];
  location?: string;
  industry?: string;
  crawl?: boolean;
  maxResults?: number;
};

const LISTICLE_QUERY_TEMPLATES = (k: string) => [
  `best ${k}`,
  `best ${k} tools`,
  `top ${k} software`,
  `${k} alternatives`,
];

const FETCH_TIMEOUT_MS = 6000;
const MAX_HTML_BYTES = 1_500_000;

function normDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

/** Second-level label, e.g. "instantly" from "instantly.ai" — used for name-mention matching. */
function brandLabel(domain: string): string {
  const parts = domain.split(".");
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0];
}

function isListicleTitle(title: string): boolean {
  return /(^|[^a-z])(\d{1,3})\+?\s+\S|\b(best|top)\b/i.test(title);
}

/**
 * Domains that aren't placement-worthy listicles: social/community/video sites
 * (results, not roundups you can pitch), and major general news / digital-PR
 * outlets. We keep vendor blogs and SaaS review roundups — the sites a brand
 * can realistically get added to.
 */
const EXCLUDED_DOMAINS = new Set<string>([
  // Social, community, video, Q&A
  "youtube.com",
  "youtu.be",
  "reddit.com",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "instagram.com",
  "tiktok.com",
  "pinterest.com",
  "quora.com",
  "threads.net",
  "medium.com",
  "substack.com",
  // Major news / digital PR
  "forbes.com",
  "techcrunch.com",
  "venturebeat.com",
  "fastcompany.com",
  "businessinsider.com",
  "inc.com",
  "entrepreneur.com",
  "wired.com",
  "theverge.com",
  "cnbc.com",
  "nytimes.com",
  "wsj.com",
  "bloomberg.com",
  "mashable.com",
  "engadget.com",
  "gizmodo.com",
  "thenextweb.com",
  "axios.com",
  "reuters.com",
  "theguardian.com",
  "hbr.org",
  "fortune.com",
  "time.com",
  "fool.com",
  "yahoo.com",
  // Self-service review directories — a client lists their own product here, so
  // there's no outreach/placement opportunity for an agency to build.
  "g2.com",
  "capterra.com",
  "getapp.com",
  "softwareadvice.com",
  "trustradius.com",
  "trustpilot.com",
  "sourceforge.net",
  "producthunt.com",
  "crozdesk.com",
  "goodfirms.co",
  "clutch.co",
  "gartner.com",
  "peerspot.com",
  "saasworthy.com",
]);

/** True for social/news/PR domains that aren't vendor-roundup listicles. */
function isExcludedDomain(domain: string): boolean {
  if (EXCLUDED_DOMAINS.has(domain)) return true;
  // Match subdomains too (e.g. finance.yahoo.com, pipeline.zoominfo stays — only listed roots).
  return [...EXCLUDED_DOMAINS].some((d) => domain.endsWith("." + d));
}

/** Normalize a URL/domain the same way the DataForSEO rank map is keyed. */
function normTarget(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

/** Parse a date string into YYYY-MM-DD, rejecting nonsense years. */
function toIsoDate(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const s = raw.trim();
  const d = new Date(s);
  if (isNaN(d.getTime()) || d.getFullYear() <= 2000 || d.getFullYear() >= 2100) {
    return null;
  }
  // A bare calendar date (no time component) parses to local midnight; using
  // toISOString() would shift it a day in timezones behind UTC, so read the
  // local Y/M/D directly. Timestamps with a time/zone are true instants — keep UTC.
  if (!/\d{1,2}:\d{2}/.test(s)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  return d.toISOString().slice(0, 10);
}

/**
 * Best-effort "last updated" date for a page. Checks, in priority order:
 * machine-readable "modified" metadata, then visible "last updated <date>"
 * text, then "published" metadata, then visible "published <date>" text, then
 * a bare <time>, and finally the HTTP Last-Modified header. Prefers a
 * modified/updated date over a published one when both exist.
 */
function extractDate(html: string, lastModifiedHeader?: string | null): string | null {
  // A written month-name or numeric date, e.g. "September 11, 2026" / "Sep 11 2026".
  const DATE =
    "(\\d{4}-\\d{2}-\\d{2}[T0-9:.Z+-]*|[A-Z][a-z]{2,8}\\.?\\s+\\d{1,2},?\\s+\\d{4}|\\d{1,2}\\s+[A-Z][a-z]{2,8}\\.?\\s+\\d{4})";

  const modifiedMeta = [
    /"dateModified"\s*:\s*"([^"]+)"/i,
    /property=["']article:modified_time["']\s+content=["']([^"']+)["']/i,
    /property=["']og:updated_time["']\s+content=["']([^"']+)["']/i,
    /<meta[^>]+itemprop=["']dateModified["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["'](?:last-modified|revised|revision-date)["'][^>]+content=["']([^"']+)["']/i,
  ];
  const modifiedText = [
    new RegExp(`(?:last[\\s-]*)?updated(?:\\s+on)?\\s*[:\\-–]?\\s*${DATE}`, "i"),
    new RegExp(`last[\\s-]*modified\\s*[:\\-–]?\\s*${DATE}`, "i"),
  ];
  const publishedMeta = [
    /"datePublished"\s*:\s*"([^"]+)"/i,
    /property=["']article:published_time["']\s+content=["']([^"']+)["']/i,
    /<meta[^>]+itemprop=["']datePublished["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["'](?:date|pubdate|publish-date|publication-date)["'][^>]+content=["']([^"']+)["']/i,
  ];
  const publishedText = [
    new RegExp(`(?:published|posted)(?:\\s+on)?\\s*[:\\-–]?\\s*${DATE}`, "i"),
    new RegExp(`<time[^>]+datetime=["']([^"']+)["']`, "i"),
  ];

  for (const group of [modifiedMeta, modifiedText, publishedMeta, publishedText]) {
    for (const p of group) {
      const m = html.match(p);
      const iso = m && toIsoDate(m[1]);
      if (iso) return iso;
    }
  }
  // Last resort: the server's own Last-Modified header.
  return toIsoDate(lastModifiedHeader);
}

async function fetchText(url: string): Promise<{ html: string; lastModified: string | null }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const empty = { html: "", lastModified: null };
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "LinkurstListicleBot/1.0 (+https://www.linkurst.com/tools/listicle-finder)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) return empty;
    const lastModified = res.headers.get("last-modified");
    const ctype = res.headers.get("content-type") || "";
    if (!ctype.includes("html") && !ctype.includes("text")) return empty;
    const reader = res.body?.getReader();
    if (!reader) return { html: (await res.text()).slice(0, MAX_HTML_BYTES), lastModified };
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.length;
        if (total > MAX_HTML_BYTES) {
          reader.cancel();
          break;
        }
        chunks.push(value);
      }
    }
    const merged = new Uint8Array(total > MAX_HTML_BYTES ? MAX_HTML_BYTES : total);
    let off = 0;
    for (const c of chunks) {
      if (off + c.length > merged.length) {
        merged.set(c.subarray(0, merged.length - off), off);
        break;
      }
      merged.set(c, off);
      off += c.length;
    }
    return { html: new TextDecoder("utf-8").decode(merged), lastModified };
  } catch {
    return empty;
  } finally {
    clearTimeout(timeout);
  }
}

export async function findListicles(input: FindInput): Promise<FindResult> {
  const keyword = input.keyword.trim();
  const location = input.location?.trim() || "United States";
  const maxResults = input.maxResults ?? 25;

  const brandDomain = input.website ? normDomain(input.website) : null;
  const competitors = (input.competitors ?? [])
    .map((c) => normDomain(c))
    .filter(Boolean);

  // 1. Run listicle-intent SERP queries in parallel. A single query failing is
  //    tolerated, but if every query fails we surface the real error (auth,
  //    balance, verification) instead of returning an empty result.
  const queries = LISTICLE_QUERY_TEMPLATES(keyword);
  const settled = await Promise.allSettled(queries.map((q) => serpOrganic(q, location)));
  const perQuery = settled
    .filter((s): s is PromiseFulfilledResult<Awaited<ReturnType<typeof serpOrganic>>> =>
      s.status === "fulfilled",
    )
    .map((s) => s.value);
  if (perQuery.length === 0) {
    const firstRejection = settled.find((s) => s.status === "rejected");
    throw (firstRejection as PromiseRejectedResult | undefined)?.reason ??
      new Error("SERP discovery failed.");
  }

  // 2. Aggregate + dedupe by URL, keeping best rank and appearance count.
  const byUrl = new Map<string, Listicle>();
  for (const items of perQuery) {
    for (const it of items) {
      if (!isListicleTitle(it.title)) continue;
      const dom = normDomain(it.domain);
      if (brandDomain && dom === brandDomain) continue; // skip the user's own page
      if (isExcludedDomain(dom)) continue; // skip social/news/PR — not placement-worthy listicles
      const existing = byUrl.get(it.url);
      if (existing) {
        existing.appearances += 1;
        existing.bestPosition = Math.min(existing.bestPosition, it.rank_absolute);
      } else {
        byUrl.set(it.url, {
          title: it.title,
          url: it.url,
          domain: dom,
          da: null,
          pa: null,
          traffic: null,
          updated: null,
          bestPosition: it.rank_absolute,
          appearances: 1,
          mentionsBrand: null,
          competitorsMentioned: [],
        });
      }
    }
  }

  let listicles = [...byUrl.values()]
    .sort((a, b) => a.bestPosition - b.bestPosition)
    .slice(0, maxResults);

  // 3. Authority enrichment. DA = real Ahrefs Domain Rating (free) when a key
  //    is configured; PA = DataForSEO page rank. Falls back to DataForSEO for
  //    both when Ahrefs isn't set up.
  const domains = [...new Set(listicles.map((l) => l.domain))];
  const urls = listicles.map((l) => l.url);
  const trafficMap = await bulkTrafficEstimation(domains, location).catch(
    () => new Map<string, number>(),
  );
  if (hasAhrefsCredentials()) {
    const [drMap, paMap] = await Promise.all([
      domainRatings(domains).catch(() => new Map<string, number>()),
      bulkRanks(urls).catch(() => new Map<string, number>()),
    ]);
    for (const l of listicles) {
      l.da = drMap.get(l.domain) ?? null;
      l.pa = paMap.get(normTarget(l.url)) ?? null;
      l.traffic = trafficMap.get(l.domain) ?? null;
    }
  } else {
    const ranks = await bulkRanks([...new Set([...domains, ...urls])]).catch(
      () => new Map<string, number>(),
    );
    for (const l of listicles) {
      l.da = ranks.get(l.domain) ?? null;
      l.pa = ranks.get(normTarget(l.url)) ?? null;
      l.traffic = trafficMap.get(l.domain) ?? null;
    }
  }

  // 4. Crawl each listicle for the "Updated" date and brand/competitor mentions.
  const shouldCrawl = input.crawl !== false;
  if (shouldCrawl) {
    const brandNeedles = brandDomain ? [brandDomain, brandLabel(brandDomain)] : [];
    const compNeedles = competitors.map((c) => ({
      domain: c,
      needles: [c, brandLabel(c)],
    }));
    await Promise.all(
      listicles.map(async (l) => {
        const { html, lastModified } = await fetchText(l.url);
        if (!html) return;
        l.updated = extractDate(html, lastModified);
        const lower = html.toLowerCase();
        if (brandDomain) {
          l.mentionsBrand = brandNeedles.some((n) => n && lower.includes(n));
        }
        l.competitorsMentioned = compNeedles
          .filter((c) => c.needles.some((n) => n && lower.includes(n)))
          .map((c) => c.domain);
      }),
    );
  }

  const daValues = listicles.map((l) => l.da).filter((d): d is number => d != null);
  const featured = listicles.filter((l) => l.mentionsBrand === true).length;
  const gaps = listicles.filter(
    (l) => l.mentionsBrand === false && l.competitorsMentioned.length > 0,
  ).length;

  return {
    keyword,
    location,
    brandDomain,
    competitors,
    industry: input.industry?.trim() || null,
    daSource: hasAhrefsCredentials() ? "ahrefs" : "dataforseo",
    totals: {
      listicles: listicles.length,
      featured,
      gaps,
      avgDa: daValues.length
        ? Math.round(daValues.reduce((s, d) => s + d, 0) / daValues.length)
        : null,
    },
    listicles,
  };
}

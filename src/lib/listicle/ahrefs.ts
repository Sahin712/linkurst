/**
 * Ahrefs free Domain Rating API client. Returns real DR (0–100) per domain.
 * Free, but requires an APIv3 key (AHREFS_API_KEY) and a visible
 * "Domain Rating by Ahrefs" attribution in the report.
 * Docs: https://docs.ahrefs.com/en/api/reference/public/get-domain-rating-free
 */

const ENDPOINT = "https://api.ahrefs.com/v3/public/domain-rating-free";
const TIMEOUT_MS = 8000;
const CONCURRENCY = 5;

export function hasAhrefsCredentials(): boolean {
  return !!process.env.AHREFS_API_KEY;
}

type DrResponse = { domain_rating?: { domain_rating?: number } };

/** Domain Rating (0–100) for a single target, or null on any failure. */
export async function domainRating(target: string): Promise<number | null> {
  const key = process.env.AHREFS_API_KEY;
  if (!key) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = `${ENDPOINT}?target=${encodeURIComponent(target)}&output=json`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as DrResponse;
    const dr = data.domain_rating?.domain_rating;
    return typeof dr === "number" ? Math.round(dr) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Domain Rating for many domains, with limited concurrency. */
export async function domainRatings(
  domains: string[],
): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  const unique = [...new Set(domains)];
  let i = 0;
  async function worker() {
    while (i < unique.length) {
      const idx = i++;
      const d = unique[idx];
      const dr = await domainRating(d);
      if (dr != null) out.set(d, dr);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, unique.length) }, () => worker()),
  );
  return out;
}

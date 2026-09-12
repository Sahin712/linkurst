import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Keep the tool landing page and the marketing example report crawlable,
      // but block private, token-based generated reports and order pages
      // (/tools/listicle-finder/<token> and /order/<id>) plus API routes.
      allow: ["/", "/tools/listicle-finder/example"],
      disallow: ["/tools/listicle-finder/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Keep the tool landing page crawlable, but block everything under
      // /tools/listicle-finder/ — the generated token reports, order pages,
      // and the example report — plus API routes.
      allow: "/",
      disallow: ["/tools/listicle-finder/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

import { siteConfig } from "@/lib/site";

/**
 * Structured data for a free tool page: a SoftwareApplication (so search and
 * AI engines understand it's a usable, free web tool) plus an FAQPage built
 * from the page's own FAQ. Static, authored data — safe to serialize.
 */
export function ToolJsonLd({
  name,
  description,
  path,
  faqs,
  featureList,
}: {
  name: string;
  description: string;
  path: string;
  faqs: { q: string; a: string }[];
  featureList?: string[];
}) {
  const url = `${siteConfig.url}${path}`;

  const app = {
    "@type": "SoftwareApplication",
    "@id": `${url}#app`,
    name,
    url,
    description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@id": `${siteConfig.url}/#organization` },
    ...(featureList ? { featureList } : {}),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const graph = { "@context": "https://schema.org", "@graph": [app, faqPage] };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

import { siteConfig } from "@/lib/site";
import { faqs } from "@/lib/faqs";

/**
 * Structured data (JSON-LD) for the homepage: Organization + WebSite identity
 * and an FAQPage built from the shared FAQ content. Rendered as a script tag;
 * the data is static and trusted (authored here), so serialization is safe.
 */
export function JsonLd() {
  const organization = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: siteConfig.logo,
    description: siteConfig.statement,
    email: siteConfig.email,
    sameAs: [siteConfig.socials.linkedin, siteConfig.socials.twitter],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, faqPage],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/**
 * Central site metadata & navigation config.
 * Keeps copy and structure in one place as the homepage grows modularly.
 */

export const siteConfig = {
  name: "Linkurst",
  tagline: "Organic visibility for SaaS & B2B",
  statement:
    "We help SaaS and B2B companies build organic visibility across Google, AI search, and Reddit.",
  url: "https://www.linkurst.com",
  bookingUrl: "https://calendly.com/sahin-linkurst/introduction",
  email: "Sahin@linkurst.com",
  logo: "https://www.linkurst.com/brand/logo.png",
  // Public profiles — used for Organization schema `sameAs`.
  socials: {
    linkedin: "https://www.linkedin.com/company/linkurst/",
    twitter: "https://x.com/sksahin03",
  },
  // Analytics & verification (public values — safe to commit).
  // GA4 Measurement ID, e.g. "G-XXXXXXXXXX". Leave empty to disable.
  gaId: "G-381ZHE0ER3",
  // Google Search Console "HTML tag" verification code (the content value
  // of the google-site-verification meta tag). Leave empty to disable.
  googleSiteVerification: "_xc57L7bGSLuwgDG0QnhxMq_DFm_dqwLunKLqB6na5U",
} as const;

export const mainNav = [
  { label: "The System", href: "#approach" },
  { label: "How it works", href: "#methodology" },
  { label: "Services", href: "#services" },
  { label: "90-Day Plan", href: "#plan" },
] as const;

/** Free tools — surfaced in the nav "Tools" dropdown and the footer. */
export const tools = [
  {
    label: "AEO Content Grader",
    href: "/tools/aeo-content-grader",
    desc: "Score any page for AI-search readiness",
  },
] as const;

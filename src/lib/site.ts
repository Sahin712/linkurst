/**
 * Central site metadata & navigation config.
 * Keeps copy and structure in one place as the homepage grows modularly.
 */

export const siteConfig = {
  name: "Linkurst",
  tagline: "Organic visibility for SaaS & B2B",
  statement:
    "We help SaaS and B2B companies build organic visibility across Google, AI search, and Reddit.",
  url: "https://linkurst.com",
  bookingUrl: "https://calendly.com/sahin-linkurst/introduction",
} as const;

export const mainNav = [
  { label: "The System", href: "#approach" },
  { label: "How it works", href: "#methodology" },
  { label: "Services", href: "#services" },
  { label: "90-Day Plan", href: "#plan" },
  { label: "FAQ", href: "#faq" },
] as const;

import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ListicleReport } from "@/components/tools/listicle-report";
import type { FindResult } from "@/lib/listicle/find";

export const metadata: Metadata = {
  title: "Example Listicle Report",
  description:
    "See an example of the Linkurst Listicle Finder report: listicles ranking for a keyword, scored by authority, with placement gaps flagged.",
  alternates: { canonical: "/tools/listicle-finder/example" },
};

// Illustrative sample report (not real search data).
const EXAMPLE: FindResult = {
  keyword: "crm software",
  location: "United States",
  brandDomain: "yourbrand.com",
  competitors: ["salesforce.com", "hubspot.com", "zoho.com"],
  industry: "B2B SaaS",
  daSource: "ahrefs",
  totals: { listicles: 12, featured: 3, gaps: 6, avgDa: 62 },
  listicles: [
    { title: "12 Best CRM Software, Ranked (2026)", url: "https://saasreview.io/best-crm-software", domain: "saasreview.io", da: 76, pa: 41, traffic: 184000, updated: "2026-08-22", bestPosition: 2, appearances: 3, mentionsBrand: false, competitorsMentioned: ["salesforce.com", "hubspot.com"] },
    { title: "The Best CRM Platforms I Tested in 2026", url: "https://techtested.com/best-crm", domain: "techtested.com", da: 71, pa: 55, traffic: 96000, updated: "2026-09-01", bestPosition: 4, appearances: 2, mentionsBrand: false, competitorsMentioned: ["hubspot.com", "zoho.com"] },
    { title: "Best CRM Software for Small Business", url: "https://smbpicks.com/crm", domain: "smbpicks.com", da: 66, pa: 38, traffic: 52000, updated: "2026-07-15", bestPosition: 5, appearances: 1, mentionsBrand: false, competitorsMentioned: ["zoho.com"] },
    { title: "Top 10 CRM Tools Compared", url: "https://comparehub.com/crm-tools", domain: "comparehub.com", da: 59, pa: 44, traffic: 41000, updated: "2026-08-03", bestPosition: 6, appearances: 2, mentionsBrand: false, competitorsMentioned: ["salesforce.com"] },
    { title: "Best CRM Software 2026: Buyer's Guide", url: "https://b2bdigest.com/crm-guide", domain: "b2bdigest.com", da: 54, pa: 33, traffic: 23000, updated: "2026-06-28", bestPosition: 7, appearances: 1, mentionsBrand: false, competitorsMentioned: ["hubspot.com"] },
    { title: "15 CRM Platforms for Growing Teams", url: "https://revopsweekly.com/crm-platforms", domain: "revopsweekly.com", da: 48, pa: 29, traffic: 12000, updated: "2026-05-19", bestPosition: 9, appearances: 1, mentionsBrand: false, competitorsMentioned: ["salesforce.com", "zoho.com"] },
    { title: "Best CRM for Startups (SoftwareWorld)", url: "https://softwareworld.co/best-crm-for-startups", domain: "softwareworld.co", da: 62, pa: 35, traffic: 38000, updated: "2026-09-01", bestPosition: 3, appearances: 2, mentionsBrand: true, competitorsMentioned: ["hubspot.com"] },
    { title: "Best CRM Software Compared (2026)", url: "https://toolfinder.com/crm-compared", domain: "toolfinder.com", da: 69, pa: 47, traffic: 71000, updated: "2026-08-10", bestPosition: 8, appearances: 1, mentionsBrand: true, competitorsMentioned: ["salesforce.com"] },
    { title: "CRM Software: The Complete Roundup", url: "https://saascentral.io/crm-roundup", domain: "saascentral.io", da: 57, pa: 40, traffic: 29000, updated: "2026-07-30", bestPosition: 10, appearances: 1, mentionsBrand: true, competitorsMentioned: [] },
    { title: "Best CRM Tools for Sales Teams", url: "https://salesstack.com/best-crm", domain: "salesstack.com", da: 51, pa: 31, traffic: 16000, updated: "2026-04-12", bestPosition: 12, appearances: 1, mentionsBrand: false, competitorsMentioned: [] },
    { title: "Affordable CRM Software Options", url: "https://budgetsaas.com/crm", domain: "budgetsaas.com", da: 44, pa: 27, traffic: 8400, updated: "2026-03-22", bestPosition: 14, appearances: 1, mentionsBrand: false, competitorsMentioned: [] },
    { title: "Enterprise CRM Platforms Reviewed", url: "https://enterprisetech.com/crm", domain: "enterprisetech.com", da: 73, pa: 52, traffic: 118000, updated: "2026-06-05", bestPosition: 15, appearances: 1, mentionsBrand: false, competitorsMentioned: ["salesforce.com"] },
  ],
};

export default function ExampleReportPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container size="default">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 rounded-lg border border-coral/25 bg-coral-wash/40 px-4 py-2.5 text-center text-[13px] text-fog">
            This is an <strong className="font-semibold text-foreground">example report</strong> with
            sample data. Run the tool with your own keyword to get a real one.
          </p>
          <ListicleReport result={EXAMPLE} />
        </div>
      </Container>
    </section>
  );
}

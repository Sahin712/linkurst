import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DeferredBackdrop } from "@/components/layout/deferred-backdrop";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { siteConfig } from "@/lib/site";

// Variable fonts: omit `weight` so next/font loads one variable file covering
// every weight (300–700) instead of ~10 static files — far fewer requests, so
// the headline's real font arrives sooner (better LCP on mobile).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

// Editorial accent — used italic-only for emphasized words (the roman+italic move).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

// Technical labels / eyebrows.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Linkurst | Top SEO Agency for SaaS and B2B Growth",
    template: "%s · Linkurst",
  },
  description:
    "A top SEO agency for SaaS and B2B teams. Linkurst helps you win search, AI answers, and Reddit to own your market. Book a call to get started.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Linkurst | Top SEO Agency for SaaS and B2B Growth",
    description:
      "A top SEO agency for SaaS and B2B teams. Linkurst helps you win search, AI answers, and Reddit to own your market. Book a call to get started.",
    url: siteConfig.url,
    siteName: "Linkurst",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkurst | Top SEO Agency for SaaS and B2B Growth",
    description:
      "A top SEO agency for SaaS and B2B teams. Linkurst helps you win search, AI answers, and Reddit to own your market. Book a call to get started.",
    site: "@sksahin03",
    creator: "@sksahin03",
  },
  ...(siteConfig.googleSiteVerification
    ? { verification: { google: siteConfig.googleSiteVerification } }
    : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${plexMono.variable} h-full`}
    >
      <body className="relative flex min-h-full flex-col antialiased">
        <DeferredBackdrop />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <GoogleAnalytics gaId={siteConfig.gaId} />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Editorial accent — used italic-only for emphasized words (the roman+italic move).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
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
  metadataBase: new URL("https://linkurst.com"),
  title: {
    default: "Linkurst | Top SEO Agency for SaaS and B2B Growth",
    template: "%s · Linkurst",
  },
  description:
    "A top SEO agency for SaaS and B2B teams. Linkurst helps you win search, AI answers, and Reddit to own your market. Book a call to get started.",
  openGraph: {
    title: "Linkurst | Top SEO Agency for SaaS and B2B Growth",
    description:
      "A top SEO agency for SaaS and B2B teams. Linkurst helps you win search, AI answers, and Reddit to own your market. Book a call to get started.",
    siteName: "Linkurst",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

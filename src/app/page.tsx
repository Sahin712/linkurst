import { Hero } from "@/components/sections/hero";
import { FeaturedIn } from "@/components/sections/featured-in";
import { Shift } from "@/components/sections/shift";
import { Work } from "@/components/sections/work";
import { HowWeWork } from "@/components/sections/how-we-work";
import { Plan } from "@/components/sections/plan";
import { Services } from "@/components/sections/services";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <FeaturedIn />
      <Shift />
      <Work />
      <HowWeWork />
      <Plan />
      <Services />
      <Faq />
      <Cta />
    </>
  );
}

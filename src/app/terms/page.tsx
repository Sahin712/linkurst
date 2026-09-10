import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/legal-shell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern your use of the Linkurst website and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="September 10, 2026"
      intro="These Terms & Conditions govern your use of the Linkurst website. By using this site you agree to them. Any engagement for services is governed by the separate written agreement we sign with you, which prevails over these terms where they differ."
    >
      <h2>1. About these terms</h2>
      <p>
        &ldquo;Linkurst,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; and
        &ldquo;our&rdquo; refer to Linkurst. &ldquo;You&rdquo; refers to anyone
        using this website. If you do not agree with these terms, please do not
        use the site.
      </p>

      <h2>2. Use of the website</h2>
      <p>You agree to use this website only for lawful purposes. You must not:</p>
      <ul>
        <li>Use the site in any way that breaks applicable laws or regulations.</li>
        <li>
          Attempt to gain unauthorised access to the site, its servers, or any
          connected system.
        </li>
        <li>
          Introduce malware, or interfere with the proper working of the site.
        </li>
        <li>
          Scrape, copy, or reproduce site content except as permitted below.
        </li>
      </ul>

      <h2>3. Services and engagements</h2>
      <p>
        This website describes our services and lets you request a call. It is
        not an offer or a contract. Any paid engagement begins only when we and
        the client sign a separate written agreement setting out scope, fees,
        timelines, and responsibilities. That agreement, not this website,
        defines what we deliver.
      </p>

      <h2>4. No guaranteed results</h2>
      <p>
        Organic visibility depends on many factors outside our control,
        including search-engine and platform algorithms, competition, and your
        own product and market. Examples, figures, and interface mock-ups on
        this site are <strong>illustrative only</strong> and are not a promise
        or guarantee of any specific outcome, ranking, or result.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        All content on this site — text, design, graphics, and logos — is owned
        by Linkurst or its licensors and is protected by intellectual-property
        laws. You may view and share the content for personal, non-commercial
        reference with attribution. You may not otherwise reproduce, republish,
        or exploit it without our prior written permission.
      </p>

      <h2>6. Third-party links</h2>
      <p>
        This site may link to third-party websites and tools (for example, our
        scheduling provider). We are not responsible for the content or
        practices of those third parties, and a link does not imply our
        endorsement.
      </p>

      <h2>7. Disclaimer</h2>
      <p>
        The website and its content are provided &ldquo;as is&rdquo; and
        &ldquo;as available,&rdquo; without warranties of any kind, whether
        express or implied, to the fullest extent permitted by law. We do not
        warrant that the site will be uninterrupted, error-free, or free of
        harmful components.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Linkurst will not be liable for
        any indirect, incidental, or consequential loss arising from your use of
        this website. Nothing in these terms limits liability that cannot be
        limited under applicable law.
      </p>

      <h2>9. Privacy</h2>
      <p>
        Our handling of personal information is described in our{" "}
        <a href="/privacy">Privacy Policy</a>, which forms part of these terms.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Changes take effect when we
        post them here and revise the &ldquo;Last updated&rdquo; date above.
        Continued use of the site means you accept the updated terms.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws applicable at Linkurst&rsquo;s
        place of business, without regard to conflict-of-law rules. Disputes
        will be handled by the courts with jurisdiction there.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these terms? Email us at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </LegalShell>
  );
}

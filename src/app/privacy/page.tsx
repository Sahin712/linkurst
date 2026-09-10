import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/legal-shell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Linkurst collects, uses, and protects the information you share with us.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      updated="September 10, 2026"
      intro="This Privacy Policy explains what information Linkurst collects when you visit our website or contact us, how we use it, and the choices you have. We keep data collection to the minimum we need to run our business and serve you well."
    >
      <h2>1. Who we are</h2>
      <p>
        Linkurst (&ldquo;Linkurst,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;) is an organic-visibility consultancy for SaaS and B2B
        companies. This policy applies to{" "}
        <a href={siteConfig.url}>{siteConfig.url}</a> and to the services we
        provide through it. If you have any questions, contact us at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <h2>2. Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Contact details</strong> — your name, email address, company,
          and anything else you share when you book a call, email us, or fill in
          a form.
        </li>
        <li>
          <strong>Scheduling data</strong> — when you book a strategy call, our
          scheduling provider (Calendly) processes the details you enter to set
          up the meeting.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Usage data</strong> — pages visited, referring source,
          approximate location, browser and device type, collected through
          privacy-respecting analytics to understand how the site is used.
        </li>
        <li>
          <strong>Cookies and similar technologies</strong> — small files used
          to keep the site working and to measure aggregate traffic. See{" "}
          <a href="#cookies">Cookies</a> below.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> knowingly collect sensitive personal
        information, and we do not sell your personal information.
      </p>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To respond to your enquiries and schedule and conduct calls.</li>
        <li>To provide, maintain, and improve our services and website.</li>
        <li>
          To send you information you have requested, or updates relevant to a
          project we are working on together.
        </li>
        <li>
          To understand aggregate site usage so we can improve content and
          performance.
        </li>
        <li>To comply with legal obligations and enforce our terms.</li>
      </ul>

      <h2>4. Legal bases</h2>
      <p>
        Where the GDPR applies, we process personal data on the basis of your{" "}
        <strong>consent</strong> (for example, when you contact us), our{" "}
        <strong>legitimate interests</strong> in operating and improving our
        business, and to <strong>perform a contract</strong> with you or take
        steps at your request before entering one.
      </p>

      <h2 id="cookies">5. Cookies</h2>
      <p>
        We use essential cookies required for the site to function and
        analytics cookies to measure aggregate traffic. You can control or
        delete cookies through your browser settings; disabling some cookies may
        affect how the site works.
      </p>

      <h2>6. Third-party services</h2>
      <p>
        We rely on a small number of trusted providers to run our website and
        business. Each processes data only as needed to provide its service:
      </p>
      <ul>
        <li>
          <strong>Vercel</strong> — website hosting and delivery.
        </li>
        <li>
          <strong>Calendly</strong> — call scheduling.
        </li>
        <li>
          <strong>Analytics providers</strong> — aggregate, privacy-respecting
          usage measurement.
        </li>
      </ul>
      <p>
        These providers may process data outside your country. Where required,
        we rely on appropriate safeguards for such transfers.
      </p>

      <h2>7. How long we keep it</h2>
      <p>
        We keep personal information only as long as needed for the purposes
        described here, to maintain our business records, or to meet legal
        obligations, after which we delete or anonymise it.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct,
        delete, or export your personal information, to object to or restrict
        certain processing, and to withdraw consent at any time. To exercise any
        of these, email us at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and we will
        respond within a reasonable time.
      </p>

      <h2>9. Security</h2>
      <p>
        We take reasonable technical and organisational measures to protect your
        information. No method of transmission or storage is completely secure,
        so we cannot guarantee absolute security.
      </p>

      <h2>10. Children</h2>
      <p>
        Our services are intended for businesses and are not directed to
        children under 16. We do not knowingly collect information from
        children.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we will revise
        the &ldquo;Last updated&rdquo; date above. Material changes will be made
        clear on this page.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about this policy or your data? Email us at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </LegalShell>
  );
}

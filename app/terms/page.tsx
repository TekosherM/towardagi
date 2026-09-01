import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Toward AGI.",
};

export default function TermsPage() {
  return (
    <div className="pt-16">
      <PageHeader
        kicker="// legal"
        title="Terms of Service"
        description="The rules for using Toward AGI."
      />

      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="prose-agl">
          <p>Last updated: August 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Toward AGI, you agree to be bound by these Terms of Service.
            If you do not agree, do not use the site.
          </p>

          <h2>2. Content</h2>
          <p>
            All content on Toward AGI is provided for informational and educational purposes
            only. Opinions expressed are those of the individual authors and do not constitute
            financial, legal, or professional advice.
          </p>
          <p>
            While we strive for accuracy, we make no warranties about the completeness,
            reliability, or accuracy of the information presented.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            Original content published on Toward AGI is the property of Toward AGI and its
            contributors, and is protected by copyright and other intellectual property laws.
          </p>
          <p>
            You may share links to our content and quote brief excerpts with proper
            attribution. Republishing full articles without permission is prohibited.
          </p>

          <h2>4. User Conduct</h2>
          <p>When contributing or interacting with the site, you agree not to:</p>
          <ul>
            <li>Submit content that is unlawful, defamatory, or infringing on others&apos; rights.</li>
            <li>Impersonate any person or entity.</li>
            <li>Attempt to gain unauthorized access to any part of the site.</li>
            <li>Interfere with the proper functioning of the site.</li>
          </ul>

          <h2>5. Third-Party Links</h2>
          <p>
            The site may contain links to third-party websites. We are not responsible for the
            content or practices of those sites.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Toward AGI shall not be liable for any
            indirect, incidental, special, or consequential damages arising from your use of
            the site.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Continued use after changes constitutes
            acceptance of the new terms.
          </p>

          <h2>8. Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href="mailto:legal@towardagi.com">legal@towardagi.com</a>.
          </p>
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <Link
            href="/privacy"
            className="font-mono text-xs tracking-[0.18em] uppercase text-signal hover:underline"
          >
            View Privacy Policy →
          </Link>
        </div>
      </section>
    </div>
  );
}

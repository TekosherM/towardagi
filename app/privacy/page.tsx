import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Toward AGI collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-16">
      <PageHeader
        kicker="// legal"
        title="Privacy Policy"
        description="How we collect, use, and protect your data."
      />

      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="prose-agl">
          <p>Last updated: August 2026</p>

          <h2>1. Information We Collect</h2>
          <p>
            Toward AGI is a read-first publication. We collect minimal data:
          </p>
          <ul>
            <li>
              <strong>Analytics:</strong> Anonymous page-view data via privacy-respecting
              analytics (no personal identifiers, no cookies required for basic analytics).
            </li>
            <li>
              <strong>Newsletter:</strong> If you subscribe to our newsletter, we store your
              email address solely for the purpose of sending you the newsletter.
            </li>
            <li>
              <strong>Server logs:</strong> Standard web server logs (IP address, user agent,
              requested URL) may be processed by our hosting provider for operational purposes.
            </li>
          </ul>

          <h2>2. How We Use Information</h2>
          <p>We use the limited data we collect to:</p>
          <ul>
            <li>Understand which content resonates with readers (aggregate analytics only).</li>
            <li>Deliver the newsletter to subscribers who opted in.</li>
            <li>Maintain the security and performance of the site.</li>
          </ul>

          <h2>3. Cookies & Tracking</h2>
          <p>
            Toward AGI does not use advertising cookies, cross-site trackers, or fingerprinting
            scripts. If we use a privacy-respecting analytics tool, it operates without cookies
            or with an anonymous, no-cookie configuration.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>We may use the following categories of third-party services:</p>
          <ul>
            <li>
              <strong>Hosting:</strong> The site is hosted on infrastructure provided by our
              hosting partner (e.g., Vercel). Their data processing is governed by their own
              privacy policy.
            </li>
            <li>
              <Strong>Newsletter:</strong> If you subscribe, your email is processed by our
              newsletter delivery provider solely to send you the newsletter you requested.
            </li>
            <li>
              <strong>Embedded content:</strong> Articles may link to or embed content from
              third parties (e.g., tweets, YouTube videos). Those services may collect data
              according to their own policies.
            </li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            Newsletter subscriber data is retained until you unsubscribe. Analytics data is
            retained in aggregate form only. Server logs are retained only as long as required
            by our hosting provider.
          </p>

          <h2>6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access any personal data we hold about you.</li>
            <li>Request correction or deletion of your personal data.</li>
            <li>Withdraw consent for newsletter communications at any time.</li>
            <li>Object to or restrict certain processing of your data.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:privacy@towardagi.com">privacy@towardagi.com</a>.
          </p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Toward AGI is not directed to children under 13. We do not knowingly collect
            personal information from children.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be noted with
            an updated &quot;Last updated&quot; date. Continued use of the site after changes
            constitutes acceptance of the revised policy.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions about this policy or our data practices:{" "}
            <a href="mailto:privacy@towardagi.com">privacy@towardagi.com</a>.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            This policy is governed by the laws of the jurisdiction in which the publication
            operates, without regard to conflict-of-law principles.
          </p>
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <Link
            href="/terms"
            className="font-mono text-xs tracking-[0.18em] uppercase text-signal hover:underline"
          >
            View Terms of Service →
          </Link>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { getApps, getAppCategories } from "@/lib/apps";

export const metadata: Metadata = {
  title: "AI Apps & Services",
  description: "A curated directory of the best AI apps and services by category.",
};

const PRICING_BADGE: Record<string, { label: string; color: string }> = {
  free: { label: "Free", color: "#35f0d0" },
  freemium: { label: "Freemium", color: "#ffb454" },
  paid: { label: "Paid", color: "#ff6b8b" },
};

export default function AppsPage() {
  const apps = getApps();
  const categories = getAppCategories();

  return (
    <div className="pt-16">
      <PageHeader
        kicker="// best tool for the job"
        title="AI Apps & Services"
        description="A curated directory of the best AI apps and services, organized by task."
        meta={
          <nav className="flex flex-wrap gap-2" aria-label="Filter by category">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/apps/${cat.slug}`}
                className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[0.65rem] tracking-[0.16em] uppercase text-fog transition-colors hover:border-signal/50 hover:text-signal"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        }
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {categories.map((category) => {
          const categoryApps = apps.filter((a) => a.category === category.slug);
          if (categoryApps.length === 0) return null;

          return (
            <div key={category.slug} className="mb-16">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="display text-2xl text-bone">{category.name}</h2>
                  <p className="mt-1 text-sm text-fog">{category.description}</p>
                </div>
                <Link
                  href={`/apps/${category.slug}`}
                  className="font-mono text-xs tracking-[0.18em] uppercase text-signal hover:underline"
                >
                  View all →
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryApps.slice(0, 6).map((app) => (
                  <div
                    key={app.slug}
                    className="group flex flex-col border border-line bg-panel p-6 transition-all hover:-translate-y-0.5 hover:border-signal/50"
                  >
                    <div className="flex items-start justify-between">
                      <p className="display text-lg text-bone transition-colors group-hover:text-signal">
                        {app.name}
                      </p>
                      <span
                        className="border px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.1em] uppercase"
                        style={{
                          color: PRICING_BADGE[app.pricing].color,
                          borderColor: `${PRICING_BADGE[app.pricing].color}44`,
                        }}
                      >
                        {PRICING_BADGE[app.pricing].label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-fog">{app.description}</p>
                    <p className="mt-3 font-mono text-[0.62rem] tracking-[0.16em] uppercase text-dim">
                      Best for: {app.bestFor}
                    </p>
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-4 font-mono text-xs tracking-[0.18em] uppercase text-signal hover:underline"
                    >
                      Visit →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

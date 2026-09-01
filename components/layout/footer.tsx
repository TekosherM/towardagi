import Link from "next/link";
import { getStats } from "@/lib/content";
import { timeAgo } from "@/lib/utils";

const SECTIONS = [
  { href: "/news", label: "News" },
  { href: "/category/trends", label: "Trends" },
  { href: "/category/education", label: "Education" },
  { href: "/category/deep-dives", label: "Deep Dives" },
  { href: "/category/model-releases", label: "Model Releases" },
];

const PROJECT = [
  { href: "/models", label: "Model Radar" },
  { href: "/authors", label: "Authors" },
  { href: "/about", label: "About" },
  { href: "/contribute", label: "Contribute" },
  { href: "/search", label: "Search" },
  { href: "/feed.xml", label: "RSS" },
];

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  const stats = getStats();
  return (
    <footer className="relative border-t border-line bg-abyss" role="contentinfo">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="display text-3xl text-bone">
              TOWARD<span className="text-signal">//</span>AGI
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fog">
              Dispatches from the road to AGI. News, deep dives, and a live radar
              for every model that ships — written by people paying attention.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-dim">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" />
              system nominal — last scan {timeAgo(stats.lastScan)}
            </div>
          </div>

          <nav aria-label="Sections">
            <p className="kicker mb-4">Sections</p>
            <ul className="space-y-2.5">
              {SECTIONS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-fog transition-colors hover:text-signal">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Project">
            <p className="kicker mb-4">Project</p>
            <ul className="space-y-2.5">
              {PROJECT.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-fog transition-colors hover:text-signal">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 font-mono text-[0.65rem] tracking-[0.16em] uppercase text-dim sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Toward AGI. All signals reserved.</span>
          <span>
            {stats.posts} dispatches · {stats.models} models tracked
          </span>
        </div>
      </div>
    </footer>
  );
}

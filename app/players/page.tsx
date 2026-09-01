import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { getPlayers, getPlayerTypes } from "@/lib/players";

export const metadata: Metadata = {
  title: "Market Players",
  description: "A directory of AI market players: frontier labs, open-weights labs, aggregators, routers, and infrastructure providers.",
};

const TYPE_COLORS: Record<string, string> = {
  "frontier-lab": "#35f0d0",
  "open-weights-lab": "#9d8cff",
  aggregator: "#ffb454",
  router: "#6bc7ff",
  harness: "#ff6b8b",
  infrastructure: "#35f0d0",
  evaluation: "#ffb454",
};

export default function PlayersPage() {
  const players = getPlayers();
  const types = getPlayerTypes();

  return (
    <div className="pt-16">
      <PageHeader
        kicker="// market map"
        title="Market Players"
        description="A directory of the companies and platforms shaping the AI landscape."
        meta={
          <nav className="flex flex-wrap gap-2" aria-label="Filter by type">
            {types.map((t) => (
              <Link
                key={t.type}
                href={`#${t.type}`}
                className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[0.65rem] tracking-[0.16em] uppercase text-fog transition-colors hover:border-signal/50 hover:text-signal"
              >
                <span style={{ color: TYPE_COLORS[t.type] }}>●</span>
                {t.label} ({t.count})
              </Link>
            ))}
          </nav>
        }
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {types.map((type) => {
          const typePlayers = players.filter((p) => p.type === type.type);
          return (
            <div key={type.type} id={type.type} className="mb-16">
              <div className="mb-6 flex items-center gap-4">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: TYPE_COLORS[type.type] }}
                  aria-hidden
                />
                <h2 className="display text-2xl text-bone">{type.label}</h2>
                <span className="font-mono text-xs text-dim">{type.count}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {typePlayers.map((player) => (
                  <Link
                    key={player.slug}
                    href={`/players/${player.slug}`}
                    className="group flex flex-col border border-line bg-panel p-6 transition-all hover:-translate-y-0.5 hover:border-signal/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="display text-lg text-bone transition-colors group-hover:text-signal">
                          {player.name}
                        </p>
                        <p className="mt-1 text-sm text-fog">{player.description}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {player.features.slice(0, 4).map((f) => (
                        <span
                          key={f}
                          className="border border-line px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.1em] uppercase text-dim"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 font-mono text-[0.62rem] tracking-[0.16em] uppercase text-dim">
                      {player.pricing["free-tier"] ? "Free tier available" : "Paid"} · {player.models.length} models
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

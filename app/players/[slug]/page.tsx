import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/fx/reveal";
import { getPlayer, getPlayers } from "@/lib/players";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getPlayers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayer(slug);
  if (!player) return { title: "Player not found" };
  return { title: player.name, description: player.description };
}

export default async function PlayerPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const player = getPlayer(slug);
  if (!player) notFound();

  const alternatives = player.alternatives
    .map((a) => getPlayer(a))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="pt-16">
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-bg grid-fade opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8">
          <Reveal>
            <p className="kicker mb-5 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-signal" aria-hidden />
              market player
            </p>
            <h1 className="display text-4xl leading-tight text-bone sm:text-6xl">{player.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog">{player.description}</p>
            <div className="mt-6">
              <a href={player.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-[0.18em] uppercase text-signal hover:underline">
                Visit {player.name} \u2192
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <Reveal>
            <div className="space-y-8">
              <div>
                <p className="kicker mb-4">// models</p>
                <div className="flex flex-wrap gap-2">
                  {player.models.map((m) => (
                    <span key={m} className="border border-line px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase text-bone">{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="kicker mb-4">// features</p>
                <div className="flex flex-wrap gap-2">
                  {player.features.map((f) => (
                    <span key={f} className="border border-signal/30 bg-signal/5 px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase text-signal">{f}</span>
                  ))}
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="kicker mb-4">// strengths</p>
                  <ul className="space-y-2">
                    {player.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-fog"><span className="mt-1 text-signal">+</span>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kicker mb-4">// limitations</p>
                  <ul className="space-y-2">
                    {player.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-fog"><span className="mt-1 text-rose">\u2212</span>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex h-full flex-col justify-between border border-line bg-panel p-6">
              <div>
                <p className="kicker mb-4">// pricing</p>
                <p className="text-sm text-fog">{player.pricing["starting-price"]}</p>
                <p className="mt-2 font-mono text-[0.62rem] tracking-[0.16em] uppercase text-dim">
                  {player.pricing["free-tier"] ? "Free tier available" : "No free tier"}
                </p>
              </div>

              {alternatives.length > 0 && (
                <div className="mt-8">
                  <p className="kicker mb-4">// alternatives</p>
                  <div className="space-y-2">
                    {alternatives.map((alt) => (
                      <Link key={alt.slug} href={`/players/${alt.slug}`} className="block border border-line px-4 py-3 text-sm text-fog transition-colors hover:border-signal/50 hover:text-signal">
                        {alt.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link href="/players" className="mt-8 inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.18em] uppercase text-signal hover:underline">
                \u2190 all players
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, Stagger } from "@/components/fx/reveal";
import { Pill } from "@/components/ui/badge";
import { PostCard } from "@/components/ui/post-card";
import { Terminal } from "@/components/ui/terminal";
import { CAPABILITIES, SCORE_DOTS, profileFor } from "@/lib/capabilities";
import { getCapabilityOverlay, getModel, getPostsForModel, getRegistry } from "@/lib/content";
import { formatDate, formatNumber, timeAgo } from "@/lib/utils";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getRegistry().models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return { title: "Contact not found" };
  return {
    title: `${model.org}/${model.name}`,
    description: model.summary ?? `Radar contact: ${model.org}/${model.name} (${model.pipeline}).`,
  };
}

export default async function ModelPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();

  const posts = getPostsForModel(model.id);
  const profile = profileFor(model, getCapabilityOverlay());
  const rated = CAPABILITIES.map((c) => ({ cap: c, score: profile.scores[c.id] ?? 0 })).filter(
    (r) => r.score > 0,
  );

  const facts: Array<[string, string]> = [
    ["id", model.id],
    ["source", model.source],
    ["pipeline", model.pipeline],
    ...(model.modality ? ([["modality", model.modality]] as Array<[string, string]>) : []),
    ...(model.context !== undefined
      ? ([["context", formatNumber(model.context)]] as Array<[string, string]>)
      : []),
    ...(model.downloads !== undefined
      ? ([["downloads", formatNumber(model.downloads)]] as Array<[string, string]>)
      : []),
    ...(model.likes !== undefined
      ? ([["likes", formatNumber(model.likes)]] as Array<[string, string]>)
      : []),
    ["released", formatDate(model.releasedAt, "long")],
    ["acquired", `${formatDate(model.discoveredAt, "long")} (${timeAgo(model.discoveredAt)})`],
  ];

  return (
    <div className="pt-16">
      <header className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-bg grid-fade opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8">
          <Reveal>
            <p className="kicker mb-5 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-signal" aria-hidden />
              radar contact
            </p>
            <h1 className="display text-4xl leading-tight text-bone sm:text-6xl">
              {model.org}<span className="text-dim">/</span>
              <span className="text-signal glow-signal">{model.name}</span>
            </h1>
            {model.summary && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog">{model.summary}</p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Pill color="#35f0d0">{model.source}</Pill>
              <Pill>{model.pipeline}</Pill>
              {model.modality && <Pill color="#6bc7ff">{model.modality}</Pill>}
              {model.tags?.slice(0, 6).map((t) => (
                <Pill key={t} color="#5b6470">{t}</Pill>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <Reveal>
            <Terminal title={`dossier — ${model.id}`}>
              <ul className="space-y-2">
                {facts.map(([k, v]) => (
                  <li key={k} className="flex gap-4">
                    <span className="w-24 shrink-0 text-dim">{k}</span>
                    <span className="text-bone/85">{v}</span>
                  </li>
                ))}
              </ul>
              {rated.length > 0 && (
                <div className="mt-6 border-t border-line/60 pt-4">
                  <p className="mb-3 text-dim">
                    <span className="text-signal">$</span> capability profile{" "}
                    <span className="text-dim/70">
                      ({profile.provenance === "curated" ? "editorial" : "heuristic"})
                    </span>
                  </p>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
                    {rated.map(({ cap, score }) => (
                      <li key={cap.id} className="flex items-baseline gap-2" title={cap.blurb}>
                        <span className="w-6 shrink-0 text-center text-signal">{SCORE_DOTS[score]}</span>
                        <span className="truncate text-bone/75">{cap.label}</span>
                      </li>
                    ))}
                  </ul>
                  {profile.note && (
                    <p className="mt-3 leading-relaxed text-fog/80">{profile.note}</p>
                  )}
                </div>
              )}
              <p className="mt-5 text-dim">
                <span className="text-signal">$</span> upstream record:{" "}
                <a
                  href={model.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-signal underline-offset-4 hover:underline"
                >
                  {model.url}
                </a>
              </p>
            </Terminal>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex h-full flex-col justify-between border border-line bg-panel p-6">
              <div>
                <p className="kicker mb-4">// coverage</p>
                <p className="text-sm leading-relaxed text-fog">
                  {posts.length > 0
                    ? `${posts.length} dispatch${posts.length === 1 ? "" : "es"} reference this contact.`
                    : "No dispatches reference this contact yet. The radar spotted it; the writers have not caught up."}
                </p>
              </div>
              <Link
                href="/models"
                className="mt-8 inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.18em] uppercase text-signal hover:underline"
              >
                ← back to radar
              </Link>
            </div>
          </Reveal>
        </div>

        {posts.length > 0 && (
          <div className="mt-20">
            <p className="kicker mb-8">// dispatches mentioning this model</p>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </Stagger>
          </div>
        )}
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger } from "@/components/fx/reveal";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/badge";
import { Terminal } from "@/components/ui/terminal";
import { getRegistry } from "@/lib/content";
import { formatNumber, timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Model Radar",
  description:
    "A live radar for every new AI model. Sweeps Hugging Face and OpenRouter every six hours and logs each acquisition.",
};

const SOURCE_COLOR: Record<string, string> = {
  huggingface: "#ffb454",
  openrouter: "#9d8cff",
  both: "#35f0d0",
};

export default function ModelsPage() {
  const registry = getRegistry();
  const models = registry.models;

  return (
    <div className="pt-16">
      <PageHeader
        kicker="// live acquisition system"
        title="Model Radar"
        description="An automated sweep of Hugging Face and OpenRouter, every six hours. Every new model is logged, tagged, and linked — usually within hours of release."
        meta={
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-dim">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" aria-hidden />
              sweep interval: 06h
            </span>
            <span>last scan: {timeAgo(registry.updatedAt)}</span>
            <span>{registry.modelCount} contacts logged</span>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {models.length === 0 ? (
          <Reveal>
            <Terminal title="radar — awaiting first sweep">
              <p className="text-dim">
                <span className="text-signal">$</span> radar online. no contacts yet —
                first sweep pending.
                <span className="ml-1 inline-block h-3.5 w-1.5 animate-blink bg-signal align-middle" aria-hidden />
              </p>
            </Terminal>
          </Reveal>
        ) : (
          <Stagger className="grid gap-4">
            {models.map((m) => (
              <Link
                key={m.id}
                href={`/models/${m.slug}`}
                className="group grid gap-4 border border-line bg-panel p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-signal/50 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:p-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-dim">
                      {timeAgo(m.discoveredAt)}
                    </span>
                    <Pill color={SOURCE_COLOR[m.source] ?? "#97a1af"}>{m.source}</Pill>
                    <Pill>{m.pipeline}</Pill>
                    {m.modality && <Pill color="#6bc7ff">{m.modality}</Pill>}
                  </div>
                  <p className="display mt-3 truncate text-xl text-bone transition-colors group-hover:text-signal">
                    {m.org}<span className="text-dim">/</span>{m.name}
                  </p>
                  {m.summary && (
                    <p className="mt-1.5 line-clamp-1 text-sm text-fog">{m.summary}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-6 font-mono text-[0.65rem] tracking-[0.14em] uppercase text-dim">
                  {m.context !== undefined && (
                    <span>
                      <span className="text-fog">{formatNumber(m.context)}</span> ctx
                    </span>
                  )}
                  {m.downloads !== undefined && (
                    <span>
                      <span className="text-fog">{formatNumber(m.downloads)}</span> dl
                    </span>
                  )}
                  {m.likes !== undefined && (
                    <span>
                      <span className="text-fog">{formatNumber(m.likes)}</span> likes
                    </span>
                  )}
                  <span aria-hidden className="text-signal opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </div>
              </Link>
            ))}
          </Stagger>
        )}

        <Reveal className="mt-14">
          <div className="border border-line bg-abyss p-6 font-mono text-[0.7rem] leading-relaxed text-dim">
            <p>
              <span className="text-signal">$</span> how the radar works
            </p>
            <p className="mt-2">
              A scheduled job queries the Hugging Face model API (sorted by creation
              date) and the OpenRouter model list, merges the results, and commits
              new contacts to the registry. Each contact gets a detail page and can
              be referenced from any dispatch.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

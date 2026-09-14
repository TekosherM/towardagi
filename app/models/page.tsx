import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger } from "@/components/fx/reveal";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Pill } from "@/components/ui/badge";
import { Terminal } from "@/components/ui/terminal";
import {
  JOB_LANES,
  SCORE_DOTS,
  SCORE_LABELS,
  capabilityMeta,
  profileFor,
  rankFor,
  type CapabilityId,
  type CapabilityScore,
} from "@/lib/capabilities";
import { getCapabilityOverlay, getRecentModels, getRegistry, getUpcoming } from "@/lib/content";
import type { ModelEntry, UpcomingConfidence } from "@/lib/types";
import { formatDate, formatNumber, timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Model Radar",
  description:
    "A live radar for every new AI model — last-30-day releases, a capability catalog by task type, and an upcoming-model watchlist. Sweeps Hugging Face and OpenRouter every six hours.",
};

const SOURCE_COLOR: Record<string, string> = {
  huggingface: "#ffb454",
  openrouter: "#9d8cff",
  both: "#35f0d0",
};

const CONFIDENCE_COLOR: Record<UpcomingConfidence, string> = {
  confirmed: "#35f0d0",
  reported: "#6bc7ff",
  rumored: "#ffb454",
  signal: "#5b6470",
};

const MATRIX_CAPS: CapabilityId[] = [
  "chat",
  "vibecoding",
  "claw",
  "spark",
  "reasoning",
  "vision",
  "latency",
  "context",
];

function ScoreCell({ score }: { score: CapabilityScore | 0 }) {
  const label = SCORE_LABELS[score];
  return (
    <td className="px-3 py-2.5 text-center" title={`${score}/3 — ${label}`}>
      <span
        className={
          score === 3
            ? "text-signal"
            : score === 2
              ? "text-bone/80"
              : score === 1
                ? "text-fog"
                : "text-dim/50"
        }
        aria-label={`score ${score} of 3, ${label}`}
      >
        {SCORE_DOTS[score]}
      </span>
    </td>
  );
}

function ModelLine({ m }: { m: ModelEntry }) {
  return (
    <Link
      href={`/models/${m.slug}`}
      className="group flex items-baseline gap-2 truncate font-mono text-[0.75rem] text-bone/85 underline-offset-4 hover:text-signal"
    >
      <span className="text-signal" aria-hidden>+</span>
      <span className="truncate">
        {m.org}<span className="text-dim">/</span>{m.name}
      </span>
    </Link>
  );
}

export default function ModelsPage() {
  const registry = getRegistry();
  const overlay = getCapabilityOverlay();
  const upcoming = getUpcoming();
  const models = registry.models;
  const recent = getRecentModels(30);

  // matrix rows: curated profiles first, then top-liked heuristic models
  const curated = models.filter((m) => profileFor(m, overlay).provenance === "curated");
  const fallback = models
    .filter((m) => profileFor(m, overlay).provenance === "heuristic")
    .sort((a, b) => (b.likes ?? 0) + (b.downloads ?? 0) / 1000 - ((a.likes ?? 0) + (a.downloads ?? 0) / 1000));
  const matrixModels = [...curated, ...fallback].slice(0, 14);

  return (
    <div className="pt-16">
      <PageHeader
        kicker="// live acquisition system"
        title="Model Radar"
        description="An automated sweep of Hugging Face and OpenRouter, every six hours — filtered to notable labs and high-signal releases, with a capability catalog mapping every contact to the jobs it can actually do."
        meta={
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-dim">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" aria-hidden />
              sweep interval: 06h
            </span>
            <span>last scan: {timeAgo(registry.updatedAt)}</span>
            <span>{registry.modelCount} contacts logged</span>
            <span className="text-signal">{recent.length} in last 30d</span>
          </div>
        }
      />

      {/* ——— introduced: last 30 days ——— */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          kicker="// introductions"
          title="Last 30 days"
          action={{ href: "#registry", label: "Full registry" }}
        />
        <Reveal>
          <Terminal title={`radar — ${recent.length} new contacts since ${formatDate(new Date(Date.now() - 30 * 864e5).toISOString())}`}>
            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {recent.slice(0, 16).map((m) => (
                <li key={m.id} className="flex items-baseline gap-3">
                  <span className="shrink-0 text-dim">{formatDate(m.releasedAt)}</span>
                  <ModelLine m={m} />
                  <span className="ml-auto hidden shrink-0 text-dim lg:inline">
                    {m.pipeline}
                  </span>
                </li>
              ))}
            </ul>
            {recent.length > 16 && (
              <p className="mt-4 text-dim">
                <span className="text-signal">$</span> +{recent.length - 16} more contacts in
                the registry below — the long tail is mostly community fine-tunes.
              </p>
            )}
          </Terminal>
        </Reveal>
      </section>

      {/* ——— catalog by task type ——— */}
      <section className="border-y border-line bg-abyss/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <SectionHeading
            kicker="// catalog"
            title="Latest model catalog by task type"
          />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_LANES.map((cap) => {
              const top = rankFor(models, cap.id, overlay, 3);
              return (
                <div key={cap.id} className="border border-line bg-panel p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="display text-lg text-bone">{cap.label}</p>
                    <span className="font-mono text-[0.6rem] tracking-[0.16em] uppercase text-dim">
                      {cap.short}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-fog">{cap.blurb}</p>
                  <ul className="mt-4 space-y-1.5">
                    {top.map(({ model, score, provenance }) => (
                      <li key={model.id} className="flex items-baseline gap-2">
                        <span className="w-8 shrink-0 text-center font-mono text-[0.65rem] text-signal">
                          {SCORE_DOTS[score]}
                        </span>
                        <ModelLine m={model} />
                        {provenance === "curated" && (
                          <span
                            className="ml-auto shrink-0 font-mono text-[0.55rem] tracking-[0.14em] uppercase text-signal/70"
                            title="Editorially curated score"
                          >
                            ed
                          </span>
                        )}
                      </li>
                    ))}
                    {top.length === 0 && (
                      <li className="font-mono text-[0.7rem] text-dim">no contacts yet</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </Stagger>
          <Reveal className="mt-6">
            <p className="font-mono text-[0.65rem] leading-relaxed tracking-[0.1em] text-dim">
              scores: {SCORE_DOTS[1]} serviceable · {SCORE_DOTS[2]} strong ·{" "}
              {SCORE_DOTS[3]} elite — <span className="text-signal/80">ed</span> marks
              editorial curation; all other scores are heuristically inferred from
              model metadata, not benchmarks.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— capability matrix ——— */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          kicker="// matrix"
          title="Capability matrix"
        />
        <Reveal>
          <div className="overflow-x-auto border border-line">
            <table className="w-full min-w-[760px] border-collapse font-mono text-[0.72rem]">
              <thead>
                <tr className="border-b border-line bg-panel text-left">
                  <th className="px-4 py-3 font-normal uppercase tracking-[0.14em] text-dim">model</th>
                  {MATRIX_CAPS.map((id) => (
                    <th
                      key={id}
                      className="px-3 py-3 text-center font-normal uppercase tracking-[0.14em] text-dim"
                      title={capabilityMeta(id).blurb}
                    >
                      {capabilityMeta(id).short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixModels.map((m) => {
                  const p = profileFor(m, overlay);
                  return (
                    <tr key={m.id} className="border-b border-line/60 transition-colors hover:bg-panel/60">
                      <td className="px-4 py-2.5">
                        <Link href={`/models/${m.slug}`} className="text-bone/90 underline-offset-4 hover:text-signal hover:underline">
                          {m.org}/{m.name}
                        </Link>
                        {p.provenance === "curated" && (
                          <span className="ml-2 text-[0.55rem] uppercase tracking-[0.14em] text-signal/70">ed</span>
                        )}
                      </td>
                      {MATRIX_CAPS.map((id) => (
                        <ScoreCell key={id} score={p.scores[id] ?? 0} />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ——— upcoming watchlist ——— */}
      <section className="border-y border-line bg-abyss/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <SectionHeading
            kicker="// watchlist"
            title="Upcoming — next week"
          />
          {upcoming.entries.length === 0 ? (
            <Reveal>
              <p className="border border-line bg-panel p-8 font-mono text-sm text-dim">
                <span className="text-signal">$</span> watchlist empty — no signals on the wire.
              </p>
            </Reveal>
          ) : (
            <Stagger className="grid gap-4 sm:grid-cols-2">
              {upcoming.entries.map((e) => (
                <div key={e.id} className="flex flex-col border border-line bg-panel p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill color={CONFIDENCE_COLOR[e.confidence]}>{e.confidence}</Pill>
                    <Pill color="#5b6470">{e.source === "radar" ? "radar hint" : "curated"}</Pill>
                    <span className="ml-auto font-mono text-[0.62rem] tracking-[0.16em] uppercase text-dim">
                      {e.expectedWindow}
                    </span>
                  </div>
                  <p className="display mt-4 text-xl text-bone">
                    {e.org}<span className="text-dim">/</span>{e.name}
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-fog">{e.note}</p>
                  {e.url && (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.16em] uppercase text-signal underline-offset-4 hover:underline"
                    >
                      source →
                    </a>
                  )}
                </div>
              ))}
            </Stagger>
          )}
          <Reveal className="mt-6">
            <p className="font-mono text-[0.65rem] leading-relaxed tracking-[0.1em] text-dim">
              watchlist entries are signals, not commitments — "rumored" and "signal"
              confidence means no confirmed date exists.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— full registry ——— */}
      <section id="registry" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8">
        <SectionHeading
          kicker="// all contacts"
          title="Registry"
        />
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
              date) and the OpenRouter model list, then keeps only notable contacts:
              models from known lab orgs, or community releases that clear an
              engagement bar and aren't derivative repacks (see{" "}
              <span className="text-bone/80">content/models/notable-orgs.json</span>).
              Each contact gets a detail page and a
              heuristic capability profile; editors can override any score in{" "}
              <span className="text-bone/80">content/models/capabilities.json</span>.
              The watchlist combines curated entries with radar hints extracted from
              the news sweep.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

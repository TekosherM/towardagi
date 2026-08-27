import Link from "next/link";
import HeroScene from "@/components/fx/hero-scene";
import Scramble from "@/components/fx/scramble";
import { Marquee } from "@/components/fx/marquee";
import { Reveal, Stagger } from "@/components/fx/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { PostCard } from "@/components/ui/post-card";
import { Terminal } from "@/components/ui/terminal";
import { CATEGORIES } from "@/lib/categories";
import { getFeatured, getLatest, getRegistry, getStats } from "@/lib/content";
import { timeAgo } from "@/lib/utils";

function Hero() {
  const stats = getStats();
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      <HeroScene />
      <div className="pointer-events-none absolute inset-0 grid-bg grid-fade" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-16 sm:px-8">
        <p className="kicker mb-6 flex items-center gap-3">
          <span className="inline-block h-px w-10 bg-signal" aria-hidden />
          Transmission 001 — the frontier, decoded
        </p>

        <h1 className="display max-w-5xl text-[clamp(2.6rem,7.5vw,6.5rem)] leading-[0.98] text-bone">
          <Scramble text="Dispatches from" duration={900} />
          <br />
          <span className="text-signal glow-signal">
            <Scramble text="the road to AGI." delay={500} duration={1000} />
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-fog">
          News, trends, education, and deep dives on the models shaping what comes
          next — with a live radar that catches every release within hours.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/news"
            className="group inline-flex items-center gap-3 bg-signal px-6 py-3.5 font-mono text-xs tracking-[0.18em] uppercase text-void transition-transform hover:-translate-y-0.5"
          >
            Read the latest
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/models"
            className="inline-flex items-center gap-3 border border-line px-6 py-3.5 font-mono text-xs tracking-[0.18em] uppercase text-bone transition-colors hover:border-signal/60 hover:text-signal"
          >
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" aria-hidden />
            Model radar
          </Link>
        </div>

        <div className="mt-20 grid max-w-2xl grid-cols-3 gap-px border border-line bg-line">
          {[
            { n: String(stats.models), l: "models tracked" },
            { n: String(stats.posts), l: "dispatches published" },
            { n: String(stats.authors), l: "contributors" },
          ].map((s) => (
            <div key={s.l} className="bg-void/90 px-5 py-4">
              <p className="display text-2xl text-bone sm:text-3xl">{s.n}</p>
              <p className="mt-1 font-mono text-[0.6rem] tracking-[0.18em] uppercase text-dim">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-dim">
        <span className="inline-block animate-blink" aria-hidden>▼</span> scroll
      </div>
    </section>
  );
}

function Ticker() {
  const registry = getRegistry();
  const posts = getLatest(6);
  const items = [
    ...registry.models.slice(0, 8).map((m) => ({
      label: `NEW SIGNAL: ${m.org}/${m.name}`,
      href: `/models/${m.slug}`,
      color: "#35f0d0",
    })),
    ...posts.map((p) => ({
      label: p.title,
      href: `/articles/${p.slug}`,
      color: "#97a1af",
    })),
  ];

  return (
    <div className="border-y border-line bg-abyss py-3.5">
      <Marquee>
        {items.map((item, i) => (
          <Link
            key={`${item.label}-${i}`}
            href={item.href}
            className="mx-6 flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-opacity hover:opacity-70"
            style={{ color: item.color }}
          >
            <span aria-hidden>✦</span>
            {item.label}
          </Link>
        ))}
      </Marquee>
    </div>
  );
}

function RadarPreview() {
  const registry = getRegistry();
  const latest = registry.models.slice(0, 6);

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading
        kicker="// live feed"
        title="The Model Radar"
        action={{ href: "/models", label: "Open full radar" }}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <Reveal>
          <Terminal title="radar — recent acquisitions">
            {latest.length === 0 && (
              <p className="text-dim">
                <span className="text-signal">$</span> scanning… first sweep pending.
              </p>
            )}
            <ul className="space-y-2.5">
              {latest.map((m) => (
                <li key={m.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-dim">{timeAgo(m.discoveredAt)}</span>
                  <span className="text-signal">+</span>
                  <Link href={`/models/${m.slug}`} className="text-bone underline-offset-4 hover:underline">
                    {m.org}/{m.name}
                  </Link>
                  <span className="text-dim">[{m.pipeline}]</span>
                  <span className="ml-auto hidden text-dim sm:inline">via {m.source}</span>
                </li>
              ))}
            </ul>
            {latest.length > 0 && (
              <p className="mt-4 text-dim">
                <span className="text-signal">$</span> watching huggingface · openrouter
                <span className="ml-1 inline-block h-3.5 w-1.5 animate-blink bg-signal align-middle" aria-hidden />
              </p>
            )}
          </Terminal>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-line bg-abyss">
            <div className="absolute inset-6 rounded-full border border-line" aria-hidden />
            <div className="absolute inset-16 rounded-full border border-line" aria-hidden />
            <div className="absolute inset-28 rounded-full border border-line" aria-hidden />
            <div className="absolute inset-x-6 top-1/2 h-px bg-line" aria-hidden />
            <div className="absolute inset-y-6 left-1/2 w-px bg-line" aria-hidden />
            <div className="absolute inset-6 animate-sweep rounded-full radar-sweep" aria-hidden />
            {latest.slice(0, 5).map((m, i) => (
              <span
                key={m.id}
                className="absolute h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal"
                style={{
                  left: `${18 + ((i * 37) % 64)}%`,
                  top: `${22 + ((i * 23) % 56)}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
                aria-hidden
              />
            ))}
            <p className="relative font-mono text-[0.6rem] tracking-[0.3em] uppercase text-dim">
              sweep 06h
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  const featured = getFeatured();
  const latest = getLatest(7).filter((p) => p.slug !== featured?.slug).slice(0, 6);

  return (
    <>
      <Hero />
      <Ticker />

      {featured && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <SectionHeading kicker="// featured dispatch" title="Lead story" />
          <Reveal>
            <PostCard post={featured} size="lg" />
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <SectionHeading
          kicker="// fresh signal"
          title="Latest dispatches"
          action={{ href: "/news", label: "All dispatches" }}
        />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </Stagger>
      </section>

      <RadarPreview />

      <section className="border-y border-line bg-abyss">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <SectionHeading kicker="// navigate" title="Explore the archive" />
          <Stagger className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.route}`}
                className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-void p-6 transition-colors hover:bg-panel"
              >
                <div
                  className="absolute -right-8 -top-8 text-[7rem] leading-none opacity-[0.07] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.16]"
                  style={{ color: cat.color }}
                  aria-hidden
                >
                  {cat.glyph}
                </div>
                <span
                  className="font-mono text-[0.65rem] tracking-[0.22em] uppercase"
                  style={{ color: cat.color }}
                >
                  {cat.glyph} {cat.label}
                </span>
                <div>
                  <p className="display text-xl text-bone">{cat.plural}</p>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-fog">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-28 text-center sm:px-8">
        <Reveal>
          <p className="kicker mb-6">// the mission</p>
          <p className="font-serif text-3xl italic leading-snug text-bone sm:text-[2.6rem] sm:leading-[1.3]">
            “The most important technology of our lifetime is being built in public.
            Someone should be paying attention — carefully, critically, and in plain
            language.”
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block font-mono text-xs tracking-[0.2em] uppercase text-signal underline-offset-8 hover:underline"
          >
            Read the manifesto →
          </Link>
        </Reveal>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden border border-signal/30 bg-panel p-10 sm:p-16">
              <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="kicker mb-4">// open channel</p>
                  <h2 className="display text-3xl text-bone sm:text-4xl">
                    Write the future with us.
                  </h2>
                  <p className="mt-4 max-w-lg leading-relaxed text-fog">
                    Toward AGI is an open publication. Researchers, engineers, and
                    close observers of the field are invited to publish. Bring a
                    sharp take; we bring the audience and the editing.
                  </p>
                </div>
                <div className="flex flex-col gap-3 lg:items-end">
                  <Link
                    href="/contribute"
                    className="inline-flex items-center gap-3 bg-signal px-7 py-4 font-mono text-xs tracking-[0.18em] uppercase text-void transition-transform hover:-translate-y-0.5"
                  >
                    Become a contributor <span aria-hidden>→</span>
                  </Link>
                  <span className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-dim">
                    byline · editorial support · your voice
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

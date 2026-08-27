import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger } from "@/components/fx/reveal";
import { PageHeader } from "@/components/ui/page-header";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Toward AGI exists: an independent publication tracking the road to AGI — carefully, critically, and in plain language.",
};

const PRINCIPLES = [
  {
    n: "01",
    title: "Attention is the product",
    body: "The most important technology of our lifetime is being built in public. Our job is to watch closely — and to tell you what we saw without the hype distortion field.",
  },
  {
    n: "02",
    title: "Plain language, no dumbing down",
    body: "We explain attention, RLHF, evals, and scaling so a smart non-specialist can follow — without pretending the hard parts are easy.",
  },
  {
    n: "03",
    title: "Receipts or it didn't happen",
    body: "Claims get linked. Benchmarks get sourced. When we speculate, we say so in plain text.",
  },
  {
    n: "04",
    title: "The radar never sleeps",
    body: "An automated sweep of Hugging Face and OpenRouter runs every six hours. If a model ships, it lands on the radar — usually the same day.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      <PageHeader
        kicker="// the manifesto"
        title="Why we watch the road."
        description="Toward AGI is an independent publication covering the systems, labs, and ideas on the road to artificial general intelligence."
      />

      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="prose-agl">
            <p>
              Somewhere between the press releases and the doomsday threads, there is
              an actual story: a technology advancing faster than any before it, built
              by a few thousand people, watched by everyone, and understood — fully —
              by almost no one.
            </p>
            <p>
              We started Toward AGI because the coverage of that story was broken.
              Too much of it is marketing republished as news, or fear repackaged as
              analysis. We wanted a third option: <strong>dispatches written by people
              who read the papers, run the models, and still have the patience to
              explain things properly.</strong>
            </p>
            <p>
              The name is a direction, not a prediction. Whether AGI arrives in five
              years or fifty, the road there is the defining technical story of this
              era. Every model release, every eval, every policy fight is a mile
              marker. We log them all.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-abyss">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <p className="kicker mb-10">// operating principles</p>
          <Stagger className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="bg-void p-8 sm:p-10">
                <p className="font-mono text-[0.65rem] tracking-[0.24em] text-signal">{p.n}</p>
                <h2 className="display mt-4 text-xl text-bone">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-fog">{p.body}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p className="kicker mb-10">// what we cover</p>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.route}`}
              className="group border border-line bg-panel p-6 transition-all duration-300 hover:-translate-y-1 hover:border-signal/50"
            >
              <span className="text-2xl" style={{ color: cat.color }} aria-hidden>
                {cat.glyph}
              </span>
              <p className="display mt-4 text-lg text-bone group-hover:text-signal">{cat.plural}</p>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-fog">{cat.description}</p>
            </Link>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-28 text-center sm:px-8">
        <Reveal>
          <p className="font-serif text-2xl italic leading-snug text-bone sm:text-3xl sm:leading-[1.4]">
            “Someone should be paying attention — carefully, critically, and in plain
            language. So we are.”
          </p>
          <Link
            href="/contribute"
            className="mt-8 inline-block bg-signal px-7 py-4 font-mono text-xs tracking-[0.18em] uppercase text-void transition-transform hover:-translate-y-0.5"
          >
            Join the publication →
          </Link>
        </Reveal>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger } from "@/components/fx/reveal";
import { PageHeader } from "@/components/ui/page-header";
import { Terminal } from "@/components/ui/terminal";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Write for Toward AGI. Researchers, engineers, and close observers of the field are invited to publish — bring a sharp take; we bring the audience and the editing.",
};

const STEPS = [
  {
    n: "01",
    title: "Pitch it",
    body: "Open an issue or email the desk with one paragraph: what's the story, why now, why you. We reply within a few days.",
  },
  {
    n: "02",
    title: "Write it in MDX",
    body: "Accepted pitches get a file in content/posts/. Write in Markdown with superpowers — callouts, code, tables. Frontmatter handles the metadata.",
  },
  {
    n: "03",
    title: "Ship it via PR",
    body: "Open a pull request. An editor reviews for accuracy, structure, and voice. Once merged, your dispatch is live with your byline.",
  },
];

const TEMPLATE = `---
title: "Your headline here"
description: "One or two sentences that make the reader need to continue."
category: deep-dive        # news | model-release | trends | education | deep-dive
date: 2026-08-27
authors: [your-slug]
tags: [scaling, evals]
featured: false
model: openai/gpt-5        # optional — links to a radar contact
---

## Opening section

Your prose here. Sharp takes, receipts, plain language.

<Callout type="signal" title="Key point">
Callouts highlight the one thing a skimmer must not miss.
</Callout>

## What actually matters

Close with the takeaway — what changed, and what to watch next.`;

export default function ContributePage() {
  return (
    <div className="pt-16">
      <PageHeader
        kicker="// open channel"
        title="Write the future with us."
        description="Toward AGI is an open publication. Researchers, engineers, and close observers of the field are invited to publish. Bring a sharp take; we bring the audience and the editing."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Stagger className="grid gap-px border border-line bg-line md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-void p-8">
              <p className="font-mono text-[0.65rem] tracking-[0.24em] text-signal">{s.n}</p>
              <h2 className="display mt-4 text-xl text-bone">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-fog">{s.body}</p>
            </div>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div>
              <p className="kicker mb-6">// the template</p>
              <p className="leading-relaxed text-fog">
                Every dispatch is a single <code className="font-mono text-sm text-signal">.mdx</code> file.
                The frontmatter below is all the metadata we need — the site generates
                the cover art, reading time, table of contents, and byline from it.
              </p>
              <p className="mt-6 font-mono text-[0.68rem] tracking-[0.16em] uppercase text-dim">
                accepted channels:
              </p>
              <ul className="mt-3 space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug} className="flex items-center gap-3 text-sm text-fog">
                    <span aria-hidden style={{ color: cat.color }}>{cat.glyph}</span>
                    <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-bone">
                      {cat.slug}
                    </span>
                    <span className="hidden text-dim sm:inline">— {cat.label}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="mailto:desk@towardagi.com"
                className="mt-10 inline-flex items-center gap-3 bg-signal px-6 py-3.5 font-mono text-xs tracking-[0.18em] uppercase text-void transition-transform hover:-translate-y-0.5"
              >
                Pitch the desk <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <Terminal title="content/posts/your-dispatch.mdx">
              <pre className="whitespace-pre-wrap text-[0.72rem] leading-relaxed text-bone/80">
                {TEMPLATE}
              </pre>
            </Terminal>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-abyss">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
          <Reveal>
            <p className="kicker mb-6">// house rules</p>
            <p className="font-serif text-2xl italic leading-snug text-bone sm:text-3xl">
              No press-release rewrites. No undisclosed conflicts. No hype you would
              not say to a colleague's face.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

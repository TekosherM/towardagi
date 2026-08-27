import type { Metadata } from "next";
import Link from "next/link";
import { Stagger } from "@/components/fx/reveal";
import { PageHeader } from "@/components/ui/page-header";
import { getAuthors, getPostsByAuthor } from "@/lib/content";

export const metadata: Metadata = {
  title: "Authors",
  description: "The people writing Toward AGI — editors, researchers, and guest contributors.",
};

export default function AuthorsPage() {
  const authors = getAuthors();

  return (
    <div className="pt-16">
      <PageHeader
        kicker="// personnel file"
        title="The writers."
        description="Toward AGI is written by people paying attention — editors, researchers, engineers, and guest contributors with a sharp take."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {authors.length === 0 ? (
          <p className="border border-line bg-panel p-10 text-center font-mono text-sm text-dim">
            No authors on file yet.
          </p>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => {
              const accent = author.accent ?? "#35f0d0";
              const count = getPostsByAuthor(author.slug).length;
              return (
                <Link
                  key={author.slug}
                  href={`/authors/${author.slug}`}
                  className="group flex flex-col border border-line bg-panel p-7 transition-all duration-300 hover:-translate-y-1 hover:border-signal/50"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center border font-mono text-lg transition-colors"
                    style={{ borderColor: `${accent}55`, color: accent }}
                    aria-hidden
                  >
                    {author.name.slice(0, 1)}
                  </div>
                  <p className="display mt-5 text-xl text-bone transition-colors group-hover:text-signal">
                    {author.name}
                  </p>
                  <p className="mt-1 font-mono text-[0.62rem] tracking-[0.18em] uppercase text-dim">
                    {author.role}
                  </p>
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-fog">{author.bio}</p>
                  <p className="mt-auto pt-5 font-mono text-[0.62rem] tracking-[0.16em] uppercase text-dim">
                    {count} dispatch{count === 1 ? "" : "es"}
                  </p>
                </Link>
              );
            })}
          </Stagger>
        )}
      </section>
    </div>
  );
}

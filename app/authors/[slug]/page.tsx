import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, Stagger } from "@/components/fx/reveal";
import { PostCard } from "@/components/ui/post-card";
import { getAuthor, getAuthors, getPostsByAuthor } from "@/lib/content";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return { title: "Author not found" };
  return { title: author.name, description: author.bio };
}

export default async function AuthorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const accent = author.accent ?? "#35f0d0";
  const posts = getPostsByAuthor(author.slug);

  return (
    <div className="pt-16">
      <header className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-bg grid-fade opacity-70" aria-hidden />
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: accent }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8">
          <Reveal>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center border font-mono text-2xl"
                style={{ borderColor: `${accent}55`, color: accent }}
                aria-hidden
              >
                {author.name.slice(0, 1)}
              </div>
              <div>
                <p className="kicker mb-4" style={{ color: accent }}>
                  // personnel file
                </p>
                <h1 className="display text-4xl text-bone sm:text-5xl">{author.name}</h1>
                <p className="mt-2 font-mono text-[0.68rem] tracking-[0.2em] uppercase text-dim">
                  {author.role}
                </p>
                <p className="mt-5 max-w-2xl leading-relaxed text-fog">{author.bio}</p>
                {author.links && (
                  <div className="mt-6 flex flex-wrap gap-4 font-mono text-[0.65rem] tracking-[0.16em] uppercase">
                    {author.links.x && (
                      <a
                        href={author.links.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fog transition-colors hover:text-signal"
                      >
                        ↗ x / twitter
                      </a>
                    )}
                    {author.links.github && (
                      <a
                        href={author.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fog transition-colors hover:text-signal"
                      >
                        ↗ github
                      </a>
                    )}
                    {author.links.site && (
                      <a
                        href={author.links.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fog transition-colors hover:text-signal"
                      >
                        ↗ website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <p className="kicker mb-8">// dispatches by {author.name}</p>
        {posts.length === 0 ? (
          <p className="border border-line bg-panel p-10 text-center font-mono text-sm text-dim">
            Nothing published yet.
          </p>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </Stagger>
        )}

        <Link
          href="/authors"
          className="mt-12 inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.18em] uppercase text-signal hover:underline"
        >
          ← all authors
        </Link>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ProgressBar } from "@/components/article/progress";
import { Toc } from "@/components/article/toc";
import { mdxComponents } from "@/components/article/mdx-components";
import { Reveal, Stagger } from "@/components/fx/reveal";
import { CategoryBadge } from "@/components/ui/badge";
import { CoverArt } from "@/components/ui/cover-art";
import { PostCard } from "@/components/ui/post-card";
import { categoryMeta } from "@/lib/categories";
import { extractToc, getAuthor, getPost, getPosts, getRelated } from "@/lib/content";
import { formatDate } from "@/lib/utils";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Signal lost" };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.authors.map((a) => getAuthor(a)?.name ?? a),
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const meta = categoryMeta(post.category);
  const toc = extractToc(post.body);
  const related = getRelated(post);
  const authors = post.authors
    .map((a) => getAuthor(a))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <article className="pt-16">
      <ProgressBar />

      <header className="relative overflow-hidden border-b border-line">
        <CoverArt
          seed={post.slug}
          color={meta.color}
          label={post.slug}
          className="absolute inset-0 h-full w-full opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/80 to-void" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-20 sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/category/${meta.route}`}>
                <CategoryBadge category={post.category} />
              </Link>
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-dim">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="display mt-6 text-4xl leading-[1.08] text-bone sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fog">{post.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.68rem] tracking-[0.16em] uppercase text-dim">
              {authors.map((a) => (
                <Link key={a.slug} href={`/authors/${a.slug}`} className="text-fog transition-colors hover:text-signal">
                  {a.name}
                </Link>
              ))}
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatDate(post.date, "long")}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <Toc items={toc} />
          </div>
        </aside>

        <div className="prose-agl max-w-3xl">
          <MDXRemote source={post.body} components={mdxComponents} />

          <footer className="mt-16 border-t border-line pt-10">
            {authors.length > 0 && (
              <div className="mb-12 flex flex-col gap-6 border border-line bg-panel p-6 sm:flex-row sm:items-center">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center border font-mono text-lg"
                  style={{ borderColor: `${meta.color}55`, color: meta.color }}
                  aria-hidden
                >
                  {authors[0].name.slice(0, 1)}
                </div>
                <div>
                  <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-dim">
                    Filed by
                  </p>
                  <p className="display mt-1 text-lg text-bone">
                    <Link href={`/authors/${authors[0].slug}`} className="hover:text-signal">
                      {authors[0].name}
                    </Link>
                  </p>
                  <p className="mt-1 text-sm text-fog">{authors[0].role}</p>
                </div>
              </div>
            )}

            {related.length > 0 && (
              <div>
                <p className="kicker mb-6">// related dispatches</p>
                <Stagger className="grid gap-6 sm:grid-cols-2">
                  {related.slice(0, 2).map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </Stagger>
              </div>
            )}
          </footer>
        </div>
      </div>
    </article>
  );
}

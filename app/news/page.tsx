import type { Metadata } from "next";
import Link from "next/link";
import { Stagger } from "@/components/fx/reveal";
import { PageHeader } from "@/components/ui/page-header";
import { PostCard } from "@/components/ui/post-card";
import { CATEGORIES } from "@/lib/categories";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description:
    "Every dispatch from Toward AGI — news, model releases, trends, education, and deep dives, newest first.",
};

export default function NewsPage() {
  const posts = getPosts();

  return (
    <div className="pt-16">
      <PageHeader
        kicker="// all channels"
        title="The full signal."
        description="Every dispatch we have published, newest first. Filter by channel to narrow the feed."
        meta={
          <nav className="flex flex-wrap gap-2" aria-label="Filter by channel">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.route}`}
                className="inline-flex items-center gap-2 border border-line px-3.5 py-2 font-mono text-[0.65rem] tracking-[0.16em] uppercase text-fog transition-colors hover:border-signal/50 hover:text-signal"
              >
                <span aria-hidden style={{ color: cat.color }}>{cat.glyph}</span>
                {cat.plural}
              </Link>
            ))}
          </nav>
        }
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <p className="mb-8 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-dim">
          {posts.length} dispatch{posts.length === 1 ? "" : "es"} on record
        </p>
        {posts.length === 0 ? (
          <p className="border border-line bg-panel p-10 text-center font-mono text-sm text-dim">
            No dispatches yet. The presses are warming up.
          </p>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </Stagger>
        )}
      </section>
    </div>
  );
}

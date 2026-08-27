import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Stagger } from "@/components/fx/reveal";
import { PageHeader } from "@/components/ui/page-header";
import { PostCard } from "@/components/ui/post-card";
import { CATEGORIES, categoryByRoute } from "@/lib/categories";
import { getPosts } from "@/lib/content";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return CATEGORIES.map((c) => ({ slug: c.route }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = categoryByRoute(slug);
  if (!meta) return { title: "Channel not found" };
  return { title: meta.plural, description: meta.description };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const meta = categoryByRoute(slug);
  if (!meta) notFound();

  const posts = getPosts().filter((p) => p.category === meta.slug);
  const others = CATEGORIES.filter((c) => c.slug !== meta.slug);

  return (
    <div className="pt-16">
      <PageHeader
        kicker={`// channel ${meta.glyph}`}
        title={meta.plural}
        description={meta.description}
        accent={meta.color}
        meta={
          <nav className="flex flex-wrap gap-2" aria-label="Other channels">
            {others.map((cat) => (
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
          {posts.length} dispatch{posts.length === 1 ? "" : "es"} in this channel
        </p>
        {posts.length === 0 ? (
          <p className="border border-line bg-panel p-10 text-center font-mono text-sm text-dim">
            Nothing filed under {meta.label.toLowerCase()} yet. Check back soon.
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

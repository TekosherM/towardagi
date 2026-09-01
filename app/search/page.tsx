"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Reveal, Stagger } from "@/components/fx/reveal";
import { CategoryBadge } from "@/components/ui/badge";
import { getPosts } from "@/lib/content";
import { categoryMeta } from "@/lib/categories";
import { formatDate } from "@/lib/utils";

export default function SearchPage() {
  const posts = getPosts();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, pathname, router, searchParams]);

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "title", weight: 0.5 },
          { name: "description", weight: 0.3 },
          { name: "tags", weight: 0.15 },
          { name: "category", weight: 0.05 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [posts],
  );

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return fuse.search(debouncedQuery).map((r) => r.item);
  }, [fuse, debouncedQuery]);

  return (
    <div className="pt-16">
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-bg grid-fade opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8">
          <Reveal>
            <p className="kicker mb-5 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-signal" aria-hidden />
              search
            </p>
            <h1 className="display max-w-3xl text-4xl leading-[1.05] text-bone sm:text-6xl">
              Find a signal.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog">
              Search across all dispatches, tags, and categories.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-10">
          <label htmlFor="search-input" className="sr-only">
            Search dispatches
          </label>
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dim"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, topic, or tag..."
              className="w-full border border-line bg-void py-4 pl-12 pr-4 font-mono text-sm text-bone placeholder:text-dim focus:border-signal/60 focus:outline-none"
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <p className="mt-3 font-mono text-[0.65rem] tracking-[0.16em] uppercase text-dim">
            {debouncedQuery.trim()
              ? `${results.length} result${results.length === 1 ? "" : "s"} for "${debouncedQuery.trim()}"`
              : `${posts.length} dispatches indexed — start typing to search`}
          </p>
        </div>

        {debouncedQuery.trim() === "" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((post) => {
              const meta = categoryMeta(post.category);
              return (
                <Link
                  key={post.slug}
                  href={`/articles/${post.slug}`}
                  className="group border border-line bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-signal/50"
                >
                  <CategoryBadge category={post.category} />
                  <p className="display mt-3 text-base text-bone transition-colors group-hover:text-signal">
                    {post.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-fog">{post.description}</p>
                </Link>
              );
            })}
          </div>
        ) : results.length === 0 ? (
          <div className="border border-line bg-panel p-12 text-center">
            <p className="display text-xl text-bone">No signals found.</p>
            <p className="mt-3 text-sm text-fog">
              Try a different search term or browse{" "}
              <Link href="/news" className="text-signal hover:underline">
                all dispatches
              </Link>
              .
            </p>
          </div>
        ) : (
          <Stagger className="grid gap-4">
            {results.map((post) => {
              const meta = categoryMeta(post.category);
              return (
                <Link
                  key={post.slug}
                  href={`/articles/${post.slug}`}
                  className="group grid gap-4 border border-line bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-signal/50 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={post.category} />
                      <span className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-dim">
                        {formatDate(post.date)}
                      </span>
                    </div>
                    <p className="display mt-2 text-lg text-bone transition-colors group-hover:text-signal">
                      {post.title}
                    </p>
                    <p className="mt-1 line-clamp-1 text-sm text-fog">{post.description}</p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.16em] uppercase text-dim">
                    <span>{post.readingTime} min</span>
                    <span aria-hidden className="text-signal opacity-0 transition-opacity group-hover:opacity-100">
                      ?
                    </span>
                  </div>
                </Link>
              );
            })}
          </Stagger>
        )}
      </section>
    </div>
  );
}

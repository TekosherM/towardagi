import Link from "next/link";
import type { Post } from "@/lib/types";
import { categoryMeta } from "@/lib/categories";
import { getAuthor } from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";
import { CategoryBadge } from "./badge";
import { CoverArt } from "./cover-art";

interface PostCardProps {
  post: Post;
  size?: "md" | "lg";
  className?: string;
}

export function PostCard({ post, size = "md", className }: PostCardProps) {
  const meta = categoryMeta(post.category);
  const author = getAuthor(post.authors[0]);

  if (size === "lg") {
    return (
      <Link
        href={`/articles/${post.slug}`}
        className={cn(
          "group grid overflow-hidden border border-line bg-panel transition-colors duration-300 hover:border-signal/50 lg:grid-cols-[1.15fr_1fr]",
          className,
        )}
      >
        <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
          <CoverArt
            seed={post.slug}
            color={meta.color}
            label={post.slug}
            className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-col justify-between gap-8 p-7 sm:p-10">
          <div>
            <CategoryBadge category={post.category} />
            <h3 className="display mt-5 text-2xl leading-tight text-bone transition-colors group-hover:text-signal sm:text-[2rem]">
              {post.title}
            </h3>
            <p className="mt-4 line-clamp-3 leading-relaxed text-fog">{post.description}</p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.14em] uppercase text-dim">
            <span className="text-fog">{author?.name ?? "Editorial"}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime} min</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden border border-line bg-panel transition-all duration-300 hover:-translate-y-1 hover:border-signal/50",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <CoverArt
          seed={post.slug}
          color={meta.color}
          label={post.slug}
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <CategoryBadge category={post.category} className="self-start" />
        <h3 className="display text-lg leading-snug text-bone transition-colors group-hover:text-signal">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-fog">{post.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-3 font-mono text-[0.62rem] tracking-[0.14em] uppercase text-dim">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}

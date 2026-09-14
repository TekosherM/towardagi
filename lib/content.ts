import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type { CapabilityOverlay } from "./capabilities";
import type { Author, Category, Post, Registry, TocItem, UpcomingFeed } from "./types";
import { readingTime, slugify } from "./utils";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const AUTHORS_DIR = path.join(ROOT, "content", "authors");
const REGISTRY_PATH = path.join(ROOT, "content", "models", "registry.json");
const CAPABILITIES_PATH = path.join(ROOT, "content", "models", "capabilities.json");
const UPCOMING_PATH = path.join(ROOT, "content", "models", "upcoming.json");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

export const getPosts = cache((): Post[] => {
  const files = walk(POSTS_DIR);
  const posts: Post[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = matter(raw);
      const rel = path.relative(POSTS_DIR, file);
      const slug =
        (data.slug as string) ||
        slugify(rel.replace(/\.mdx$/, "").split(path.sep).pop() ?? "");
      posts.push({
        slug,
        title: (data.title as string) ?? slug,
        description: (data.description as string) ?? "",
        category: (data.category as Category) ?? "news",
        date: (data.date as string) ?? "1970-01-01",
        authors: (data.authors as string[]) ?? ["editorial"],
        tags: (data.tags as string[]) ?? [],
        featured: Boolean(data.featured),
        model: data.model as string | undefined,
        auto: Boolean(data.auto),
        draft: Boolean(data.draft),
        readingTime: readingTime(content),
        body: content,
      });
    } catch {
      // skip malformed files rather than crashing the build
    }
  }
  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
});

export const getPost = cache((slug: string): Post | undefined =>
  getPosts().find((p) => p.slug === slug),
);

export function getLatest(n: number, category?: Category): Post[] {
  const posts = getPosts();
  const filtered = category ? posts.filter((p) => p.category === category) : posts;
  return filtered.slice(0, n);
}

export function getFeatured(): Post | undefined {
  return getPosts().find((p) => p.featured) ?? getPosts()[0];
}

export function getRelated(post: Post, n = 3): Post[] {
  return getPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const score = (p: Post) =>
        (p.category === post.category ? 2 : 0) +
        p.tags.filter((t) => post.tags.includes(t)).length;
      return score(b) - score(a);
    })
    .slice(0, n);
}

export const getAuthors = cache((): Author[] => {
  const files = walk(AUTHORS_DIR);
  const authors: Author[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);
    const slug =
      (data.slug as string) ??
      slugify(file.replace(/\.mdx$/, "").split(path.sep).pop() ?? "");
    authors.push({
      slug,
      name: (data.name as string) ?? slug,
      role: (data.role as string) ?? "Contributor",
      bio: (data.bio as string) ?? "",
      accent: data.accent as string | undefined,
      links: data.links as Author["links"],
    });
  }
  return authors.sort((a, b) => a.name.localeCompare(b.name));
});

export const getAuthor = cache((slug: string): Author | undefined =>
  getAuthors().find((a) => a.slug === slug),
);

export function getPostsByAuthor(slug: string): Post[] {
  return getPosts().filter((p) => p.authors.includes(slug));
}

export const getRegistry = cache((): Registry => {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    return JSON.parse(raw) as Registry;
  } catch {
    return { updatedAt: new Date(0).toISOString(), modelCount: 0, models: [] };
  }
});

export function getModel(slug: string) {
  return getRegistry().models.find((m) => m.slug === slug);
}

export const getCapabilityOverlay = cache((): CapabilityOverlay => {
  try {
    const raw = fs.readFileSync(CAPABILITIES_PATH, "utf8");
    return JSON.parse(raw) as CapabilityOverlay;
  } catch {
    return {};
  }
});

export const getUpcoming = cache((): UpcomingFeed => {
  try {
    const raw = fs.readFileSync(UPCOMING_PATH, "utf8");
    return JSON.parse(raw) as UpcomingFeed;
  } catch {
    return { updatedAt: new Date(0).toISOString(), entries: [] };
  }
});

export function getRecentModels(days = 30) {
  const cutoff = Date.now() - days * 86_400_000;
  return getRegistry().models.filter(
    (m) => +new Date(m.releasedAt) >= cutoff || +new Date(m.discoveredAt) >= cutoff,
  );
}

export function getPostsForModel(modelId: string): Post[] {
  return getPosts().filter((p) => p.model === modelId);
}

export function extractToc(body: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = body.split("\n");
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (match) {
      const text = match[2].replace(/[*_`]/g, "").trim();
      items.push({ depth: match[1].length as 2 | 3, id: slugify(text), text });
    }
  }
  return items;
}

export function getStats() {
  const posts = getPosts();
  const registry = getRegistry();
  const byCategory = new Map<Category, number>();
  for (const p of posts) {
    byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1);
  }
  return {
    posts: posts.length,
    models: registry.modelCount,
    authors: getAuthors().length,
    byCategory,
    lastScan: registry.updatedAt,
  };
}

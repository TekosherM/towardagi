import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { getAuthors, getPosts, getRegistry } from "@/lib/content";

const BASE = "https://towardagi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/news`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/models`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/authors`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contribute`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE}/category/${c.route}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = getPosts().map((p) => ({
    url: `${BASE}/articles/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const modelRoutes: MetadataRoute.Sitemap = getRegistry().models.map((m) => ({
    url: `${BASE}/models/${m.slug}`,
    lastModified: new Date(m.discoveredAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const authorRoutes: MetadataRoute.Sitemap = getAuthors().map((a) => ({
    url: `${BASE}/authors/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...articleRoutes,
    ...modelRoutes,
    ...authorRoutes,
  ];
}

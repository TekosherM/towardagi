import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

export interface App {
  slug: string;
  name: string;
  category: string;
  tasks: string[];
  pricing: "free" | "freemium" | "paid";
  url: string;
  description: string;
  bestFor: string;
  alternatives: string[];
}

export interface AppCategory {
  slug: string;
  name: string;
  description: string;
}

export interface AppRegistry {
  updatedAt: string;
  categories: AppCategory[];
  apps: App[];
}

const REGISTRY_PATH = path.join(process.cwd(), "content", "apps", "registry.json");

export const getApps = cache((): App[] => {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    const registry = JSON.parse(raw) as AppRegistry;
    return registry.apps;
  } catch {
    return [];
  }
});

export const getApp = cache((slug: string): App | undefined => {
  return getApps().find((a) => a.slug === slug);
});

export const getAppCategories = cache((): AppCategory[] => {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    const registry = JSON.parse(raw) as AppRegistry;
    return registry.categories;
  } catch {
    return [];
  }
});

export const getAppsByCategory = cache((category: string): App[] => {
  return getApps().filter((a) => a.category === category);
});

export const getAppsByPricing = cache((pricing: App["pricing"]): App[] => {
  return getApps().filter((a) => a.pricing === pricing);
});

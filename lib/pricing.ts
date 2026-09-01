import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

export interface ModelPricing {
  name: string;
  input: number;
  output: number;
  context: number;
  unit: string;
}

export interface ProviderPricing {
  slug: string;
  name: string;
  models: ModelPricing[];
}

export interface PricingRegistry {
  updatedAt: string;
  providers: ProviderPricing[];
}

const REGISTRY_PATH = path.join(process.cwd(), "content", "pricing", "registry.json");

export const getPricing = cache((): ProviderPricing[] => {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    const registry = JSON.parse(raw) as PricingRegistry;
    return registry.providers;
  } catch {
    return [];
  }
});

export const getProviderPricing = cache((slug: string): ProviderPricing | undefined => {
  return getPricing().find((p) => p.slug === slug);
});

export const getPricingUpdatedAt = cache((): string => {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    const registry = JSON.parse(raw) as PricingRegistry;
    return registry.updatedAt;
  } catch {
    return new Date(0).toISOString();
  }
});

export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  if (price < 1) return `$${price.toFixed(3)}`;
  return `$${price.toFixed(2)}`;
}

export function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`;
  return String(tokens);
}

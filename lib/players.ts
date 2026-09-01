import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

export interface PlayerPricing {
  api: string;
  "free-tier": boolean;
  "starting-price": string;
}

export interface Player {
  slug: string;
  name: string;
  type: "frontier-lab" | "open-weights-lab" | "aggregator" | "router" | "harness" | "infrastructure" | "evaluation";
  description: string;
  url: string;
  models: string[];
  pricing: PlayerPricing;
  features: string[];
  pros: string[];
  cons: string[];
  alternatives: string[];
}

export interface PlayerRegistry {
  updatedAt: string;
  players: Player[];
}

const REGISTRY_PATH = path.join(process.cwd(), "content", "players", "registry.json");

export const getPlayers = cache((): Player[] => {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    const registry = JSON.parse(raw) as PlayerRegistry;
    return registry.players;
  } catch {
    return [];
  }
});

export const getPlayer = cache((slug: string): Player | undefined => {
  return getPlayers().find((p) => p.slug === slug);
});

export const getPlayersByType = cache((type: Player["type"]): Player[] => {
  return getPlayers().filter((p) => p.type === type);
});

export const getPlayerTypes = cache((): Array<{ type: Player["type"]; label: string; count: number }> => {
  const types: Array<{ type: Player["type"]; label: string }> = [
    { type: "frontier-lab", label: "Frontier Labs" },
    { type: "open-weights-lab", label: "Open-Weights Labs" },
    { type: "aggregator", label: "Aggregators" },
    { type: "router", label: "Routers" },
    { type: "harness", label: "Harness & Orchestration" },
    { type: "infrastructure", label: "Infrastructure" },
    { type: "evaluation", label: "Evaluation & Observability" },
  ];

  const players = getPlayers();
  return types.map((t) => ({
    ...t,
    count: players.filter((p) => p.type === t.type).length,
  })).filter((t) => t.count > 0);
});

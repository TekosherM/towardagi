#!/usr/bin/env node
/**
 * Model radar discovery script.
 *
 * Sweeps Hugging Face and OpenRouter for new text-generation models and
 * merges them into content/models/registry.json. Existing entries are
 * preserved; only new ids are appended. Safe to run on a cron schedule.
 *
 * Usage: node scripts/discover-models.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = path.join(ROOT, "content", "models", "registry.json");
const MAX_MODELS = 300;

const HF_URL =
  "https://huggingface.co/api/models?sort=createdAt&direction=-1&limit=100&filter=text-generation";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/models";

function slugifyId(id) {
  return id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function fetchJson(url, label) {
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      console.warn(`[discover] ${label}: HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[discover] ${label}: ${err.message}`);
    return null;
  }
}

async function fetchHuggingFace() {
  const data = await fetchJson(HF_URL, "huggingface");
  if (!Array.isArray(data)) return [];
  return data.map((m) => ({
    id: m.modelId ?? m.id,
    slug: slugifyId(m.modelId ?? m.id ?? ""),
    name: (m.modelId ?? m.id ?? "").split("/").pop(),
    org: (m.modelId ?? m.id ?? "").split("/")[0] ?? "unknown",
    source: "huggingface",
    discoveredAt: new Date().toISOString(),
    releasedAt: m.createdAt ?? new Date().toISOString(),
    pipeline: m.pipeline_tag ?? "text-generation",
    modality: "text",
    likes: typeof m.likes === "number" ? m.likes : undefined,
    downloads: typeof m.downloads === "number" ? m.downloads : undefined,
    tags: Array.isArray(m.tags) ? m.tags.slice(0, 12) : [],
    url: `https://huggingface.co/${m.modelId ?? m.id}`,
  }));
}

async function fetchOpenRouter() {
  const data = await fetchJson(OPENROUTER_URL, "openrouter");
  const list = Array.isArray(data?.data) ? data.data : [];
  return list
    .filter((m) => typeof m.id === "string" && m.id.includes("/"))
    .slice(0, 100)
    .map((m) => ({
      id: m.id,
      slug: slugifyId(m.id),
      name: m.name ?? m.id.split("/").pop(),
      org: m.id.split("/")[0],
      source: "openrouter",
      discoveredAt: new Date().toISOString(),
      releasedAt: m.created
        ? new Date(m.created * 1000).toISOString()
        : new Date().toISOString(),
      pipeline: "text-generation",
      modality: m.architecture?.input_modalities?.includes("image")
        ? "multimodal"
        : "text",
      context:
        typeof m.context_length === "number" ? m.context_length : undefined,
      tags: Array.isArray(m.tags) ? m.tags.slice(0, 12) : [],
      url: `https://openrouter.ai/${m.id}`,
    }));
}

function loadRegistry() {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  } catch {
    return { updatedAt: new Date(0).toISOString(), modelCount: 0, models: [] };
  }
}

function merge(registry, incoming) {
  const byId = new Map(registry.models.map((m) => [m.id, m]));
  let added = 0;

  for (const entry of incoming) {
    if (!entry.id || !entry.slug) continue;
    const existing = byId.get(entry.id);
    if (!existing) {
      byId.set(entry.id, entry);
      added += 1;
    } else if (
      existing.source !== entry.source &&
      existing.source !== "both"
    ) {
      byId.set(entry.id, { ...existing, source: "both" });
    }
  }

  const models = [...byId.values()]
    .sort((a, b) => +new Date(b.discoveredAt) - +new Date(a.discoveredAt))
    .slice(0, MAX_MODELS);

  return {
    registry: {
      updatedAt: new Date().toISOString(),
      modelCount: models.length,
      models,
    },
    added,
  };
}

const registry = loadRegistry();
const [hf, or] = await Promise.all([fetchHuggingFace(), fetchOpenRouter()]);
const { registry: next, added } = merge(registry, [...hf, ...or]);

fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(next, null, 2)}\n`);

console.log(
  `[discover] hf=${hf.length} openrouter=${or.length} added=${added} total=${next.modelCount}`,
);

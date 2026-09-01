#!/usr/bin/env node
/**
 * Model radar discovery script.
 *
 * Sweeps Hugging Face and OpenRouter for new text-generation models and
 * merges them into content/models/registry.json. Existing entries are
 * preserved; only new ids are appended. Safe to run on a cron schedule.
 *
 * For new models, auto-publishes a brief "radar contact" post to
 * content/posts/model-releases/auto-{slug}.mdx.
 *
 * Usage: node scripts/discover-models.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = path.join(ROOT, "content", "models", "registry.json");
const POSTS_DIR = path.join(ROOT, "content", "posts", "model-releases");
const MAX_MODELS = 300;

const HF_URL =
  "https://huggingface.co/api/models?sort=createdAt&direction=-1&limit=100&filter=text-generation";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/models";

function slugifyId(id) {
  return id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function formatNumber(n) {
  if (n === undefined || Number.isNaN(n)) return "\u2014";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function generateModelPost(model) {
  const date = new Date().toISOString().split("T")[0];
  const contextStr = model.context ? formatNumber(model.context) : "\u2014";

  return `---
title: "${model.org}/${model.name} \u2014 Radar Contact"
description: "Automated radar contact for ${model.org}/${model.name}, a ${model.pipeline} model detected on ${model.source}."
category: model-release
date: ${date}
auto: true
model: ${model.id}
tags: [${(model.tags || []).slice(0, 5).map((t) => `"${t}"`).join(", ")}]
---

**${model.org}/${model.name}** was detected by the model radar on ${date}.

| Field | Value |
|-------|-------|
| **Source** | ${model.source} |
| **Pipeline** | ${model.pipeline} |
| **Modality** | ${model.modality || "text"} |
| **Context** | ${contextStr} tokens |
| **Downloads** | ${formatNumber(model.downloads)} |
| **Likes** | ${formatNumber(model.likes)} |

- [View on Hugging Face](https://huggingface.co/${model.id})
${model.source === "openrouter" || model.source === "both" ? `- [View on OpenRouter](https://openrouter.ai/${model.id})` : ""}

<Callout type="signal" title="Automated radar contact">
This post was generated automatically by the model radar. Editorial analysis may follow.
</Callout>
`;
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
  const newModels = [];

  for (const entry of incoming) {
    if (!entry.id || !entry.slug) continue;
    const existing = byId.get(entry.id);
    if (!existing) {
      byId.set(entry.id, entry);
      newModels.push(entry);
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
    newModels,
  };
}

function autoPublishModels(models) {
  if (models.length === 0) return 0;

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  let published = 0;

  for (const model of models) {
    const filename = `auto-${model.slug}.mdx`;
    const filepath = path.join(POSTS_DIR, filename);

    // Skip if already published
    if (fs.existsSync(filepath)) continue;

    const content = generateModelPost(model);
    fs.writeFileSync(filepath, content);
    published += 1;
    console.log(`[discover] auto-published: ${filename}`);
  }

  return published;
}

const registry = loadRegistry();
const [hf, or] = await Promise.all([fetchHuggingFace(), fetchOpenRouter()]);
const { registry: next, added, newModels } = merge(registry, [...hf, ...or]);

fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(next, null, 2)}\n`);

const published = autoPublishModels(newModels);

console.log(
  `[discover] hf=${hf.length} openrouter=${or.length} added=${added} published=${published} total=${next.modelCount}`,
);
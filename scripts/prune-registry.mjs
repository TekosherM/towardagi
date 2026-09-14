#!/usr/bin/env node
/**
 * Registry prune — removes non-notable contacts and their auto-published posts.
 *
 * A contact survives pruning when any of these hold:
 *   - it comes from a allowlisted lab org (content/models/notable-orgs.json)
 *   - it clears the engagement bar and isn't a derivative repack
 *   - it is referenced by an editorial post (`model:` frontmatter)
 *   - it matches a curated capability overlay entry (capabilities.json)
 *
 * Auto-published radar posts (content/posts/model-releases/auto-*.mdx) for
 * pruned models are deleted. Editorial posts are never touched.
 *
 * Usage: node scripts/prune-registry.mjs [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = path.join(ROOT, "content", "models", "registry.json");
const NOTABLE_PATH = path.join(ROOT, "content", "models", "notable-orgs.json");
const OVERLAY_PATH = path.join(ROOT, "content", "models", "capabilities.json");
const POSTS_DIR = path.join(ROOT, "content", "posts", "model-releases");
const DRY_RUN = process.argv.includes("--dry-run");

const NOTABLE = JSON.parse(fs.readFileSync(NOTABLE_PATH, "utf8"));
const NOTABLE_ORGS = new Set(NOTABLE.orgs.map((o) => o.toLowerCase()));
const DERIVATIVE_RE = new RegExp(
  `(?:^|[-_/.\\s])(${NOTABLE.derivativePatterns.join("|")})(?:$|[-_/.\\s\\d])`,
  "i",
);

function isNotableOrg(org) {
  const o = (org ?? "").toLowerCase().replace(/^[~@]+/, "");
  if (NOTABLE_ORGS.has(o)) return true;
  for (const known of NOTABLE_ORGS) {
    if (o === known || o.startsWith(`${known}-`) || known.startsWith(`${o}-`)) return true;
  }
  return false;
}

function isNotable(m) {
  if (isNotableOrg(m.org)) return true;
  if (DERIVATIVE_RE.test(`${m.id} ${m.name}`)) return false;
  return (m.likes ?? 0) >= NOTABLE.minLikes || (m.downloads ?? 0) >= NOTABLE.minDownloads;
}

function loadOverlayMatchers() {
  try {
    const overlay = JSON.parse(fs.readFileSync(OVERLAY_PATH, "utf8"));
    return (overlay.overlays ?? []).map((o) => o.match.toLowerCase());
  } catch {
    return [];
  }
}

function matchesOverlay(m, matchers) {
  const id = m.id.toLowerCase();
  return matchers.some((p) =>
    p.endsWith("*") ? id.startsWith(p.slice(0, -1)) : id === p,
  );
}

function loadReferencedModelIds() {
  const ids = new Set();
  for (const file of fs.readdirSync(POSTS_DIR)) {
    // auto posts reference their own model — only editorial posts protect a contact
    if (!file.endsWith(".mdx") || file.startsWith("auto-")) continue;
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const m = /^model:\s*(\S+)\s*$/m.exec(raw);
    if (m) ids.add(m[1].trim());
  }
  return ids;
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
const matchers = loadOverlayMatchers();
const referenced = loadReferencedModelIds();

const keep = [];
const drop = [];
for (const m of registry.models) {
  if (isNotable(m) || referenced.has(m.id) || matchesOverlay(m, matchers)) {
    keep.push(m);
  } else {
    drop.push(m);
  }
}

const next = {
  updatedAt: new Date().toISOString(),
  modelCount: keep.length,
  models: keep,
};

if (!DRY_RUN) {
  fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(next, null, 2)}\n`);
}

// delete auto-posts for dropped models (auto-<slug>.mdx naming convention)
const dropSlugs = new Set(drop.map((m) => m.slug));
let postsRemoved = 0;
if (fs.existsSync(POSTS_DIR)) {
  for (const file of fs.readdirSync(POSTS_DIR)) {
    if (!file.startsWith("auto-") || !file.endsWith(".mdx")) continue;
    const slug = file.slice(5, -4);
    if (dropSlugs.has(slug)) {
      if (!DRY_RUN) fs.unlinkSync(path.join(POSTS_DIR, file));
      postsRemoved += 1;
    }
  }
}

console.log(
  `[prune] kept=${keep.length} dropped=${drop.length} postsRemoved=${postsRemoved}${DRY_RUN ? " (dry run)" : ""}`,
);

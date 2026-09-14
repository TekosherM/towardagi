import config from "@/content/models/notable-orgs.json";
import type { ModelEntry } from "./types";

/**
 * Notability filter — the radar's editorial gate.
 *
 * The registry focuses on notable releases: anything from an allowlisted lab
 * org, or a community model that clears an engagement threshold without being
 * a derivative repack (LoRA, quant, merge). The config lives in
 * content/models/notable-orgs.json and is shared with the discovery and
 * prune scripts.
 */

export interface NotableConfig {
  orgs: string[];
  minLikes: number;
  minDownloads: number;
  derivativePatterns: string[];
}

const CFG = config as NotableConfig;
const ORGS = new Set(CFG.orgs.map((o) => o.toLowerCase()));
const DERIVATIVE_RE = new RegExp(
  `(?:^|[-_/.\\s])(${CFG.derivativePatterns.join("|")})(?:$|[-_/.\\s\\d])`,
  "i",
);

function normalizeOrg(org: string): string {
  return org.toLowerCase().replace(/^[~@]+/, "");
}

export function isDerivativeName(model: Pick<ModelEntry, "name" | "id">): boolean {
  return DERIVATIVE_RE.test(`${model.id} ${model.name}`);
}

export function isNotableOrg(org: string): boolean {
  const o = normalizeOrg(org);
  if (ORGS.has(o)) return true;
  // tolerate suffix variants like "deepseek" vs "deepseek-ai", "meta" vs "meta-llama"
  for (const known of ORGS) {
    if (o === known || o.startsWith(`${known}-`) || known.startsWith(`${o}-`)) return true;
  }
  return false;
}

export function isNotable(model: ModelEntry): boolean {
  if (isNotableOrg(model.org)) return true;
  if (isDerivativeName(model)) return false;
  return (
    (model.likes ?? 0) >= CFG.minLikes || (model.downloads ?? 0) >= CFG.minDownloads
  );
}

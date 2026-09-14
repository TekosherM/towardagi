import type { ModelEntry } from "./types";

/**
 * Capability taxonomy — how we classify what a model is good for.
 *
 * Two groups:
 * - "job"    : task lanes — what you would use the model for
 * - "muscle" : dimensions — how the model performs regardless of task
 *
 * Scores run 0–3:
 *   0 unrated/unsuited · 1 serviceable · 2 strong · 3 best-in-class
 *
 * Scores come from two places: a transparent heuristic that reads registry
 * metadata (name, pipeline, modality, context, tags, size hints) and a
 * curated editorial overlay in content/models/capabilities.json that wins
 * on conflict. Provenance is tracked per model — heuristics are never
 * presented as benchmark truth.
 */

export type CapabilityId =
  | "chat"
  | "vibecoding"
  | "bots"
  | "claw"
  | "spark"
  | "extraction"
  | "mechanics"
  | "reasoning"
  | "prose"
  | "vision"
  | "image"
  | "video"
  | "frontend"
  | "gamedev"
  | "transactions"
  | "latency"
  | "context";

export type CapabilityScore = 0 | 1 | 2 | 3;
export type CapabilityGroup = "job" | "muscle";

export interface CapabilityMeta {
  id: CapabilityId;
  label: string;
  short: string;
  blurb: string;
  group: CapabilityGroup;
}

export const CAPABILITIES: CapabilityMeta[] = [
  // — task lanes —
  { id: "chat", label: "Chat", short: "chat", group: "job", blurb: "General-purpose assistant conversation and Q&A." },
  { id: "vibecoding", label: "Vibecoding", short: "code", group: "job", blurb: "Code generation, completion, and pair-programming." },
  { id: "bots", label: "Bots", short: "bots", group: "job", blurb: "High-volume conversational agents and support bots." },
  { id: "claw", label: "Claw", short: "agent", group: "job", blurb: "Agentic tool use — function calling, browsing, computer use." },
  { id: "spark", label: "Spark", short: "fast", group: "job", blurb: "Small, fast, affordable tiers for everyday workloads." },
  { id: "extraction", label: "Extraction", short: "xtract", group: "job", blurb: "Structured output, document parsing, retrieval work." },
  { id: "prose", label: "Prose", short: "prose", group: "job", blurb: "Long-form writing, editing, and style." },
  { id: "vision", label: "Vision", short: "vis", group: "job", blurb: "Image understanding — reading, describing, reasoning over pixels." },
  { id: "image", label: "Image", short: "img", group: "job", blurb: "Image generation and editing." },
  { id: "video", label: "Video", short: "vid", group: "job", blurb: "Video generation and understanding." },
  { id: "frontend", label: "Frontend", short: "ui", group: "job", blurb: "UI code, design-to-code, and layout work." },
  { id: "gamedev", label: "Gamedev", short: "game", group: "job", blurb: "Game code, procedural content, and systems scripting." },
  { id: "transactions", label: "Transactions", short: "txn", group: "job", blurb: "Real-world tasks — forms, commerce, multi-step execution." },
  // — dimensions —
  { id: "reasoning", label: "Reasoning", short: "rsn", group: "muscle", blurb: "Multi-step inference and deliberative problem solving." },
  { id: "mechanics", label: "Mechanics", short: "mech", group: "muscle", blurb: "Math, STEM, and formal-systems precision." },
  { id: "latency", label: "Latency", short: "lat", group: "muscle", blurb: "Speed class — time-to-first-token and throughput." },
  { id: "context", label: "Context", short: "ctx", group: "muscle", blurb: "Working context-window class." },
];

export const JOB_LANES = CAPABILITIES.filter((c) => c.group === "job");
export const MUSCLE_DIMS = CAPABILITIES.filter((c) => c.group === "muscle");

export function capabilityMeta(id: CapabilityId): CapabilityMeta {
  return CAPABILITIES.find((c) => c.id === id)!;
}

export type Scores = Partial<Record<CapabilityId, CapabilityScore>>;

export interface CapabilityProfile {
  modelId: string;
  scores: Scores;
  provenance: "curated" | "heuristic";
  note?: string;
}

export interface CapabilityOverlayEntry {
  match: string;
  scores: Scores;
  note?: string;
}

export interface CapabilityOverlay {
  updatedAt?: string;
  overlays?: CapabilityOverlayEntry[];
}

// — heuristic classifier —

const FRONTIER_ORGS = new Set([
  "openai",
  "anthropic",
  "google",
  "meta-llama",
  "deepseek-ai",
  "mistralai",
  "x-ai",
  "qwen",
  "moonshotai",
  "zai-org",
  "microsoft",
  "amazon",
  "nvidia",
  "cohere",
  "perplexity-ai",
]);

function paramsB(text: string): number | undefined {
  // matches "7b", "1.5b", "70b", "405b", "a3b", "35b-a3b" style size hints
  const m = /(\d+(?:\.\d+)?)\s*b(?:\b|[-_a-z])/i.exec(text);
  return m ? Number.parseFloat(m[1]) : undefined;
}

export function heuristicScores(model: ModelEntry): Scores {
  const text = [
    model.id,
    model.name,
    model.org,
    model.pipeline,
    model.modality ?? "",
    ...(model.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const size = paramsB(text);
  const frontier = FRONTIER_ORGS.has(model.org.toLowerCase());
  const is = (re: RegExp) => re.test(text);

  const code = is(/cod(e|er|estral|ex)|starcoder|devstral|codellama/);
  const reasoner = is(/\br1\b|\bo[1-9]\b|reason|think|qwq|deliberat/);
  const small =
    is(/flash|mini|nano|tiny|lite|haiku|instant|air\b|spark|edge|micro/) ||
    (size !== undefined && size <= 9) ||
    is(/8bit|4bit|gguf|mlx|quant|bpw/);
  const agentic = is(/agent|tool[-_ ]?use|function[-_ ]?call|computer[-_ ]?use|operator/);
  const writer = is(/writ|prose|story|novel|creative/);
  const mathy = is(/math|stem|physics|sci(-|ence)|formal/);
  const visionName = is(/vision|\bvl\b|visual|pixtral|llava|internvl|image[-_ ]?text/);
  const videoName = is(/video|veo|sora|kling|pika|runway|\bwan\d/);
  const gameName = is(/game|gamedev|unity|unreal|godot/);
  const multimodal =
    model.modality === "multimodal" || model.pipeline.includes("image");
  const genImage =
    model.pipeline === "text-to-image" ||
    is(/text-to-image|image-gen|dall|flux|sdxl|stable-diffusion|imagen/);
  const genVideo =
    model.pipeline === "text-to-video" || is(/text-to-video|video-gen/);
  const instruct = is(/instruct|chat|-it\b|sft|rlhf|assistant/);
  const ctx = model.context ?? 0;

  const s: Scores = {};

  // chat — any instruct/chat model is serviceable; frontier flagships excel
  s.chat = frontier ? 3 : instruct ? 2 : 1;

  // vibecoding — code-specialized models top out; frontier instructs are strong
  s.vibecoding = code ? 3 : frontier && instruct ? 2 : instruct ? 1 : 0;

  // bots — favors tuned models at servable sizes
  s.bots = instruct && small ? 3 : instruct ? 2 : 1;

  // claw — agentic tool use
  s.claw = agentic ? 3 : frontier && instruct ? 2 : instruct ? 1 : 0;

  // spark — small/fast/cheap tier
  s.spark = small ? (size !== undefined && size <= 4 ? 3 : 2) : frontier ? 1 : 0;

  // extraction — structured output work; most tuned models do fine
  s.extraction = frontier && instruct ? 3 : instruct ? 2 : 1;

  // reasoning — dedicated reasoners first
  s.reasoning = reasoner ? 3 : frontier ? 2 : instruct ? 1 : 0;

  // mechanics — math/STEM precision
  s.mechanics = mathy ? 3 : reasoner || code ? 2 : frontier ? 2 : instruct ? 1 : 0;

  // prose — writing quality
  s.prose = writer ? 3 : frontier && instruct ? 2 : instruct ? 1 : 0;

  // vision — image understanding
  s.vision = multimodal || visionName ? (frontier ? 3 : 2) : 0;

  // image — image generation
  s.image = genImage ? 3 : 0;

  // video — video generation/understanding
  s.video = genVideo ? 3 : videoName ? 2 : 0;

  // frontend — UI code: code-capable plus multimodal helps
  s.frontend = code && multimodal ? 3 : code || (frontier && multimodal) ? 2 : code ? 2 : instruct ? 1 : 0;

  // gamedev — mostly code capability with a niche bonus
  s.gamedev = gameName ? 3 : code ? 2 : instruct ? 1 : 0;

  // transactions — agentic execution in the real world
  s.transactions = agentic ? 3 : frontier && instruct ? 2 : instruct ? 1 : 0;

  // latency — derived from size class
  s.latency =
    size !== undefined
      ? size <= 4
        ? 3
        : size <= 13
          ? 2
          : 1
      : small
        ? 2
        : 1;

  // context — window class
  s.context = ctx >= 500_000 ? 3 : ctx >= 128_000 ? 2 : ctx >= 32_000 ? 1 : 0;

  return s;
}

function overlayMatch(entry: CapabilityOverlayEntry, model: ModelEntry): boolean {
  const m = entry.match.toLowerCase();
  if (m.endsWith("*")) {
    const prefix = m.slice(0, -1);
    return (
      model.id.toLowerCase().startsWith(prefix) ||
      model.slug.startsWith(prefix.replace("/", "-"))
    );
  }
  return model.id.toLowerCase() === m || model.slug === m.replace("/", "-");
}

export function profileFor(
  model: ModelEntry,
  overlay?: CapabilityOverlay,
): CapabilityProfile {
  const heur = heuristicScores(model);
  const entry = overlay?.overlays?.find((o) => overlayMatch(o, model));
  if (!entry) {
    return { modelId: model.id, scores: heur, provenance: "heuristic" };
  }
  return {
    modelId: model.id,
    scores: { ...heur, ...entry.scores },
    provenance: "curated",
    note: entry.note,
  };
}

export function rankFor(
  models: ModelEntry[],
  cap: CapabilityId,
  overlay?: CapabilityOverlay,
  limit = 3,
): Array<{ model: ModelEntry; score: CapabilityScore; provenance: string }> {
  return models
    .map((model) => {
      const p = profileFor(model, overlay);
      return { model, score: p.scores[cap] ?? 0, provenance: p.provenance };
    })
    .filter((r) => r.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.provenance === "curated" ? 1 : 0) - (a.provenance === "curated" ? 1 : 0) ||
        (b.model.downloads ?? 0) - (a.model.downloads ?? 0) ||
        (b.model.likes ?? 0) - (a.model.likes ?? 0),
    )
    .slice(0, limit);
}

export const SCORE_DOTS = ["—", "·", "●", "◆"] as const;
export const SCORE_LABELS = ["unrated", "serviceable", "strong", "elite"] as const;

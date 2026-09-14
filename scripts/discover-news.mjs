#!/usr/bin/env node
/**
 * News aggregation script.
 *
 * Fetches from formal AI industry sources and generates a weekly digest.
 * Run on a schedule (e.g., every Monday morning).
 *
 * Usage: node scripts/discover-news.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_DIR = path.join(ROOT, "content", "posts", "news");
const UPCOMING_PATH = path.join(ROOT, "content", "models", "upcoming.json");
const MAX_RADAR_HINTS = 12;

// Formal AI industry sources (RSS feeds)
const SOURCES = [
  { name: "OpenAI Blog", url: "https://openai.com/blog/rss.xml", category: "lab" },
  { name: "Anthropic Blog", url: "https://www.anthropic.com/news/rss.xml", category: "lab" },
  { name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml", category: "lab" },
  { name: "Meta AI", url: "https://ai.meta.com/blog/rss.xml", category: "lab" },
  { name: "Mistral AI", url: "https://mistral.ai/news/rss.xml", category: "lab" },
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", category: "news" },
  { name: "The Verge AI", url: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml", category: "news" },
  { name: "Reuters Technology", url: "https://www.reutersagency.com/feed/?best-sectors=technology&post_type=best", category: "news" },
  { name: "MIT Technology Review AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", category: "news" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", category: "news" },
  // applied / enterprise / government deployment coverage
  { name: "NVIDIA Blog", url: "https://blogs.nvidia.com/feed/", category: "applied" },
  { name: "AWS ML Blog", url: "https://aws.amazon.com/blogs/machine-learning/feed/", category: "applied" },
  { name: "Microsoft Blog", url: "https://blogs.microsoft.com/feed/", category: "applied" },
];

// Keywords for categorization
const FUNDING_KEYWORDS = ["funding", "investment", "series", "raised", "valuation", "venture", "capital", "backed"];
const MA_KEYWORDS = ["acquisition", "acquired", "merger", "merging", "buys", "purchased", "acquires"];
const PRODUCT_KEYWORDS = ["launch", "released", "announces", "unveils", "introduces", "debuts", "ships"];
const RESEARCH_KEYWORDS = ["research", "paper", "study", "breakthrough", "discovers", "finds", "shows"];
const POLICY_KEYWORDS = ["regulation", "regulatory", "policy", "law", "legislation", "compliance", "government", "ban", "safety"];
const APPLIED_KEYWORDS = [
  "deploy", "deployment", "rollout", "rolls out", "enterprise", "customer",
  "hospital", "agency", "city of", "state of", "contract", "production",
  "adoption", "case study", "partners with", "partnership", "pilots",
  "supply chain", "manufacturing", "logistics", "clinical", "government",
];

// Radar hints — feed items that suggest an unreleased model
const UPCOMING_PATTERNS = [
  /(?:will|to|set to|expected to|plans? to|prepar\w+ to)\s+(?:release|launch|unveil|announce|ship|debut|roll out)/i,
  /upcoming|next[- ]gen|teas(?:e|ed|ing)|pre-?announce|leak/i,
];
const MODEL_NAME_RE =
  /\b(gpt-?[\w.]*|claude[\s-]?[\w.]*|gemini[\s-]?[\w.]*|llama[\s-]?[\w.]*|grok[\s-]?[\w.]*|deepseek[\s-]?[\w.]*|qwen[\s-]?[\w.]*|mistral[\s-]?[\w.]*|kimi[\s-]?[\w.]*|glm[\s-]?[\w.]*|o\d\w*)\b/i;

function slugify(input) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function categorizeItem(title, description, sourceCategory) {
  const text = `${title} ${description}`.toLowerCase();
  if (FUNDING_KEYWORDS.some((k) => text.includes(k))) return "funding";
  if (MA_KEYWORDS.some((k) => text.includes(k))) return "ma";
  if (PRODUCT_KEYWORDS.some((k) => text.includes(k))) return "product";
  if (APPLIED_KEYWORDS.some((k) => text.includes(k)) || sourceCategory === "applied")
    return "applied";
  if (RESEARCH_KEYWORDS.some((k) => text.includes(k))) return "research";
  if (POLICY_KEYWORDS.some((k) => text.includes(k))) return "policy";
  return "other";
}

async function fetchFeed(source) {
  try {
    const res = await fetch(source.url, {
      headers: {
        accept: "application/rss+xml, application/xml, text/xml, */*",
        "user-agent": "TowardAGI-NewsBot/1.0",
      },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      console.warn(`[news] ${source.name}: HTTP ${res.status}`);
      return [];
    }
    const text = await res.text();
    return parseRSS(text, source);
  } catch (err) {
    console.warn(`[news] ${source.name}: ${err.message}`);
    return [];
  }
}

function parseRSS(xml, source) {
  const items = [];
  const itemRegex = /<item[\s\S]*?<\/item>/g;
  const matches = xml.match(itemRegex) || [];

  for (const match of matches.slice(0, 20)) {
    const title = match.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim();
    const link = match.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim();
    const description = match.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.trim();
    const pubDate = match.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();

    if (title && link) {
      items.push({
        title: decodeHTMLEntities(title),
        link: link.trim(),
        description: description ? decodeHTMLEntities(stripTags(description)).slice(0, 200) : "",
        pubDate: pubDate ? new Date(pubDate) : new Date(),
        source: source.name,
        category: categorizeItem(title, description || "", source.category),
      });
    }
  }

  return items;
}

function decodeHTMLEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function generateDigest(items) {
  const date = new Date().toISOString().split("T")[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  // Group by category
  const grouped = {
    funding: [],
    ma: [],
    product: [],
    applied: [],
    research: [],
    policy: [],
    other: [],
  };

  for (const item of items) {
    grouped[item.category].push(item);
  }

  const sections = [];

  if (grouped.funding.length > 0) {
    sections.push({ title: "Funding & Investment", items: grouped.funding });
  }
  if (grouped.ma.length > 0) {
    sections.push({ title: "M&A Activity", items: grouped.ma });
  }
  if (grouped.product.length > 0) {
    sections.push({ title: "Product Launches", items: grouped.product });
  }
  if (grouped.applied.length > 0) {
    sections.push({ title: "Applied AI & Deployments", items: grouped.applied });
  }
  if (grouped.research.length > 0) {
    sections.push({ title: "Research Highlights", items: grouped.research });
  }
  if (grouped.policy.length > 0) {
    sections.push({ title: "Policy & Regulation", items: grouped.policy });
  }
  if (grouped.other.length > 0) {
    sections.push({ title: "Other News", items: grouped.other });
  }

  let mdx = `---\ntitle: "AI Industry Digest \u2014 Week of ${weekStartStr}"\ndescription: "A curated roundup of the most important AI industry developments, funding, product launches, and research from the past week."\ncategory: news\ndate: ${date}\nauto: true\ntags: [digest, weekly, industry]\n---\n\n`;
  mdx += `**Week of ${weekStartStr} to ${date}**\n\n`;
  mdx += `This digest covers ${items.length} stories from ${SOURCES.length} sources.\n\n`;

  for (const section of sections) {
    mdx += `## ${section.title}\n\n`;
    for (const item of section.items.slice(0, 5)) {
      mdx += `- **[${item.title}](${item.link})** \u2014 ${item.source}`;
      if (item.description) {
        mdx += ` \u2014 ${item.description}`;
      }
      mdx += `\n`;
    }
    mdx += `\n`;
  }

  mdx += `---\n\n`;
  mdx += `<Callout type="signal" title="About this digest">\n`;
  mdx += `This digest is automatically generated from formal industry sources. `;
  mdx += `For deeper analysis, check our [editorial coverage](/category/news).\n`;
  mdx += `</Callout>\n`;

  return mdx;
}

// Extract "upcoming model" radar hints from feed items and merge them into
// content/models/upcoming.json. Hints are lowest-confidence signals — they
// never overwrite curated entries and are deduplicated by id.
function extractRadarHints(items) {
  const hints = [];
  for (const item of items) {
    const text = `${item.title} ${item.description}`;
    if (!UPCOMING_PATTERNS.some((p) => p.test(text))) continue;
    const name = MODEL_NAME_RE.exec(text)?.[0];
    if (!name) continue;
    hints.push({
      id: `radar-${slugify(item.title).slice(0, 48)}`,
      name: name.replace(/\s+/g, "-"),
      org: item.source,
      expectedWindow: "unscheduled signal",
      confidence: "signal",
      source: "radar",
      note: `Radar hint from ${item.source}: "${item.title}"`,
      url: item.link,
      addedAt: new Date().toISOString(),
    });
  }
  return hints;
}

function mergeRadarHints(hints) {
  let feed;
  try {
    feed = JSON.parse(fs.readFileSync(UPCOMING_PATH, "utf8"));
  } catch {
    feed = { updatedAt: new Date().toISOString(), entries: [] };
  }
  const entries = Array.isArray(feed.entries) ? feed.entries : [];
  const seen = new Set(entries.map((e) => e.id));

  let added = 0;
  for (const hint of hints) {
    if (seen.has(hint.id)) continue;
    seen.add(hint.id);
    entries.push(hint);
    added += 1;
  }

  // keep curated entries plus the newest radar hints
  const curated = entries.filter((e) => e.source !== "radar");
  const radar = entries
    .filter((e) => e.source === "radar")
    .sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt))
    .slice(0, MAX_RADAR_HINTS);

  fs.mkdirSync(path.dirname(UPCOMING_PATH), { recursive: true });
  fs.writeFileSync(
    UPCOMING_PATH,
    `${JSON.stringify({ updatedAt: new Date().toISOString(), entries: [...curated, ...radar] }, null, 2)}\n`,
  );
  return added;
}

async function main() {
  console.log(`[news] Fetching from ${SOURCES.length} sources...`);

  const results = await Promise.all(SOURCES.map((s) => fetchFeed(s)));

  // Flatten and deduplicate by title similarity
  const allItems = results.flat();
  const seen = new Set();
  const uniqueItems = [];

  for (const item of allItems) {
    const key = slugify(item.title).slice(0, 50);
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueItems.push(item);
  }

  // Sort by date, newest first
  uniqueItems.sort((a, b) => b.pubDate - a.pubDate);

  // Take top 30 items
  const topItems = uniqueItems.slice(0, 30);

  console.log(`[news] Found ${uniqueItems.length} unique items, using ${topItems.length}`);

  // Merge upcoming-model radar hints into the watchlist
  const hints = extractRadarHints(uniqueItems);
  const hintsAdded = mergeRadarHints(hints);
  console.log(`[news] radar hints: ${hints.length} found, ${hintsAdded} new`);

  if (topItems.length === 0) {
    console.log("[news] No items found, skipping digest generation");
    return;
  }

  // Generate digest
  const digest = generateDigest(topItems);
  const filename = `auto-weekly-digest-${new Date().toISOString().split("T")[0]}.mdx`;
  const filepath = path.join(NEWS_DIR, filename);

  fs.mkdirSync(NEWS_DIR, { recursive: true });
  fs.writeFileSync(filepath, digest);

  console.log(`[news] Generated digest: ${filename}`);
}

main().catch((err) => {
  console.error("[news] Fatal error:", err);
  process.exit(1);
});

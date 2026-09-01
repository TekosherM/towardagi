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
];

// Keywords for categorization
const FUNDING_KEYWORDS = ["funding", "investment", "series", "raised", "valuation", "venture", "capital", "backed"];
const MA_KEYWORDS = ["acquisition", "acquired", "merger", "merging", "buys", "purchased", "acquires"];
const PRODUCT_KEYWORDS = ["launch", "released", "announces", "unveils", "introduces", "debuts", "ships"];
const RESEARCH_KEYWORDS = ["research", "paper", "study", "breakthrough", "discovers", "finds", "shows"];
const POLICY_KEYWORDS = ["regulation", "regulatory", "policy", "law", "legislation", "compliance", "government", "ban", "safety"];

function slugify(input) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function categorizeItem(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (FUNDING_KEYWORDS.some((k) => text.includes(k))) return "funding";
  if (MA_KEYWORDS.some((k) => text.includes(k))) return "ma";
  if (PRODUCT_KEYWORDS.some((k) => text.includes(k))) return "product";
  if (RESEARCH_KEYWORDS.some((k) => text.includes(k))) return "research";
  if (POLICY_KEYWORDS.some((k) => text.includes(k))) return "policy";
  return "other";
}

async function fetchFeed(url, label) {
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/rss+xml, application/xml, text/xml, */*",
        "user-agent": "TowardAGI-NewsBot/1.0",
      },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      console.warn(`[news] ${label}: HTTP ${res.status}`);
      return [];
    }
    const text = await res.text();
    return parseRSS(text, label);
  } catch (err) {
    console.warn(`[news] ${label}: ${err.message}`);
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
        source,
        category: categorizeItem(title, description || ""),
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

async function main() {
  console.log(`[news] Fetching from ${SOURCES.length} sources...`);

  const results = await Promise.all(
    SOURCES.map((s) => fetchFeed(s.url, s.name)),
  );

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

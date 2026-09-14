import type { Category } from "./types";

export interface CategoryMeta {
  slug: Category;
  route: string;
  label: string;
  plural: string;
  glyph: string;
  color: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "news",
    route: "news",
    label: "News",
    plural: "News",
    glyph: "◉",
    color: "#ffb454",
    description:
      "Fast, factual reporting from the frontier — funding rounds, lab moves, policy shifts, and everything that moved the needle this week.",
  },
  {
    slug: "model-release",
    route: "model-releases",
    label: "Model Release",
    plural: "Model Releases",
    glyph: "▲",
    color: "#35f0d0",
    description:
      "First looks at new models, captured by our radar within hours of release. What shipped, what it claims, and what actually matters.",
  },
  {
    slug: "trends",
    route: "trends",
    label: "Trends",
    plural: "Trends",
    glyph: "◆",
    color: "#9d8cff",
    description:
      "Pattern recognition at scale — where the field is heading, who is converging on what, and which bets are compounding.",
  },
  {
    slug: "education",
    route: "education",
    label: "Education",
    plural: "Education",
    glyph: "✦",
    color: "#6bc7ff",
    description:
      "Concepts explained properly. From attention to RLHF to eval design — written to be understood, not to impress.",
  },
  {
    slug: "deep-dive",
    route: "deep-dives",
    label: "Deep Dive",
    plural: "Deep Dives",
    glyph: "▣",
    color: "#ff6b8b",
    description:
      "Long-form technical investigations. We take one idea apart, bolt by bolt, and put it back together in front of you.",
  },
  {
    slug: "applied",
    route: "applied",
    label: "Applied",
    plural: "Applied AI",
    glyph: "⬡",
    color: "#7ce38b",
    description:
      "AI in production — deployments by corporations, institutions, and governments, plus novel applications solving real-world problems.",
  },
];

export function categoryMeta(slug: Category): CategoryMeta {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}

export function categoryByRoute(route: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.route === route);
}

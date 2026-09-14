# Toward AGI

> Dispatches from the road to AGI — news, deep dives, and a live model radar.

An independent AI publication covering the systems, labs, and ideas on the road to artificial general intelligence. Built with Next.js, React, and TypeScript.

## Features

- **Long-form articles** — News, deep dives, trends, education, applied AI, and model releases in MDX
- **Model Radar** — Automated sweep of Hugging Face and OpenRouter every 6 hours
- **Last-30-days report** — Every model introduced in the past month, derived from the registry
- **Capability catalog** — Task-type catalog (chat, vibecoding, bots, agentic "claw", fast "spark" tier, extraction, reasoning, prose, vision, image, video, frontend, gamedev, transactions) plus latency and context dimensions
- **Upcoming watchlist** — Curated entries plus automated radar hints extracted from news feeds
- **Applied AI channel** — Corporate, institutional, and government deployments; AI solving real-world problems
- **Generative cover art** — Deterministic SVG artwork seeded by post slug
- **3D hero scene** — Interactive neural network visualization with Three.js
- **RSS feed** — Full-content RSS at `/feed.xml`
- **Responsive design** — Mobile-first, accessible, dark theme
- **Open publication** — Write in MDX, ship via PR

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm dev

# Build for production
npm run build

# Start production server
npm start
```

## Content

Posts are MDX files in `content/posts/` organized by category:

```
content/
├── posts/
│   ├── news/
│   ├── model-releases/   # includes auto-* radar contact posts
│   ├── trends/
│   ├── education/
│   ├── deep-dives/
│   └── applied/          # corporate / institutional / government deployments
├── authors/
└── models/
    ├── registry.json      # radar-discovered models (auto-committed)
    ├── capabilities.json  # curated capability overlay (editorial)
    └── upcoming.json      # upcoming-model watchlist (curated + radar hints)
```

### Writing a post

Every post is a `.mdx` file with YAML frontmatter:

```mdx
---
title: "Your headline"
description: "One or two sentences that hook the reader."
category: deep-dive
date: 2026-08-27
authors: [your-slug]
tags: [scaling, evals]
featured: false
model: openai/gpt-5
---

## Opening section

Your prose here.
```

Categories: `news`, `model-release`, `trends`, `education`, `deep-dive`, `applied`.

## Model Radar

The radar sweeps Hugging Face and OpenRouter for new text-generation models:

```bash
# Run discovery manually
npm run discover        # models
npm run discover:news   # news digest + radar hints
npm run discover:all    # both
```

A GitHub Actions workflow runs the model sweep every 6 hours and the news
aggregation every Monday at 8 AM (both on `workflow_dispatch` too), committing
results back to the repo:

- New models → `content/models/registry.json` + auto-published contact posts in `content/posts/model-releases/`
- Weekly digest → `content/posts/news/auto-weekly-digest-*.mdx`
- Upcoming-model signals → appended to `content/models/upcoming.json` as `source: "radar"`, `confidence: "signal"`

## Capability catalog

`/models` maps every registry contact to a capability taxonomy: task lanes
(chat, vibecoding, bots, claw/agentic, spark/fast-cheap, extraction, prose,
vision, image, video, frontend, gamedev, transactions) and dimensions
(reasoning, mechanics, latency, context).

Scores run 0–3 and come from two sources:

1. **Heuristic** — `lib/capabilities.ts` infers scores from model metadata
   (name, pipeline, modality, context size, parameter-size hints, org).
   Labeled as heuristic in the UI; never presented as benchmark truth.
2. **Curated** — `content/models/capabilities.json` overlays editorial scores
   for notable models (exact id or `prefix*` match). Curated scores win and are
   marked `ed` in the UI.

### Upcoming watchlist

`content/models/upcoming.json` holds two kinds of entries:

- `source: "curated"` — editor-maintained entries with `confidence:
  confirmed | reported | rumored | signal`
- `source: "radar"` — auto-appended by `discover-news.mjs` when feeds mention
  unreleased models; always `confidence: "signal"` and capped at 12 entries

## Deployment

The site deploys on Vercel via the GitHub integration: push to `master`
triggers a production build. No environment variables are required — all
content is file-based and baked at build time.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Server Components)
- **Styling:** Tailwind CSS 4
- **3D:** Three.js + React Three Fiber
- **Animation:** GSAP + ScrollTrigger
- **Content:** MDX with gray-matter
- **Language:** TypeScript

## Contributing

Toward AGI is an open publication. Researchers, engineers, and close observers of the field are invited to publish.

1. Pitch: Open an issue with your idea
2. Write: Accepted pitches get a file in `content/posts/`
3. Ship: Open a pull request; an editor reviews and merges

See `/contribute` on the live site for the full guide.

## License

Content is © Toward AGI. Code is MIT.

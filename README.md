# Toward AGI

> Dispatches from the road to AGI — news, deep dives, and a live model radar.

An independent AI publication covering the systems, labs, and ideas on the road to artificial general intelligence. Built with Next.js, React, and TypeScript.

## Features

- **Long-form articles** — News, deep dives, trends, education, and model releases in MDX
- **Model Radar** — Automated sweep of Hugging Face and OpenRouter every 6 hours
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
│   ├── model-releases/
│   ├── trends/
│   ├── education/
│   └── deep-dives/
├── authors/
└── models/
    └── registry.json
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

## Model Radar

The radar sweeps Hugging Face and OpenRouter for new text-generation models:

```bash
# Run discovery manually
npm run discover
```

A GitHub Actions workflow runs this every 6 hours and commits new entries to `content/models/registry.json`.

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

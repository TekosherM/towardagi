import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Education Hub",
  description: "Learn about AI: model types, market actors, pricing, and how to choose the right tool for your task.",
};

const SECTIONS = [
  {
    title: "AI Model Types",
    description: "Understand the different types of AI models: LLMs, VLMs, embeddings, reranking, and more.",
    links: [
      { href: "/articles/what-is-mixture-of-experts", label: "What Is Mixture of Experts?" },
    ],
  },
  {
    title: "Market Landscape",
    description: "Who builds AI? Frontier labs, open-weights labs, aggregators, and infrastructure providers.",
    links: [
      { href: "/players", label: "Market Players Directory" },
      { href: "/category/trends", label: "Industry Trends" },
    ],
  },
  {
    title: "Pricing & Economics",
    description: "Compare API pricing across providers and understand the economics of AI deployment.",
    links: [
      { href: "/pricing", label: "API Pricing Comparison" },
      { href: "/articles/inference-cost-is-the-new-benchmark", label: "Inference Cost Analysis" },
    ],
  },
  {
    title: "Choosing the Right Tool",
    description: "Find the best AI app or service for your specific task or workflow.",
    links: [
      { href: "/apps", label: "AI Apps Directory" },
      { href: "/search", label: "Search All Content" },
    ],
  },
  {
    title: "Model Radar",
    description: "Track every new model release, automatically detected within hours.",
    links: [
      { href: "/models", label: "Model Radar" },
      { href: "/category/model-releases", label: "Model Release Coverage" },
    ],
  },
];

export default function EducationPage() {
  return (
    <div className="pt-16">
      <PageHeader
        kicker="// learn"
        title="Education Hub"
        description="Everything you need to understand the AI landscape: models, markets, pricing, and tools."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="flex flex-col border border-line bg-panel p-6"
            >
              <h2 className="display text-lg text-bone">{section.title}</h2>
              <p className="mt-2 text-sm text-fog">{section.description}</p>
              <div className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block font-mono text-xs tracking-[0.16em] uppercase text-signal hover:underline"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

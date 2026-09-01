import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { getPricing, getPricingUpdatedAt, formatPrice, formatContext } from "@/lib/pricing";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "API Pricing Comparison",
  description: "Compare API pricing across major AI providers. Input and output token costs, context windows, and free tiers.",
};

export default function PricingPage() {
  const providers = getPricing();
  const updatedAt = getPricingUpdatedAt();

  return (
    <div className="pt-16">
      <PageHeader
        kicker="// cost comparison"
        title="API Pricing"
        description="Compare token-based pricing across major AI providers. All prices in USD per 1M tokens."
        meta={
          <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-dim">
            Last updated: {timeAgo(updatedAt)}
          </p>
        }
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="space-y-12">
          {providers.map((provider) => (
            <div key={provider.slug}>
              <h2 className="display text-xl text-bone mb-4">{provider.name}</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="py-3 pr-6 text-left font-mono text-[0.68rem] tracking-[0.16em] uppercase text-dim">Model</th>
                      <th className="py-3 pr-6 text-right font-mono text-[0.68rem] tracking-[0.16em] uppercase text-dim">Input</th>
                      <th className="py-3 pr-6 text-right font-mono text-[0.68rem] tracking-[0.16em] uppercase text-dim">Output</th>
                      <th className="py-3 text-right font-mono text-[0.68rem] tracking-[0.16em] uppercase text-dim">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provider.models.map((model) => (
                      <tr key={model.name} className="border-b border-line/60">
                        <td className="py-3 pr-6 text-sm text-bone">{model.name}</td>
                        <td className="py-3 pr-6 text-right text-sm text-fog">
                          {model.input === 0 ? "Free" : formatPrice(model.input)}
                        </td>
                        <td className="py-3 pr-6 text-right text-sm text-fog">
                          {model.output === 0 ? "Free" : formatPrice(model.output)}
                        </td>
                        <td className="py-3 text-right text-sm text-fog">
                          {formatContext(model.context)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border border-line bg-panel p-6">
          <p className="kicker mb-4">// notes</p>
          <ul className="space-y-2 text-sm text-fog">
            <li>• Prices are in USD per 1 million tokens unless otherwise noted.</li>
            <li>• Input tokens are typically cheaper than output tokens.</li>
            <li>• Open-weights models (Meta, Mistral, Qwen, DeepSeek) can be self-hosted for free.</li>
            <li>• Prices may change frequently. Always verify with the provider.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

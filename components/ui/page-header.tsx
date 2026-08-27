import type { ReactNode } from "react";
import { Reveal } from "@/components/fx/reveal";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  accent?: string;
  meta?: ReactNode;
  className?: string;
}

export function PageHeader({ kicker, title, description, accent = "#35f0d0", meta, className }: PageHeaderProps) {
  return (
    <header className={cn("relative overflow-hidden border-b border-line", className)}>
      <div className="pointer-events-none absolute inset-0 grid-bg grid-fade opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full opacity-[0.09] blur-3xl"
        style={{ background: accent }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8">
        <Reveal>
          <p className="kicker mb-5 flex items-center gap-3" style={{ color: accent }}>
            <span className="inline-block h-px w-10" style={{ background: accent }} aria-hidden />
            {kicker}
          </p>
          <h1 className="display max-w-3xl text-4xl leading-[1.05] text-bone sm:text-6xl">{title}</h1>
          {description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog">{description}</p>
          )}
          {meta && <div className="mt-8">{meta}</div>}
        </Reveal>
      </div>
    </header>
  );
}

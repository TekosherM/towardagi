import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Terminal({ title, children, className }: TerminalProps) {
  return (
    <div className={cn("overflow-hidden border border-line bg-abyss", className)}>
      <div className="flex items-center gap-2 border-b border-line bg-panel px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
        <span className="ml-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-dim">
          {title}
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.18em] uppercase text-signal">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" />
          live
        </span>
      </div>
      <div className="p-5 font-mono text-[0.8rem] leading-relaxed">{children}</div>
    </div>
  );
}

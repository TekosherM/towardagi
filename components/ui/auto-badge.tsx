export function AutoBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.16em] uppercase text-amber ${className ?? ""}`}
    >
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-amber" aria-hidden />
      auto
    </span>
  );
}

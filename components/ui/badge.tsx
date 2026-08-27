import type { Category } from "@/lib/types";
import { categoryMeta } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const meta = categoryMeta(category);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.18em] uppercase",
        className,
      )}
      style={{
        color: meta.color,
        borderColor: `${meta.color}44`,
        background: `${meta.color}0d`,
      }}
    >
      <span aria-hidden>{meta.glyph}</span>
      {meta.label}
    </span>
  );
}

export function Pill({
  children,
  color = "#97a1af",
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.16em] uppercase",
        className,
      )}
      style={{ color, borderColor: `${color}3a`, background: `${color}0a` }}
    >
      {children}
    </span>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}

export function Marquee({ children, className, reverse }: MarqueeProps) {
  return (
    <div className={cn("marquee-group marquee-mask overflow-hidden", className)}>
      <div
        className={cn(
          "marquee-track flex w-max items-center animate-marquee",
          reverse && "[animation-direction:reverse]",
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

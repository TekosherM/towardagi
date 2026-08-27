import Link from "next/link";
import { Reveal } from "@/components/fx/reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker: string;
  title: string;
  action?: { href: string; label: string };
  className?: string;
}

export function SectionHeading({ kicker, title, action, className }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className={cn("mb-10 flex items-end justify-between gap-6", className)}>
        <div>
          <p className="kicker mb-3">{kicker}</p>
          <h2 className="display text-3xl text-bone sm:text-4xl">{title}</h2>
        </div>
        {action && (
          <Link
            href={action.href}
            className="group hidden shrink-0 items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase text-fog transition-colors hover:text-signal sm:inline-flex"
          >
            {action.label}
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </Link>
        )}
      </div>
    </Reveal>
  );
}

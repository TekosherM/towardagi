"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/news", label: "News" },
  { href: "/models", label: "Model Radar" },
  { href: "/category/trends", label: "Trends" },
  { href: "/category/education", label: "Education" },
  { href: "/category/deep-dives", label: "Deep Dives" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-line" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Toward AGI — home">
          <span className="relative flex h-7 w-7 items-center justify-center border border-signal/50">
            <span className="h-2 w-2 animate-pulse-dot bg-signal" />
          </span>
          <span className="display text-[0.95rem] tracking-tight text-bone">
            TOWARD<span className="text-signal">//</span>AGI
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href.startsWith("/category") && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-[0.7rem] tracking-[0.18em] uppercase transition-colors",
                  active ? "text-signal" : "text-fog hover:text-bone",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contribute"
            className="hidden border border-signal/60 px-4 py-2 font-mono text-[0.68rem] tracking-[0.18em] uppercase text-signal transition-all hover:bg-signal hover:text-void sm:inline-block"
          >
            Write for us
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 border border-line lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                "h-px w-4 bg-bone transition-transform",
                open && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-4 bg-bone transition-transform",
                open && "-translate-y-[3.5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="glass border-b border-line px-5 pb-6 pt-2 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {[...LINKS, { href: "/contribute", label: "Write for us" }].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block py-2.5 font-mono text-sm tracking-[0.14em] uppercase",
                    pathname === link.href ? "text-signal" : "text-fog",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        el.style.transform = `scaleX(${p})`;
        setPercent(Math.round(p * 100));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent" aria-hidden>
      <div ref={ref} className="h-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
      {percent > 5 && percent < 100 && (
        <span className="absolute right-4 top-2 font-mono text-[0.6rem] tracking-[0.1em] text-dim">
          {percent}%
        </span>
      )}
    </div>
  );
}

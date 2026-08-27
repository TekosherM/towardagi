"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@01";

interface ScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function Scramble({ text, className, delay = 0, duration }: ScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }

    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let started = false;
    const dur = duration ?? 600 + text.length * 38;

    const run = (now: number, start: { v: number }) => {
      if (!start.v) start.v = now;
      const p = Math.min(1, (now - start.v) / dur);
      const reveal = Math.floor(p * text.length);
      let out = text.slice(0, reveal);
      for (let i = reveal; i < text.length; i++) {
        const c = text[i];
        out += c === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      if (p < 1) raf = requestAnimationFrame((n) => run(n, start));
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          io.disconnect();
          timer = setTimeout(() => raf = requestAnimationFrame((n) => run(n, { v: 0 })), delay);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}

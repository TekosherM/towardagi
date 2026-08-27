"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
  blur?: boolean;
}

export function Reveal({
  children,
  className,
  y = 30,
  delay = 0,
  duration = 0.9,
  blur = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      el,
      { y, opacity: 0, filter: blur ? "blur(8px)" : "none" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, delay, duration, blur]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  selector?: string;
  amount?: number;
  y?: number;
}

export function Stagger({ children, className, selector = ":scope > *", amount = 0.09, y = 26 }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = el.querySelectorAll(selector);
    const tween = gsap.fromTo(
      targets,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: amount,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [selector, amount, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NeuralField = dynamic(() => import("@/components/three/neural-field"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 grid-bg grid-fade" />,
});

export default function HeroScene() {
  const [mode, setMode] = useState<"pending" | "full" | "static">("pending");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(reduced ? "static" : "full");
  }, []);

  if (mode === "static") {
    return <div className="absolute inset-0 grid-bg grid-fade" aria-hidden />;
  }
  return <NeuralField />;
}

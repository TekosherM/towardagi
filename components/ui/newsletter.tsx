"use client";

import { useState } from "react";

export function Newsletter({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    // Replace with your newsletter provider (Buttondown, ConvertKit, etc.)
    // This is a placeholder that simulates a successful submission
    try {
      // Example: await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) })
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setMessage("You're in. Check your inbox to confirm.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={className}>
      <div className="border border-line bg-panel p-6 sm:p-8">
        <p className="kicker mb-3">// the signal</p>
        <h2 className="display text-xl text-bone sm:text-2xl">
          One email. The week's sharpest AI analysis.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Every Friday: the dispatches that mattered, the models that shipped, and the
          one chart you need to see. No spam, no filler — unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="you@email.com"
              className="flex-1 border border-line bg-void px-4 py-3 font-mono text-sm text-bone placeholder:text-dim focus:border-signal/60 focus:outline-none"
              disabled={status === "loading"}
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 bg-signal px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase text-void transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {status === "loading" ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Joining...
                </>
              ) : (
                <>Subscribe</>
              )}
            </button>
          </div>
        </form>

        {message && (
          <p
            className={`mt-4 font-mono text-xs tracking-[0.12em] ${
              status === "success" ? "text-signal" : status === "error" ? "text-rose" : "text-dim"
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <p className="mt-4 font-mono text-[0.6rem] tracking-[0.16em] uppercase text-dim">
          Join 2,400+ researchers and engineers. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

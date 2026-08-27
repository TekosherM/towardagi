import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="pointer-events-none absolute inset-0 grid-bg grid-fade" aria-hidden />
      <p className="kicker mb-6">// signal lost</p>
      <p className="display text-[clamp(4rem,16vw,11rem)] leading-none text-bone">
        4<span className="text-signal glow-signal">0</span>4
      </p>
      <p className="mt-6 max-w-md leading-relaxed text-fog">
        This frequency is not broadcasting. The page moved, or it never existed —
        either way, the radar can get you back.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="bg-signal px-6 py-3.5 font-mono text-xs tracking-[0.18em] uppercase text-void transition-transform hover:-translate-y-0.5"
        >
          Return home
        </Link>
        <Link
          href="/news"
          className="border border-line px-6 py-3.5 font-mono text-xs tracking-[0.18em] uppercase text-bone transition-colors hover:border-signal/60 hover:text-signal"
        >
          All dispatches
        </Link>
      </div>
      <p className="mt-14 font-mono text-[0.62rem] tracking-[0.3em] uppercase text-dim">
        <span className="inline-block h-3 w-1.5 animate-blink bg-signal align-middle" aria-hidden />{" "}
        scanning for signal…
      </p>
    </div>
  );
}

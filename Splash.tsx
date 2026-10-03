import { useEffect, useState } from "react";

const LETTERS = "SUNNAH".split("");
const BEADS = 12;

/** First-visit intro: a mosque dome draws itself, a tasbih of beads wraps around it, then the wordmark rises. */
export function Splash() {
  const [phase, setPhase] = useState<"show" | "leave" | "gone">(() => (typeof window !== "undefined" && (window as any).__bootLoader ? "gone" : "show"));

  useEffect(() => {
    try {
      if (sessionStorage.getItem("sunnah-splash") === "1") { setPhase("gone"); return; }
      sessionStorage.setItem("sunnah-splash", "1");
    } catch { /* storage unavailable: just show it */ }
    const quick = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = setTimeout(() => setPhase("leave"), quick ? 600 : 3000);
    const t2 = setTimeout(() => setPhase("gone"), quick ? 1100 : 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "gone") return null;

  const beads = Array.from({ length: BEADS }, (_, i) => {
    const a = (Math.PI * (200 + (140 * i) / (BEADS - 1))) / 180; // arc over the dome, left to right
    return { x: 100 + 82 * Math.cos(a), y: 128 + 82 * Math.sin(a), i };
  });

  return (
    <div
      role="status"
      aria-label="Loading Sunnah & Co."
      onClick={() => { setPhase("leave"); setTimeout(() => setPhase("gone"), 700); }}
      className={`fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-foreground text-background transition-all duration-700 ease-in-out ${phase === "leave" ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <div className="pattern-bg pointer-events-none absolute inset-0 opacity-20" />
      <svg viewBox="0 0 200 200" className="relative h-52 w-52 sm:h-64 sm:w-64" aria-hidden="true">
        {beads.map(({ x, y, i }) => (
          <circle key={i} cx={x} cy={y} r="4.4" className="sc-pop fill-primary stroke-gold" strokeWidth="1.2" style={{ animationDelay: `${0.5 + i * 0.09}s` }} />
        ))}
        <line x1="100" y1="46" x2="100" y2="40" className="sc-pop stroke-gold" strokeWidth="1.2" style={{ animationDelay: "1.6s" }} />
        <path d="M58 150 C52 104 84 82 100 56 C116 82 148 104 142 150 Z" className="sc-fill fill-primary" />
        <path d="M58 150 C52 104 84 82 100 56 C116 82 148 104 142 150 Z" className="sc-draw fill-none stroke-gold" strokeWidth="2" strokeLinejoin="round" />
        <path d="M100 56 L100 44" className="sc-draw fill-none stroke-gold" strokeWidth="2" style={{ animationDelay: "1.1s" }} />
        <path d="M95 36 A6 6 0 1 0 102 36 A4.6 4.6 0 1 1 95 36 Z" className="sc-pop fill-gold" style={{ animationDelay: "1.5s" }} />
        <path d="M50 150 H150" className="sc-draw fill-none stroke-gold" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "0.2s" }} />
        <path d="M88 150 V132 A12 12 0 0 1 112 132 V150" className="sc-draw fill-none stroke-gold/70" strokeWidth="1.4" style={{ animationDelay: "0.9s" }} />
        <circle cx={beads[BEADS - 1]!.x} cy={beads[BEADS - 1]!.y + 10} r="2.6" className="sc-pop fill-gold" style={{ animationDelay: "1.75s" }} />
      </svg>
      <div className="relative -mt-2 flex items-baseline gap-[0.18em] font-display text-4xl font-semibold tracking-[0.18em] sm:text-5xl">
        {LETTERS.map((l, i) => (
          <span key={i} className="sc-rise" style={{ animationDelay: `${1.5 + i * 0.07}s` }}>{l}</span>
        ))}
        <span className="sc-rise ml-3 text-gold" style={{ animationDelay: "2s" }}>&amp; CO.</span>
      </div>
      <p className="sc-rise relative mt-3 text-xs uppercase tracking-[0.4em] text-background/60" style={{ animationDelay: "2.2s" }}>Live the Sunnah</p>
      <div className="relative mt-8 h-px w-40 overflow-hidden bg-background/15">
        <div className="sc-bar h-full bg-gold" />
      </div>
    </div>
  );
}

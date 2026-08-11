import type { StoryChapter } from "./chapters";

/** Tiny visual metaphor — never denser than the headline. */
export function StoryMotif({
  motif,
  active,
}: {
  motif?: StoryChapter["motif"];
  active: boolean;
}) {
  if (!motif || motif === "hearth" || motif === "cta") return null;

  const base =
    "mx-auto mb-10 flex h-16 w-16 items-center justify-center transition-all duration-700 md:mb-12 md:h-20 md:w-20";

  if (motif === "noise") {
    return (
      <div
        className={`${base} gap-1.5`}
        style={{ opacity: active ? 0.55 : 0, transform: active ? "scale(1)" : "scale(0.9)" }}
        aria-hidden
      >
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className="block w-1 rounded-full bg-[var(--story-ink-dim)]"
            style={{
              height: `${28 + ((n * 17) % 36)}%`,
              animation: active ? `story-jitter 1.${n + 2}s ease-in-out infinite` : "none",
              animationDelay: `${n * 0.12}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (motif === "hold") {
    return (
      <div
        className={base}
        style={{ opacity: active ? 0.7 : 0, transform: active ? "scale(1)" : "scale(0.85)" }}
        aria-hidden
      >
        <div className="relative h-14 w-14 rounded-full border border-[rgba(255,163,43,0.35)] md:h-16 md:w-16">
          <div className="absolute inset-3 rounded-full bg-[rgba(255,163,43,0.12)]" />
          <div className="absolute inset-[38%] rounded-full bg-[#FFA32B]/70 blur-[2px]" />
        </div>
      </div>
    );
  }

  if (motif === "protocol") {
    return (
      <div
        className={`${base} flex-col gap-2`}
        style={{ opacity: active ? 0.75 : 0 }}
        aria-hidden
      >
        {[0, 1, 2].map((n) => (
          <div
            key={n}
            className="h-1.5 rounded-full bg-[rgba(255,163,43,0.45)] transition-all duration-700"
            style={{
              width: active ? `${48 + n * 18}px` : "12px",
              transitionDelay: `${n * 90}ms`,
            }}
          />
        ))}
      </div>
    );
  }

  if (motif === "plan") {
    return (
      <div
        className={base}
        style={{ opacity: active ? 0.7 : 0 }}
        aria-hidden
      >
        <svg viewBox="0 0 64 64" className="h-14 w-14 text-[#FFA32B] md:h-16 md:w-16">
          <path
            d="M12 44 L28 28 L40 36 L52 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
            style={{
              strokeDasharray: 80,
              strokeDashoffset: active ? 0 : 80,
              transition: "stroke-dashoffset 900ms ease",
            }}
          />
          <circle cx="52" cy="16" r="3.5" fill="currentColor" opacity={active ? 0.9 : 0} />
        </svg>
      </div>
    );
  }

  if (motif === "memory") {
    return (
      <div
        className={base}
        style={{ opacity: active ? 0.65 : 0 }}
        aria-hidden
      >
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.12)]" />
          <div
            className="absolute inset-2 rounded-full border border-[rgba(255,163,43,0.35)] transition-transform duration-700"
            style={{ transform: active ? "rotate(25deg)" : "rotate(0deg)" }}
          />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFA32B]" />
        </div>
      </div>
    );
  }

  if (motif === "honest") {
    return (
      <div
        className={`${base} font-mono text-[10px] uppercase tracking-[0.35em] text-[rgba(255,163,43,0.7)]`}
        style={{ opacity: active ? 0.8 : 0 }}
        aria-hidden
      >
        why?
      </div>
    );
  }

  return null;
}

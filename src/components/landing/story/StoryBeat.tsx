import { useEffect, useRef, useState, type ReactNode } from "react";
import type { StoryChapter } from "./chapters";
import { StoryMotif } from "./StoryMotif";

type Props = {
  chapter: StoryChapter;
  index: number;
  onActive: (index: number) => void;
  children?: ReactNode;
};

/**
 * One full-viewport beat. Activates when mostly in view.
 * Keeps copy sparse on purpose — one line + optional whisper.
 */
export function StoryBeat({ chapter, index, onActive, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const on = entry.isIntersecting && entry.intersectionRatio >= 0.45;
        setVisible(on);
        if (on) onActive(index);
      },
      { threshold: [0.45, 0.6, 0.75] },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [index, onActive]);

  return (
    <section
      ref={ref}
      id={chapter.id}
      data-story-beat={chapter.id}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-end px-6 pb-[18vh] pt-32 text-center md:justify-center md:px-10 md:pb-0 md:pt-[38vh]"
      aria-label={chapter.line}
    >
      {/* ghost words in the dark — problems before the light */}
      {chapter.ghosts && chapter.ghosts.length > 0 && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          {chapter.ghosts.map((g, i) => (
            <span
              key={g}
              className="absolute font-display text-sm italic text-[var(--story-ink-ghost)] transition-opacity duration-700 md:text-base"
              style={{
                left: `${12 + ((i * 23) % 70)}%`,
                top: `${18 + ((i * 31) % 60)}%`,
                opacity: visible ? 0.45 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transitionDelay: `${120 + i * 90}ms`,
              }}
            >
              {g}
            </span>
          ))}
        </div>
      )}

      <div
        className="relative z-10 mx-auto flex max-w-xl flex-col items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 600ms ease, transform 600ms ease",
        }}
      >
        <StoryMotif motif={chapter.motif} active={visible} />

        <p className="font-display text-[clamp(1.75rem,5.5vw,3.25rem)] font-light leading-[1.15] tracking-tight text-[var(--story-ink)] text-balance">
          {chapter.line}
        </p>

        {chapter.whisper && (
          <p
            className="mt-5 max-w-sm text-balance text-[15px] leading-relaxed text-[var(--story-ink-dim)] md:text-base"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 700ms ease 180ms",
            }}
          >
            {chapter.whisper}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}

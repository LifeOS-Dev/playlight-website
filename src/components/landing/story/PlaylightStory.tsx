import { useCallback, useState } from "react";
import { Link } from "@tanstack/react-router";
import { STORY_CHAPTERS } from "./chapters";
import { StoryBeat } from "./StoryBeat";
import { StoryLight } from "./StoryLight";
import { StoryCta } from "./StoryCta";
import { GetPlaylightPanel } from "../v3/TryToday";

/**
 * Scroll story template — orb lights each beat.
 * Edit `chapters.ts` to change copy; keep one idea per frame.
 */
export function PlaylightStory() {
  const [active, setActive] = useState(0);
  const chapter = STORY_CHAPTERS[active] ?? STORY_CHAPTERS[0];

  const onActive = useCallback((index: number) => {
    setActive(index);
  }, []);

  return (
    <div className="story-page relative min-h-screen overflow-x-hidden">
      <StoryLight intensity={chapter.intensity} mood={chapter.mood} size={220} />

      {/* minimal chrome — never competes with the orb */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-8">
        <Link
          to="/"
          className="font-display text-lg font-light tracking-tight text-[var(--story-ink)]"
        >
          play<span className="text-[#FFA32B]">light</span>
          <span className="sr-only"> — home</span>
        </Link>
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[var(--story-ink-dim)]">
          {String(active + 1).padStart(2, "0")} / {String(STORY_CHAPTERS.length).padStart(2, "0")}
        </span>
      </header>

      {/* progress rail */}
      <div
        className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex"
        aria-hidden
      >
        {STORY_CHAPTERS.map((c, i) => (
          <span
            key={c.id}
            className="block h-1.5 w-1.5 rounded-full transition-all duration-500"
            style={{
              background:
                i === active ? "#FFA32B" : "rgba(255,255,255,0.18)",
              transform: i === active ? "scale(1.4)" : "scale(1)",
              boxShadow: i === active ? "0 0 10px rgba(255,163,43,0.55)" : "none",
            }}
          />
        ))}
      </div>

      <main className="relative z-10">
        {STORY_CHAPTERS.map((ch, i) => (
          <StoryBeat key={ch.id} chapter={ch} index={i} onActive={onActive}>
            {ch.motif === "cta" ? <StoryCta /> : null}
            {i === 0 ? (
              <div
                className="mt-14 flex flex-col items-center gap-2 text-[var(--story-ink-dim)]"
                aria-hidden
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.3em]">
                  scroll
                </span>
                <span className="story-scroll-cue block h-8 w-px bg-gradient-to-b from-[#FFA32B]/80 to-transparent" />
              </div>
            ) : null}
          </StoryBeat>
        ))}
      </main>

      {/* The panel is styled from the .pl3 palette; `display: contents`
          lends it those variables without putting a box on this page. */}
      <div className="pl3 pl3-portal">
        <GetPlaylightPanel />
      </div>
    </div>
  );
}

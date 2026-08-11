import { Orb } from "@/components/landing/Orb";
import type { ChapterMood } from "./chapters";

type Props = {
  intensity: number;
  mood: ChapterMood;
  /** Slight size bump on larger screens */
  size?: number;
};

/**
 * Fixed light source for the story page.
 * Stays behind copy; intensity/mood follow the active beat.
 */
export function StoryLight({ intensity, mood, size = 200 }: Props) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
      aria-hidden
    >
      {/* warm vignette that breathes with the orb */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: 0.35 + intensity * 0.4,
          background: `
            radial-gradient(ellipse 55% 45% at 50% 48%, rgba(255, 163, 43, ${0.08 + intensity * 0.1}) 0%, transparent 70%),
            radial-gradient(ellipse 90% 80% at 50% 100%, rgba(16, 14, 12, 0.9), transparent 55%)
          `,
        }}
      />

      {/* soft floor glow under the orb — where copy lives */}
      <div
        className="absolute left-1/2 top-[42%] h-[50vmin] w-[75vmin] -translate-x-1/2 rounded-full transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255, 163, 43, ${0.14 * intensity}), transparent 70%)`,
          filter: "blur(40px)",
          opacity: intensity,
        }}
      />

      {/* orb sits high — light source, not a text backdrop */}
      <div className="absolute left-1/2 top-[18%] -translate-x-1/2 scale-[0.7] opacity-95 md:top-[14%] md:scale-[0.92]">
        <Orb size={size} intensity={intensity} mood={mood} />
      </div>

      {/* dust motes in the beam */}
      <div className="story-motes absolute inset-0" />
    </div>
  );
}

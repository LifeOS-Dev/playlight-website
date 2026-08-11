export type ChapterMood = "rest" | "focus" | "think" | "night" | "bloom";

export type StoryChapter = {
  id: string;
  /** Single short line — the only thing to read in this frame */
  line: string;
  /** Optional whisper under the line (keep ≤ ~8 words) */
  whisper?: string;
  /** Ghost words that float in the dark before the orb lights them */
  ghosts?: string[];
  intensity: number;
  mood: ChapterMood;
  /** Visual motif beside the copy */
  motif?: "noise" | "hold" | "protocol" | "plan" | "memory" | "honest" | "hearth" | "cta";
};

/**
 * One idea per frame. ADHD-friendly: glance → get it → scroll.
 * Edit lines freely — structure stays the same.
 */
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "open",
    line: "Your day has a light.",
    whisper: "Scroll to meet it.",
    intensity: 0.85,
    mood: "rest",
    motif: "hearth",
  },
  {
    id: "noise",
    line: "But the day gets loud.",
    whisper: "Tabs. Pings. Forgotten yeses.",
    ghosts: ["forgot again", "what was I doing", "later", "too much"],
    intensity: 0.35,
    mood: "night",
    motif: "noise",
  },
  {
    id: "hold",
    line: "Playlight holds it.",
    whisper: "One calm surface. No shouting.",
    intensity: 1.15,
    mood: "focus",
    motif: "hold",
  },
  {
    id: "orb",
    line: "An orb that knows your day.",
    whisper: "Rest. Focus. Bloom when you finish.",
    intensity: 1.25,
    mood: "bloom",
    motif: "hearth",
  },
  {
    id: "protocol",
    line: "A protocol you choose.",
    whisper: "Habits as practice — not spam.",
    intensity: 1.05,
    mood: "focus",
    motif: "protocol",
  },
  {
    id: "plan",
    line: "Want becomes doing.",
    whisper: "Goals and pillars → real tasks.",
    intensity: 1.1,
    mood: "focus",
    motif: "plan",
  },
  {
    id: "memory",
    line: "It remembers what you meant.",
    whisper: "Close the day. Hand off tomorrow.",
    intensity: 0.95,
    mood: "think",
    motif: "memory",
  },
  {
    id: "honest",
    line: "Evidence, not horoscopes.",
    whisper: "Insights you can ask why.",
    intensity: 1.0,
    mood: "think",
    motif: "honest",
  },
  {
    id: "cta",
    line: "Come into the light.",
    whisper: "Get Playlight.",
    intensity: 1.35,
    mood: "bloom",
    motif: "cta",
  },
];

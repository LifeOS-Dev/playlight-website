/**
 * The Core Four — the four pressures Playlight can actually demonstrate today.
 * Source: docs/website-builder-problems-solutions-brief.md §2 + §4 (priority order).
 *
 * Rule from the brief: each face = one felt problem + one product answer +
 * one emotion shift. Quotes stay in the user's language, never product jargon.
 */

export type MotifKey =
  | "fog"
  | "trajectory"
  | "balance"
  | "memory";

export type Face = {
  id: string;
  /** Short anchor name — secondary label, never the headline */
  name: string;
  /** The felt problem, in the user's own words */
  quote: string;
  /** One line of root cause, kept quiet */
  root: string;
  /** The Playlight answer — what the product does, plainly */
  answer: string;
  /** Emotion shift, shown only on the solution side */
  from: string;
  to: string;
  motif: MotifKey;
};

export const FACES: Face[] = [
  {
    id: "fog-of-now",
    name: "Fog of Now",
    quote: "I don't know what matters today.",
    root: "Nothing compresses the whole mess into a clear present.",
    answer: "One clear now. Not another plan to maintain.",
    from: "anxiety",
    to: "oriented calm",
    motif: "fog",
  },
  {
    id: "invisible-life",
    name: "Invisible Life",
    quote: "I can't see if I'm getting anywhere.",
    root: "Activity gets tracked. Trajectory doesn't.",
    answer: "A view of your whole life — progress you can actually see.",
    from: "aimlessness",
    to: "orientation",
    motif: "trajectory",
  },
  {
    id: "broken-balance",
    name: "Broken Balance",
    quote: "I fix one area and break another.",
    root: "Life runs in silos, so trade-offs stay invisible until damage.",
    answer: "See every pillar together, before something snaps.",
    from: "spread thin",
    to: "sustainable",
    motif: "balance",
  },
  {
    id: "forgotten-lessons",
    name: "Forgotten Lessons",
    quote: "I don't learn from what I do.",
    root: "No loop between what you did and what it cost.",
    answer: "Your own evidence, back when it matters. Ask why.",
    from: "self-doubt",
    to: "self-trust",
    motif: "memory",
  },
];

/** Eight facets of a life — what the tiles around the orb hold. */
export const FACETS = [
  { id: "health", label: "Health" },
  { id: "wealth", label: "Wealth" },
  { id: "work", label: "Work" },
  { id: "people", label: "People" },
  { id: "habits", label: "Habits" },
  { id: "time", label: "Time" },
  { id: "notes", label: "Notes" },
  { id: "mind", label: "Mind" },
] as const;

export type FacetId = (typeof FACETS)[number]["id"];

export const FAQS = [
  {
    q: "Is this another productivity app?",
    a: "No. Productivity apps ask you to maintain them. Playlight holds your life model and gives you one honest next move — you can open it for ten seconds and leave with something.",
  },
  {
    q: "Does it sync with my other apps?",
    a: "Not today. Playlight is one place where the things you put in it — tasks, habits, goals, wealth, notes — share a single model, so the dots connect without you doing the mental glue. Third-party sync is direction, not a promise.",
  },
  {
    q: "What does the AI actually do?",
    a: "It reads the life data you've already given it and surfaces what's relevant now — a focus, a pattern, a memory you'd have forgotten. It suggests. You decide. Every insight can be asked why.",
  },
  {
    q: "I've bounced off tools like this before.",
    a: "Most of them are built for people whose attention never wavers. Playlight shows one thing at a time, leans on visuals over text, and doesn't punish a broken streak. Missing three days costs you nothing.",
  },
  {
    q: "Who is it for?",
    a: "People building something across several parts of life at once — work, health, money, relationships — who are tired of holding all of it in their head.",
  },
  {
    q: "What happens to my data?",
    a: "It's yours. You can export it or delete your account and everything in it at any time, from inside the app or from this site.",
  },
];

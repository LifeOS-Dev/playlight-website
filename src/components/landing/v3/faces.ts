/**
 * Six pressures on the road. Numbered, in the order a visitor meets them
 * after the life-facets fly past.
 *
 * Each face = one felt problem (their words) + one Playlight answer.
 * No jargon, no extra root-cause paragraph - the visual carries that.
 */

export type MotifKey = "trajectory" | "balance" | "fog" | "scatter" | "load" | "companion";

export type Face = {
  id: string;
  /** 1-6, shown as 01-06. This is a sequence; the number is the map. */
  n: number;
  /** Short name for the compass - where you are, not a feature label */
  name: string;
  /** The felt problem, in the user's own words. This is the heading. */
  quote: string;
  /** The Playlight answer - one line, after the light crosses */
  answer: string;
  motif: MotifKey;
};

export const FACES: Face[] = [
  {
    id: "invisible-life",
    n: 1,
    name: "Invisible life",
    quote: "I can't see where anything is going.",
    answer: "Your lifespan, arcs, goals, and projects - in one view.",
    motif: "trajectory",
  },
  {
    id: "broken-balance",
    n: 2,
    name: "Broken balance",
    quote: "I fix one part of life and another snaps.",
    answer: "See every domain together, before something snaps.",
    motif: "balance",
  },
  {
    id: "fog-of-now",
    n: 3,
    name: "What matters now",
    quote: "I don't know what matters today.",
    answer: "One clear next step. Not another plan to maintain.",
    motif: "fog",
  },
  {
    id: "scattered-life",
    n: 4,
    name: "Scattered life",
    quote: "My notes, health, tasks, money - all in different apps.",
    answer: "One place where your life makes sense together.",
    motif: "scatter",
  },
  {
    id: "heavy-tools",
    n: 5,
    name: "Heavy tools",
    quote: "Apps are walls of text. I open them and close them.",
    answer: "Visual first. One step at a time.",
    motif: "load",
  },
  {
    id: "walking-alone",
    n: 6,
    name: "Walking alone",
    quote: "This is a long road to walk alone.",
    answer: "Ash walks with you. You still steer.",
    motif: "companion",
  },
];

export const FACE_COUNT = FACES.length;

/**
 * Eight facets of a life - the departments that ring the light.
 *
 * Around the orb they carry a word and a glyph, nothing else: a caption on
 * each one turns the composition into a feature list, and the claim here is
 * that these are one thing, not eight.
 *
 * `says` is what the light answers when you touch that facet - one line, in
 * the second person, drawn only from data Playlight actually holds. No
 * invented integrations, and short enough to sit on one line above the orb.
 */
export const FACETS = [
  { id: "health", label: "Health", says: "Sleep is the one slipping." },
  { id: "wealth", label: "Wealth", says: "You're ahead of your own number." },
  { id: "work", label: "Work", says: "One project is waiting on you." },
  { id: "people", label: "People", says: "Three weeks since you saw Sam." },
  { id: "personality", label: "Personality", says: "You commit fast, then renegotiate." },
  { id: "time", label: "Time", says: "Tuesday went to meetings." },
  { id: "goals", label: "Goals", says: "One goal carried the other four." },
  { id: "mind", label: "Mind", says: "Your focus is best before eleven." },
] as const;

export type FacetId = (typeof FACETS)[number]["id"];

export const FACET_BY_ID: Record<FacetId, (typeof FACETS)[number]> = Object.fromEntries(
  FACETS.map((f) => [f.id, f]),
) as Record<FacetId, (typeof FACETS)[number]>;

export const FAQS = [
  {
    q: "Is this another productivity app?",
    a: "No. Productivity apps exist to get more out of you. Playlight is a life alignment product - it looks after how you're actually doing across health, work, money and the people around you, and acts as an assistant for your life rather than another queue to clear.",
  },
  {
    q: "Does it sync with my other apps?",
    a: "Yes - and those connections are being built as we speak. In the meantime everything you need is already here: put your tasks, habits, goals, wealth and notes in one place and you get a comprehensive view of your life without waiting on anything else.",
  },
  {
    q: "What does the AI actually do?",
    a: "Ash reads the life data you've already given it and surfaces what's relevant now - a focus, a pattern, a memory you'd have forgotten. It suggests. You decide. Every insight can be asked why.",
  },
  {
    q: "I've bounced off tools like this before.",
    a: "Most of them are built for people whose attention never wavers. Playlight shows one thing at a time, leans on visuals over text, and doesn't punish a broken streak. Missing three days costs you nothing.",
  },
  {
    q: "Who is it for?",
    a: "People building something across several parts of life at once - work, health, money, relationships - who are tired of holding all of it in their head.",
  },
  {
    q: "What happens to my data?",
    a: "It's yours. You can export it or delete your account and everything in it at any time, from inside the app or from this site.",
  },
];

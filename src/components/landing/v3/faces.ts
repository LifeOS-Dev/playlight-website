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

/**
 * The questions are the visitor's; the answers are Light's, in the first
 * person - the same voice that talks on the road above. Every claim here is
 * one the app and the Terms and Privacy pages already make: nothing that
 * has not shipped is answered "yes".
 */
export const FAQS = [
  {
    q: "Is this another productivity app?",
    a: "Not really. Productivity apps are built to get more out of you. I'm built to look after how you're actually doing - your health, money, work and the people around you - and to help you choose the next right thing. Less a queue to clear, more a place to see your whole life.",
  },
  {
    q: "What does the AI actually do?",
    a: "I read what you've given me and bring back what matters now - a focus, a pattern, something you'd have forgotten. I suggest; you decide, and you can always ask me why. My AI features are optional: I ask before anything is sent to an AI model, and you can turn that off whenever you like.",
  },
  {
    q: "Is it free?",
    a: "Yes. Playlight is free right now, on iPhone and Android. If paid features ever arrive, you'll see the price before you pay for anything.",
  },
  {
    q: "Does it sync with my other apps?",
    a: "Not yet, and I won't pretend otherwise. Today you tell me things yourself - tasks, habits, goals, money, notes - and I put them where they belong and connect the dots. Connections to other apps are on the roadmap.",
  },
  {
    q: "I've bounced off tools like this before.",
    a: "Most tools hand you an empty system and ask you to fill it in. You don't have to give me everything. Start with one thing - a goal, a habit, a worry - and I'll work with that. On most days, a look takes ten seconds.",
  },
  {
    q: "Who is it for?",
    a: "Anyone who wants their whole life to move forward, not just their inbox - especially if your head feels too full to hold it all. If you've ever felt busy but unclear, I'm for you.",
  },
  {
    q: "What happens to my data?",
    a: "It's yours. The team behind me never sells it, rents it or uses it for ads. It travels encrypted, you can ask for a copy at any time, and you can delete your account - and everything in it - from the app or from this site.",
  },
];

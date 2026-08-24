export type CoreFaceId = "fog" | "invisible" | "balance" | "lessons";

export type CoreFace = {
  id: CoreFaceId;
  label: string;
  problem: string;
  solution: string;
  mood: "night" | "think" | "focus" | "bloom" | "rest";
  intensity: number;
};

/** Core Four — homepage problem → light sequence */
export const CORE_FOUR: CoreFace[] = [
  {
    id: "fog",
    label: "Fog of Now",
    problem: "I don’t know what matters today.",
    solution: "One clear now. Not another plan to maintain.",
    mood: "think",
    intensity: 1.05,
  },
  {
    id: "invisible",
    label: "Invisible Life",
    problem: "I can’t see if I’m getting anywhere.",
    solution: "A UI for your whole life — progress you can feel.",
    mood: "focus",
    intensity: 1.15,
  },
  {
    id: "balance",
    label: "Broken Balance",
    problem: "I fix one area and break another.",
    solution: "See every pillar before something snaps.",
    mood: "rest",
    intensity: 1.1,
  },
  {
    id: "lessons",
    label: "Forgotten Lessons",
    problem: "I move fast but don’t learn.",
    solution: "Evidence back when it matters. Ask why.",
    mood: "bloom",
    intensity: 1.25,
  },
];

export const V2A_FAQS = [
  {
    q: "What is Playlight?",
    a: "A calm tool to visualize and navigate your life — so you can see where you stand and what matters now.",
  },
  {
    q: "Who is it for?",
    a: "Ambitious, reflective people who already try hard — and feel overloaded by text-heavy productivity systems.",
  },
  {
    q: "Is this another task app?",
    a: "No. Tasks live inside a life picture. The point is orientation and balance, not another list to maintain.",
  },
  {
    q: "Does it replace my other apps?",
    a: "It doesn’t need to. Playlight is a place where your life makes sense together — not a clone of every specialist tool.",
  },
];

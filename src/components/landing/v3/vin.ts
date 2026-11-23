/**
 * The VIN model - Visualize, Interpret, Navigate - as the road tells it.
 *
 * One card, three states. The same life is drawn three times by the same
 * pieces: first as everything about you, gathered into one view; then with
 * three of those pieces lit and joined into an insight; then with those
 * three pieces stood up as steps. Nothing is swapped out between the states.
 * The pieces move, and that movement is the claim: the plan is made out of
 * the picture, not written next to it.
 *
 * Every number here is in the picture's own units: a 160 x 90 stage, the
 * light's "you" at its middle. All of it is fixed - no randomness - so the
 * server and the client draw the same thing.
 */

import { LINES } from "./narration";

export type VinStep = "intro" | "v" | "i" | "n";

/** The three states, in order. "intro" is the trio before they fold into one. */
export const VIN_STEPS = ["v", "i", "n"] as const;
export type VinStage = (typeof VIN_STEPS)[number];

/**
 * One sentence each, in the light's own voice, and no more - the words live
 * with the rest of Light's lines in narration.ts. Each one is said once the
 * picture above it has settled, so there is only ever one thing to take in
 * at a time: the picture, then the sentence.
 *
 * The reasons each one matters used to follow as three tags under every
 * sentence. They are now the "What it solves" collage further down the road,
 * where each gets a whole tile instead of a fragment.
 */
export const VIN = {
  v: {
    letter: "V",
    word: "Visualize",
    rest: "isualize",
    says: LINES.vin.v,
  },
  i: {
    letter: "I",
    word: "Interpret",
    rest: "nterpret",
    says: LINES.vin.i,
  },
  n: {
    letter: "N",
    word: "Navigate",
    rest: "avigate",
    says: LINES.vin.n,
  },
} as const;

// ── The picture ──────────────────────────────────────────────────────

export const STAGE_W = 160;
export const STAGE_H = 90;
/** The light's "you", in the middle of everything it holds. */
export const HEART: Pt = [80, 45];

type Pt = [number, number];

export type NodeKind = "pillar" | "goal" | "project" | "trait";

/**
 * Four kinds of thing a life holds, each on its own orbit around you. The
 * orbits are the logo's concentric aura laid down in perspective: the same
 * stepped bands, brighter toward the heart.
 */
export const RINGS: Array<{
  kind: NodeKind;
  label: string;
  rx: number;
  ry: number;
}> = [
  { kind: "pillar", label: "Pillars", rx: 24, ry: 12 },
  { kind: "goal", label: "Goals", rx: 42, ry: 22 },
  { kind: "project", label: "Projects", rx: 60, ry: 31 },
  { kind: "trait", label: "Traits", rx: 76, ry: 40 },
];

/** Which side of its marker a label reads from, in the Visualize state. */
type Side = "l" | "r" | "t" | "b";

export type VinNode = {
  id: string;
  kind: NodeKind;
  /** 0-3: which orbit, which also sets when it arrives. */
  ring: number;
  label?: string;
  side?: Side;
  /** Where it sits in each state. */
  v: Pt;
  i: Pt;
  n: Pt;
  /** Only the three pieces the insight is made from carry these. */
  key?: {
    /** What the light read off it, shown while it interprets. */
    readout: string;
    /** Above or below its marker in the Interpret state. */
    above: boolean;
    /** The step it becomes. */
    step: string;
    when: string;
    /** Which step, 1-3. */
    n: number;
  };
};

const at = (ring: number, deg: number): Pt => {
  const r = RINGS[ring];
  const a = (deg * Math.PI) / 180;
  return [
    Number((HEART[0] + r.rx * Math.cos(a)).toFixed(1)),
    Number((HEART[1] + r.ry * Math.sin(a)).toFixed(1)),
  ];
};

/** Pulled toward the heart - where everything that is not a step goes. */
const inward = ([x, y]: Pt, k = 0.3): Pt => [
  Number((HEART[0] + (x - HEART[0]) * k).toFixed(1)),
  Number((HEART[1] + (y - HEART[1]) * k).toFixed(1)),
];

/** Where the three steps stand: a column left of centre, so the list and its
 *  "when" tags sit as one block in the card rather than hugging its edge. */
const STEP_X = 34;
/** Where the "when" tags line up. */
export const WHEN_X = 132;
const STEP_Y = [17, 45, 73];

const plain = (
  id: string,
  kind: NodeKind,
  ring: number,
  deg: number,
  label?: string,
  side?: Side,
): VinNode => {
  const v = at(ring, deg);
  return { id, kind, ring, label, side, v, i: v, n: inward(v) };
};

export const NODES: VinNode[] = [
  // Two per orbit, and nothing unnamed. Every extra mark on this map is one
  // more thing to read before the idea lands.
  //
  // Pillars - the areas a week is actually spent on.
  {
    id: "health",
    kind: "pillar",
    ring: 0,
    label: "Health",
    side: "l",
    v: at(0, 180),
    i: [80, 71],
    n: [STEP_X, STEP_Y[1]],
    key: {
      readout: "Sleep 5h 40m",
      above: false,
      step: "Easy 5 km before work",
      when: "Tue",
      n: 2,
    },
  },
  plain("wealth", "pillar", 0, 0, "Wealth", "r"),

  // Goals.
  {
    id: "marathon",
    kind: "goal",
    ring: 1,
    label: "Half marathon",
    side: "l",
    v: at(1, 215),
    i: [131, 24],
    n: [STEP_X, STEP_Y[2]],
    key: {
      readout: "2 of 4 runs",
      above: true,
      step: "Long run, 12 km",
      when: "Sun",
      n: 3,
    },
  },
  plain("runway", "goal", 1, 35, "6-month runway", "r"),

  // Projects.
  plain("shop", "project", 2, 322, "Launch the shop", "t"),
  plain("spanish", "project", 2, 145, "Spanish B1", "b"),

  // Traits - how you tend to work, which the rest has to be planned around.
  {
    id: "owl",
    kind: "trait",
    ring: 3,
    label: "Night owl",
    side: "r",
    v: at(3, 250),
    i: [29, 24],
    n: [STEP_X, STEP_Y[0]],
    key: {
      readout: "Bed after 1 am",
      above: true,
      step: "Lights out by 11 tonight",
      when: "Now",
      n: 1,
    },
  },
  plain("fast", "trait", 3, 68, "Commits fast", "r"),
];

/** The heart moves too: it sits in the middle of the insight, then on the step you're on. */
export const HEART_AT: Record<VinStage, Pt> = {
  v: HEART,
  i: [80, 44],
  n: [STEP_X, STEP_Y[0]],
};

export const KEY_NODES = NODES.filter((n) => n.key).sort((a, b) => a.key!.n - b.key!.n);

/** What the light reads out of the three, once they are joined. */
export const INSIGHT = {
  tag: "Insight",
  text: "Late nights are costing your runs.",
};

/** Under the steps: only the first one is yours yet. */
export const NAV_NOTE = "The rest can wait.";

export const STEP_LINE = { x: STEP_X, y0: STEP_Y[0], y1: STEP_Y[2] };

// ── What it solves ───────────────────────────────────────────────────

export type SolveKind = "load" | "ground" | "improve" | "long" | "canvas";

/**
 * What the VIN model does for a life, once it has been shown. Five tiles, and
 * each one carries a drawing, a title and one line - nothing else. The page is
 * claiming to take load off a mind; it cannot make that claim in paragraphs.
 */
export const SOLVES: Array<{ kind: SolveKind; title: string; line: string }> = [
  {
    kind: "load",
    title: "Less cognitive load",
    line: "Everything important about you, in one place.",
  },
  {
    kind: "ground",
    title: "Grounding",
    line: "When life feels off, you know where to look.",
  },
  {
    kind: "improve",
    title: "Improvement",
    line: "Lift one part of your life at a time.",
  },
  {
    kind: "long",
    title: "The long game",
    line: "Light reviews, plans and reflects with you.",
  },
  {
    kind: "canvas",
    title: "A canvas for life",
    line: "Room to design the life you want.",
  },
];

export const SOLVE_TITLE = "What it solves";

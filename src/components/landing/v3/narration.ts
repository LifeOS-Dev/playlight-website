/**
 * Everything Light says on the homepage, in one place.
 *
 * Light narrates this page the way it narrates the app's own tour
 * (los_client: src/components/tour/tourScript.ts opens on "Hi. I'm Light.").
 * Edit the words here; nothing else on the page has to change.
 *
 * How it speaks:
 *  - First person, to "you". Nothing on the page calls it "it", or says
 *    "Light helps you" - Light says "I".
 *  - One sentence at a time, said once and held. A line is only ever replaced
 *    by the next beat, never cycled beside something else to read.
 *  - It knows only what it is given: "what you tell me", never "I see
 *    everything". That is the honest claim (you enter your life yourself, and
 *    the AI asks before it reads), and it is the page's inward flow - the
 *    light is the sum of what it is given, not a lamp on your life.
 *  - Its words have one look - Newsreader italic, condensing out of the glow -
 *    and only its words do. If a line is set that way, Light said it.
 *  - Where it speaks is part of the line: always between the picture it is
 *    talking about and the light itself, so the eye runs picture, sentence,
 *    light - and the light's heart looks back at the picture.
 *
 * Dashes are spaced hyphens, as everywhere else on the site.
 */
export const LINES = {
  /** The gate: the first thing anyone meets, and the brand said by its own light. */
  gate: {
    creed: ["Life is the most important game.", "I'm Light. I'm here to help you win it."],
    /** The ask, under the controls. */
    ask: "Choose your vibe",
    /** Said as the chosen light flies home, after the vibe's own name. */
    taken: "Let's play.",
    /** Leaves with the house light. */
    skip: "Skip",
  },

  /** The hero, at rest. */
  hero: {
    /** Only to someone who did not just meet it at the gate. */
    hello: "Hi. I'm Light.",
    /** The brand's definition, in the light's own words - held. */
    intro: "Give me the pieces - I'll show you the whole.",
    /** If nobody has touched the ring after a while: the demo, offered. */
    hint: {
      pointer: "Point at any piece. Here's what I might notice.",
      touch: "Tap any piece. Here's what I might notice.",
    },
    /** First scroll: held while the hero flies and the road empties. */
    go: "Come - I'll show you how I work.",
  },

  /** The VIN model: the intro over the three cards, then one line per state. */
  vin: {
    intro: "I help in three steps. V, I, N - it's how you win.",
    v: "Everything you tell me, in one view - so you can see what was invisible.",
    i: "I connect the dots across your life, and show you where to improve.",
    n: "I break the plan into steps, and walk them with you - one at a time.",
  },

  /** What it solves: Light says what changes; each tile's line is its own. */
  solve: {
    intro: "Here's what changes for you.",
  },

  /** The road's end: the hand-over to the real screens below. */
  roadEnd: "Want to see it for real?",

  /** Over the app screens. */
  look: "This is that same life, in the app.",

  /** The one close, at the foot of the page. */
  close: {
    line: "Your move.",
    sub: "Playlight is free on iPhone and Android.",
  },
} as const;

/**
 * How long a line takes to arrive, word by word, matching the CSS that
 * animates it: `thinkMs` of thinking first (0 for none), then a word every
 * `WORD_MS`. Shared so the orb's pulses land with the words.
 */
export const WORD_MS = 70;

export const wordsOf = (line: string) => line.split(" ").filter(Boolean);

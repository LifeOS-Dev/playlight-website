/**
 * What the page's voice asks of the orb's body.
 *
 * Light narrates the homepage: its words condense out of the glow on its own
 * crown. While it talks, the body should be seen doing it - the way the app's
 * light does - so the voice can ask for three things:
 *
 *   think  the app's own `thinking` posture: quicker currents, a harder swirl
 *          around the heart. Held while a sentence is being found.
 *   word   a small warm lift as each word lands, so the speaking is visible
 *          in the light and not only in the text.
 *   look   the heart turned toward whatever is being talked about - the facet
 *          you touched, the insight, the step, the tile in focus. This is how
 *          the light SHOWS rather than only says, and it leads the eye there.
 *
 * Writers: the voices (OrbSpeech, the VIN voice, the collage, the FAQ). The
 * reader is LightBody's frame loop, by plain property reads every frame - no
 * React, no events. Everything here is a request; the loop eases toward it,
 * so a writer can change its mind without the orb jumping.
 *
 * In reduced motion the shader never runs, so none of this is drawn: the
 * words still arrive, whole, and the picture stays still.
 */

/** Something to look at: an element (followed as it moves) or a point in viewport px. */
export type LookTarget = Element | { x: number; y: number };

export const lightCue = {
  /** Finding a sentence. */
  thinking: false,
  /** performance.now() of the latest word to land, or 0. */
  word: 0,
  /** Where the heart should look, or null to leave it to the cursor and its own glances. */
  look: null as LookTarget | null,
  /** Which voice set `look`, so each one only ever clears its own. */
  lookBy: "",
};

export function lightThink(on: boolean) {
  lightCue.thinking = on;
}

export function lightWord() {
  lightCue.word = typeof performance === "undefined" ? 0 : performance.now();
}

/** Turn the heart toward `target`, or - with null - stop, if `by` is the one looking. */
export function lightLook(by: string, target: LookTarget | null) {
  if (target) {
    lightCue.look = target;
    lightCue.lookBy = by;
  } else if (lightCue.lookBy === by) {
    lightCue.look = null;
    lightCue.lookBy = "";
  }
}

/**
 * Act out a sentence of `words` words: think for `thinkMs` (0 for none), then
 * land a word every `everyMs`, starting `startMs` from now. Mirrors the timing
 * the words themselves are animated with, so the light and the text keep time.
 * Returns a cancel, for a sentence interrupted by the next one.
 */
export function lightSpeak(
  words: number,
  { thinkMs = 0, everyMs = 60, startMs = 0 }: { thinkMs?: number; everyMs?: number; startMs?: number } = {},
): () => void {
  if (typeof window === "undefined") return () => {};
  const timers: number[] = [];
  if (thinkMs > 0) {
    timers.push(window.setTimeout(() => lightThink(true), startMs));
    timers.push(window.setTimeout(() => lightThink(false), startMs + thinkMs));
  }
  for (let i = 0; i < words; i++) {
    timers.push(window.setTimeout(lightWord, startMs + thinkMs + i * everyMs));
  }
  return () => {
    timers.forEach((t) => window.clearTimeout(t));
    lightThink(false);
  };
}

/** The centre of a target in viewport px, or null if it is not laid out. */
export function lookPoint(t: LookTarget): { x: number; y: number } | null {
  if (typeof (t as Element).getBoundingClientRect === "function") {
    const r = (t as Element).getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return t as { x: number; y: number };
}

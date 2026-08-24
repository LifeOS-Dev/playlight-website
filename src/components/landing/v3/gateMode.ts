/**
 * Three ways to choose a light, so the phone can be tried rather than
 * argued about.
 *
 * All three end in the same place - `onChoose(vibe)` - and share the orb,
 * the torch and the name under it. What differs is only how a finger says
 * which hue it means. This file exists so picking between them is a URL
 * away on a real device; once one has won, delete the other two and this
 * module goes with them.
 *
 *   dial   the orb itself. Press it, slide around it, lift to take. The
 *          desktop mechanic with the press standing in for the hover.
 *   wheel  the spectrum turns inside a still orb, under a fixed mark at
 *          the top. Swipe to turn, tap to take. The hand never covers
 *          the colour it is choosing.
 *   track  a bar of the same spectrum under the orb. Slide it, lift to
 *          take. Nothing to discover, nothing hidden by a thumb.
 */
export type GateMode = "dial" | "wheel" | "track";

export const GATE_MODES: readonly GateMode[] = ["dial", "wheel", "track"];

export const DEFAULT_GATE_MODE: GateMode = "dial";

/** Shown on the switcher, which only exists while a mode is being tried. */
export const GATE_MODE_LABEL: Record<GateMode, string> = {
  dial: "Dial",
  wheel: "Wheel",
  track: "Track",
};

/** The instruction under the orb. Each mechanic asks for a different hand. */
export const GATE_MODE_HINT: Record<GateMode, string> = {
  dial: "(press the light, slide, lift to take)",
  wheel: "(swipe to turn - tap to take)",
  track: "(slide to choose)",
};

/**
 * What a device gets when nobody has asked for anything in particular.
 *
 * The dial is a stream, not a value: what is chosen is only ever "where
 * the finger is now", so any break in that stream - a pointer the
 * browser cancels near a screen edge, a frame the compositor drops -
 * destroys the selection outright, and the light goes out under a hand
 * that has not moved off anything. On a phone that break happens often
 * enough to be the normal experience rather than the exception.
 *
 * The track cannot fail that way. Its thumb holds a position, so an
 * interrupted gesture leaves the choice exactly where it was. It is not
 * a simpler mechanic chosen over a better one; it is the one whose
 * correctness does not depend on events nobody can guarantee.
 *
 * So: a real cursor gets the orb and its beam. Everything else gets the
 * bar. `?gate=` still overrides both, for trying one against the other.
 */
export function defaultModeFor(): GateMode {
  if (typeof window === "undefined") return DEFAULT_GATE_MODE;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches ? "dial" : "track";
}

const KEY = "playlight.gate-mode";

const isMode = (v: unknown): v is GateMode =>
  typeof v === "string" && (GATE_MODES as readonly string[]).includes(v);

/**
 * Trying a mechanic is opt-in and never sticky: it takes `?gate` in the
 * address, and without it the site behaves as it always has. With it, the
 * gate is also forced open even for a visitor whose choice is already
 * remembered - otherwise the thing under test can only be seen once.
 *
 * Storage is session-scoped and guarded the same way vibe.ts guards its
 * own: this runs under SSR, and Safari throws on storage in private mode
 * rather than returning null.
 */
export function readGateMode(): { mode: GateMode; testing: boolean } {
  if (typeof window === "undefined") return { mode: DEFAULT_GATE_MODE, testing: false };

  const asked = new URLSearchParams(window.location.search).get("gate");
  if (asked === null) return { mode: DEFAULT_GATE_MODE, testing: false };

  if (isMode(asked)) return { mode: asked, testing: true };

  // `?gate` on its own resumes whichever one was last being looked at
  let saved: string | null = null;
  try {
    saved = window.sessionStorage.getItem(KEY);
  } catch {
    /* private mode - it just starts from the default every time */
  }
  return { mode: isMode(saved) ? saved : DEFAULT_GATE_MODE, testing: true };
}

export function writeGateMode(mode: GateMode) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, mode);
  } catch {
    /* as above */
  }
}

/**
 * Light's character, as plain numbers and pure functions.
 *
 * Ported from the app's src/components/orb/lightCharacter.ts and the part of
 * useLightCharacter.ts that schedules moves. Nothing in here touches React or
 * the DOM, on purpose: it is the part of the orb's personality that can be
 * checked without a browser, and it is the half most likely to drift from the
 * app, so it is kept where a diff can find it.
 *
 * What the site needs is the app's RESTING character and nothing else. The app
 * drives this from real state - a focus session, an overdue task, a day's
 * protocols - and the site has none of that, so the postures and the states
 * are ported but only `resting` is ever selected. The marketing orb is the app
 * orb on a quiet day, which is the honest thing for it to be.
 *
 * Timings below are the app's, to the millisecond. A blink that is 90ms here
 * and 70ms there is two different creatures.
 */

/** How far the heart can look, in body radii. */
export const GAZE_MAX = 0.24;
/** Resting eyelid by posture: 0 open, 1 closed. */
export const LID_NIGHT = 0.42;
export const LID_DOZE = 0.8;

/** First unprompted moment after the page wakes, then the gap between them. */
export const QUIRK_FIRST_MS: [number, number] = [2600, 6000];
export const QUIRK_GAP_MS: [number, number] = [6500, 13000];

/** Full breath cycle per state (ms). The site only ever rests. */
export const BREATH_MS = {
  resting: 8500,
  focus: 3400,
  thinking: 2600,
  night: 12000,
  alert: 1800,
} as const;

/** Where a settled breath rests: its middle, so size and glow are held. */
export const BREATH_REST = 0.5;

/** The floor the orb's vitality never drops below, even on an empty day. */
export const ORB_VITALITY_FLOOR = 0.25;

/** Seconds of current before the clock wraps. Keeps float precision sane. */
export const FLOW_WRAP = 2048;

export type LightState = keyof typeof BREATH_MS;

export type LightQuirk =
  | "blink"
  | "doubleBlink"
  | "slowBlink"
  | "glance"
  | "stretch"
  | "shiver"
  | "hop"
  | "stir"
  | "none";

/** Posture per state: how the body holds itself, not what it is doing. */
export interface LightPosture {
  /** Speed of the currents inside the body, 1 = resting. */
  flow: number;
  /** How much the currents wind around the heart. */
  swirl: number;
  /** 0 loose and drifting, 1 round and held. */
  tense: number;
  /** Resting eyelid. */
  lid: number;
  /** Vertical offset in px: negative leans up, positive sinks. */
  lean: number;
}

export function postureFor(state: LightState): LightPosture {
  switch (state) {
    case "focus":
      return { flow: 0.7, swirl: 0.55, tense: 0.75, lid: 0, lean: 0 };
    case "thinking":
      return { flow: 3.2, swirl: 1.6, tense: 0.2, lid: 0, lean: -2 };
    case "night":
      return { flow: 0.45, swirl: 0, tense: 0, lid: LID_NIGHT, lean: 7 };
    case "alert":
      return { flow: 1.6, swirl: 0.3, tense: 0.5, lid: 0, lean: -5 };
    default:
      return { flow: 1, swirl: 0, tense: 0, lid: 0, lean: 0 };
  }
}

/**
 * Which unprompted moment comes next, given a random draw in 0..1.
 *
 * Weighted, and restrained by state: a focus session gets the occasional blink
 * and nothing that would pull the eye; an overdue orb is already leaning at the
 * task and does not fidget; at night it only blinks slowly and shivers.
 */
export function pickQuirk(roll: number, state: LightState): LightQuirk {
  const r = Math.max(0, Math.min(0.999999, roll));
  if (state === "focus") return r < 0.35 ? "blink" : "none";
  if (state === "alert") return r < 0.6 ? "blink" : "none";
  if (state === "thinking") return r < 0.7 ? "blink" : "stir";
  if (state === "night") {
    if (r < 0.7) return "slowBlink";
    if (r < 0.9) return "glance";
    return "shiver";
  }
  if (r < 0.4) return "blink";
  if (r < 0.5) return "doubleBlink";
  if (r < 0.72) return "glance";
  if (r < 0.81) return "stretch";
  if (r < 0.88) return "shiver";
  if (r < 0.94) return "hop";
  return "stir";
}

/** A point between two bounds for a random draw in 0..1. */
export function between(range: [number, number], roll: number): number {
  return range[0] + (range[1] - range[0]) * Math.max(0, Math.min(1, roll));
}

/**
 * Where the heart looks for a point `dx, dy` away from the orb's centre, in
 * px. Saturates smoothly: something across the screen and something at the
 * edge of the orb pull it nearly the same distance, the way an eye turns.
 */
export function gazeToward(dx: number, dy: number, radius: number): { x: number; y: number } {
  const nx = dx / Math.max(1, radius);
  const ny = dy / Math.max(1, radius);
  const m = Math.hypot(nx, ny);
  if (m < 0.0001) return { x: 0, y: 0 };
  const g = (GAZE_MAX * (1 - Math.exp(-m * 0.9))) / m;
  return { x: nx * g, y: ny * g };
}

/**
 * The four places the orb glances at, as directions from itself.
 *
 * On Home these are real furniture - the task above it, the protocol under it,
 * the rail, quick capture. The site has none of those, so they survive only as
 * a shape of attention: it looks up, down, and to either side below itself,
 * which is what keeps the glances from reading as random.
 */
export const GLANCE_SPOTS: { x: number; y: number }[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -0.62, y: 0.78 },
  { x: 0.62, y: 0.78 },
];

export function glanceSpot(roll: number): { x: number; y: number } {
  const i = Math.min(GLANCE_SPOTS.length - 1, Math.floor(Math.max(0, roll) * GLANCE_SPOTS.length));
  const spot = GLANCE_SPOTS[i];
  return { x: spot.x * GAZE_MAX * 0.85, y: spot.y * GAZE_MAX * 0.85 };
}

// ---- tweening ------------------------------------------------------------

export type Ease = (t: number) => number;

/** Reanimated's Easing.out(cubic) / inOut(cubic) / in(quad), as functions. */
export const OUT: Ease = (t) => 1 - Math.pow(1 - t, 3);
export const IN_OUT: Ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const IN_QUAD: Ease = (t) => t * t;
export const SINE_IN_OUT: Ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
/**
 * Stands in for `withSpring(0, WOBBLE)`: settles past the target and rings
 * down. Not the app's spring solved exactly - a wobble the eye reads as the
 * same gesture, which is all this one is asked to be.
 */
export const SPRING: Ease = (t) => 1 - Math.exp(-6 * t) * Math.cos(t * 7.6);
/** How long the SPRING ease is given to ring down. */
export const SPRING_MS = 620;

type Seg = { t0: number; t1: number; from: number; to: number; ease: Ease };

/**
 * One animated value with a queue behind it.
 *
 * Stands in for a Reanimated shared value driven by `withSequence` /
 * `withDelay`: moves are queued ahead of time and the whole track is sampled
 * once per frame, so nothing has to fire on a timer.
 */
export class Track {
  private segs: Seg[] = [];
  private head: number;
  private base: number;

  constructor(value = 0, now = 0) {
    this.base = value;
    this.head = now;
  }

  /** The value the queue ends on. */
  private get tail(): number {
    return this.segs.length ? this.segs[this.segs.length - 1].to : this.base;
  }

  /** Drop everything queued and start again from where the track is now. */
  cut(now: number): this {
    const here = this.at(now);
    this.segs = [];
    this.base = here;
    this.head = now;
    return this;
  }

  delay(ms: number): this {
    this.head += ms;
    return this;
  }

  to(target: number, ms: number, ease: Ease = IN_OUT): this {
    this.segs.push({ t0: this.head, t1: this.head + ms, from: this.tail, to: target, ease });
    this.head += ms;
    return this;
  }

  spring(target: number): this {
    return this.to(target, SPRING_MS, SPRING);
  }

  /** Where the track is at `now`, and a prune of everything long finished. */
  at(now: number): number {
    let v = this.base;
    let settled = 0;
    for (let i = 0; i < this.segs.length; i++) {
      const s = this.segs[i];
      if (now <= s.t0) break;
      if (now >= s.t1) {
        v = s.to;
        settled = i + 1;
        continue;
      }
      const t = (now - s.t0) / (s.t1 - s.t0);
      v = s.from + (s.to - s.from) * s.ease(t);
      break;
    }
    if (settled > 0) {
      this.base = this.segs[settled - 1].to;
      this.segs = this.segs.slice(settled);
    }
    return v;
  }

  /** True when there is nothing left to play. */
  idle(now: number): boolean {
    return now >= this.head;
  }
}

// ---- the moves -----------------------------------------------------------

/** A blink. `slow` is the night-time one; the app's durations exactly. */
export function queueBlink(lid: Track, now: number, slow = false, delay = 0): void {
  lid
    .cut(now)
    .delay(delay)
    .to(1, slow ? 170 : 70, OUT);
  lid.delay(slow ? 170 : 45).to(0, slow ? 320 : 130, IN_OUT);
}

export function queueDoubleBlink(lid: Track, now: number): void {
  lid.cut(now).to(1, 70, OUT);
  lid.delay(40).to(0, 110, IN_OUT);
  lid.delay(100).to(1, 70, OUT);
  lid.delay(40).to(0, 140, IN_OUT);
}

/** Look at a point, hold it, then come back. */
export function queueLookAt(
  gazeX: Track,
  gazeY: Track,
  now: number,
  x: number,
  y: number,
  holdMs = 1200,
): void {
  gazeX.cut(now).to(x, 240, OUT).delay(holdMs).to(0, 520, IN_OUT);
  gazeY.cut(now).to(y, 240, OUT).delay(holdMs).to(0, 520, IN_OUT);
}

export function queueHop(hop: Track, squash: Track, now: number, height: number): void {
  hop.cut(now).to(-height, 170, OUT).to(0, 190, IN_QUAD);
  squash.cut(now).to(0.07, 150, OUT).delay(150).to(-0.09, 70).spring(0);
}

export function queueStretch(squash: Track, heat: Track, now: number): void {
  squash.cut(now).to(0.13, 320, OUT).spring(0);
  heat.cut(now).to(0.3, 320, OUT).to(0, 880, IN_OUT);
}

export function queueShiver(shake: Track, now: number): void {
  shake.cut(now).to(1, 50).to(-1, 50).to(0.8, 50).to(-0.8, 50).to(0.5, 50).to(-0.5, 50).to(0, 80);
}

export function queueStir(scatter: Track, now: number): void {
  scatter.cut(now).to(0.35, 260, OUT).to(0, 1040, IN_OUT);
}

/** The ring a click sends across the body: 0 is new, 1 is gone. */
export function queueRipple(ripple: Track, now: number): void {
  ripple.cut(now).to(0, 0).to(1, 900, OUT);
}

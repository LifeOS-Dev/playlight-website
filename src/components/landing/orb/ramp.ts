/**
 * Amber accent ramp - verbatim from los_client AMBER_RAMP / store-assets theme.
 * White essence stays untinted; accent lives outside as ring + aura + corona.
 */
export const AMBER_RAMP = {
  core: "#FFFFFF",
  hot: "#FFF588",
  bright: "#FFC95C",
  base: "#FFA32B",
  deep: "#D97A06",
  border: "#D35400",
  pale: "#FFD58C",
} as const;

/**
 * Structural, not `typeof AMBER_RAMP` - that pins every field to the
 * literal amber hex and no other ramp can satisfy it.
 */
export type AccentRamp = {
  readonly core: string;
  readonly hot: string;
  readonly bright: string;
  readonly base: string;
  readonly deep: string;
  readonly border: string;
  readonly pale: string;
};

/**
 * The four ramps the gate offers beside amber. Same shape as AMBER_RAMP,
 * so choosing one is a single object swap - no other code changes.
 *
 * `angle` is where the hue sits around the orb, in the usual maths
 * convention (counter-clockwise from +x). CSS conic gradients run
 * clockwise from twelve o'clock, so the two relate by phi = 90 - angle;
 * the stop positions in PRISM_CONIC below are derived from these. Move a
 * hue here and you must move its stop there, or the colour you point at
 * stops matching the colour you see.
 */
export const AQUA_RAMP = {
  core: "#FFFFFF",
  hot: "#C6FFF4",
  bright: "#6CEEDC",
  base: "#2FDCC4",
  deep: "#109C89",
  border: "#0B6E52",
  pale: "#9DF3E7",
} as const satisfies AccentRamp;

export const AZURE_RAMP = {
  core: "#FFFFFF",
  hot: "#CFE2FF",
  bright: "#86B4FF",
  base: "#4C8DFF",
  deep: "#2A5FD0",
  border: "#0F4E8A",
  pale: "#B3D0FF",
} as const satisfies AccentRamp;

export const IRIS_RAMP = {
  core: "#FFFFFF",
  hot: "#E3D6FF",
  bright: "#BFA0FF",
  base: "#9B6BFF",
  deep: "#6B3FD4",
  border: "#422F9B",
  pale: "#D2C0FF",
} as const satisfies AccentRamp;

export const ORCHID_RAMP = {
  core: "#FFFFFF",
  hot: "#FFD4F0",
  bright: "#F992DC",
  base: "#F35BC8",
  deep: "#C02D97",
  border: "#9E2544",
  pale: "#FBB8E6",
} as const satisfies AccentRamp;

export type VibeId = "aqua" | "azure" | "iris" | "orchid" | "amber";

export type Vibe = {
  id: VibeId;
  /** Shown under the orb. Deliberately just a colour name - no adjective,
      so the choice is made on instinct rather than on agreeing with a word. */
  name: string;
  ramp: AccentRamp;
  /** Degrees, counter-clockwise from +x. See PRISM_CONIC. */
  angle: number;
  /**
   * OKLCH hue of `ramp.base`, measured not guessed. pl3.css paints its
   * horizon, lightfall and travel smear in oklch, and they follow this so
   * the whole world takes the temperature of the chosen light.
   */
  hue: number;
  /**
   * Degrees for CSS `hue-rotate`, to swing the baked-amber app
   * screenshots onto this light. Measured as the HSL hue delta from
   * amber - HSL, not OKLCH, because the filter is a matrix approximating
   * an HSL rotation. Neutrals have no chroma to rotate, so the white orb
   * core and the UI text in those shots stay exactly as they are.
   */
  shift: number;
};

export const VIBES: readonly Vibe[] = [
  { id: "aqua", name: "Aqua", ramp: AQUA_RAMP, angle: 110, hue: 181, shift: 138 },
  { id: "azure", name: "Azure", ramp: AZURE_RAMP, angle: 38, hue: 261, shift: -176 },
  { id: "iris", name: "Iris", ramp: IRIS_RAMP, angle: 326, hue: 295, shift: -135 },
  { id: "orchid", name: "Orchid", ramp: ORCHID_RAMP, angle: 254, hue: 341, shift: -77 },
  { id: "amber", name: "Amber", ramp: AMBER_RAMP, angle: 182, hue: 67, shift: 0 },
] as const;

export const DEFAULT_VIBE: VibeId = "amber";

export const vibeById = (id: string | null | undefined): Vibe =>
  VIBES.find((v) => v.id === id) ?? VIBES[VIBES.length - 1];

/**
 * Every hue at once, as one gradient. Stops sit at 0/20/40/60/80% to match
 * the VIBES angles above via phi = 90 - angle, starting from -20deg.
 *
 * `--prism-spin` turns the spectrum inside the orb without turning the orb.
 * Only the gate's wheel sets it - everywhere else it resolves to 0deg and
 * this is the same gradient it has always been.
 */
export const PRISM_CONIC =
  "conic-gradient(from calc(-20deg + var(--prism-spin, 0deg)) at 50% 50%," +
  "#2FDCC4 0%,#4C8DFF 20%,#9B6BFF 40%,#F35BC8 60%,#FFA32B 80%,#2FDCC4 100%)";

/**
 * The same spectrum unrolled: aqua at the left edge, amber at the right,
 * the other three evenly between. The conic runs a sixth further so it can
 * close on itself; a straight bar has no seam to hide, so it stops at amber
 * and the five stops land on clean quarters.
 */
export const PRISM_LINEAR =
  "linear-gradient(90deg," + "#2FDCC4 0%,#4C8DFF 25%,#9B6BFF 50%,#F35BC8 75%,#FFA32B 100%)";

/** How much of the circle the unrolled bar covers - four gaps of 72deg. */
const SPREAD = 288;

/** Position along the bar (0..1) -> the orb angle standing at it. */
export const angleForT = (t: number) => 110 - SPREAD * t;

/** And back, for putting the thumb on a colour rather than a colour on the thumb. */
export function tForAngle(deg: number): number {
  let d = (110 - deg) % 360;
  if (d < 0) d += 360;
  return Math.min(1, d / SPREAD);
}

/**
 * The spin that brings `deg` to the top of the orb, chosen from the
 * infinitely many that would (they differ by whole turns) as the one
 * nearest `from` - so the wheel takes the short way round rather than
 * unwinding three turns to reach the neighbour it is already beside.
 */
export function spinFor(deg: number, from = 0): number {
  let s = deg - 90;
  while (s - from > 180) s -= 360;
  while (s - from < -180) s += 360;
  return s;
}

/** RGB triples of the PRISM_CONIC stops, for sampling the hue at an angle. */
const CONIC_STOPS: Array<[pos: number, rgb: [number, number, number]]> = [
  [0, [47, 220, 196]],
  [0.2, [76, 141, 255]],
  [0.4, [155, 107, 255]],
  [0.6, [243, 91, 200]],
  [0.8, [255, 163, 43]],
  [1, [47, 220, 196]],
];

/**
 * The colour the orb actually shows at `angle`, interpolated between stops.
 * The torch uses this so the light leaving the rim is the same hue as the
 * rim it leaves from, rather than the nearest named vibe.
 */
function sampleConic(angle: number): [number, number, number] {
  const phi = 90 - angle;
  const p = ((((phi + 20) / 360) % 1) + 1) % 1;
  for (let i = 0; i < CONIC_STOPS.length - 1; i++) {
    const [p0, a] = CONIC_STOPS[i];
    const [p1, b] = CONIC_STOPS[i + 1];
    if (p >= p0 && p <= p1) {
      const t = (p - p0) / (p1 - p0);
      const mix = (x: number, y: number) => Math.round(x + (y - x) * t);
      return [mix(a[0], b[0]), mix(a[1], b[1]), mix(a[2], b[2])];
    }
  }
  return CONIC_STOPS[0][1];
}

export function hueAtAngle(angle: number): string {
  return `rgb(${sampleConic(angle).join(",")})`;
}

/**
 * The same colour as a bare "r g b" triple, for anything that needs to
 * vary its alpha.
 *
 * The torch used to do that with color-mix(). The production CSS
 * pipeline compiles color-mix() into a flat, fully opaque fallback plus
 * an @supports block carrying the real thing - and any browser that
 * fails that test gets the fallback, which for the beam meant a solid
 * wedge with hard edges instead of a feathered one. A plain rgb() with a
 * slash alpha needs no fallback and cannot be compiled into one.
 */
export const hueTripleAtAngle = (angle: number): string => sampleConic(angle).join(" ");

/** A ramp colour as the same bare triple. */
export const tripleOf = (hex: string): string => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

/** Shortest signed distance between two angles, in degrees. */
export const angleDelta = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/** Index of the VIBE whose angle is nearest `deg`. */
export function nearestVibe(deg: number): number {
  let best = 0;
  let bestD = Infinity;
  VIBES.forEach((v, i) => {
    const d = angleDelta(deg, v.angle);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** App layer diameters (Orb.tsx). */
export const ORB_BOX = 200;
export const ESSENCE = 168;
export const AURA = 300;
export const CORONA = 400;
export const WISP = 320;
export const CORE = 48;

export const SCALE_MIN = 0.6;
export const SCALE_MAX = 1.1;

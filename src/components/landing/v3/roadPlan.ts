import type { FacetId } from "./faces";

/**
 * Where each life facet sits around the light at rest.
 *
 * This is the first viewport: everything about you, visible at once, ringed
 * around the orb on the road. They are NOT revealed one at a time; a queue
 * would argue against the very claim the page is making. The reveal is the
 * journey, not the arrangement.
 *
 * The ring is described by a bearing in degrees, clockwise from twelve
 * o'clock. Two seats are deliberately empty: the top, where the light's own
 * line is spoken, and the bottom, where the road carries on. So the eight sit
 * at 30/72/108/150 and their mirrors - a ring with its lid open, not a clock
 * face.
 *
 * Reading down the left: mind, personality, health - the inner life. Down the
 * right: goals, work, wealth - what you are building. Time and people take the
 * base, because everything else runs through them.
 */
const RING: Array<{ id: FacetId; deg: number }> = [
  { id: "goals", deg: 30 },
  { id: "work", deg: 72 },
  { id: "wealth", deg: 108 },
  { id: "time", deg: 150 },
  { id: "people", deg: 210 },
  { id: "health", deg: 252 },
  { id: "personality", deg: 288 },
  { id: "mind", deg: 330 },
];

/**
 * How far the ring's top edge leans away down the road, in px of depth. The
 * ring is not a decal on the glass: its base is nearer the camera than its
 * crown, which is what gives the near facets their extra weight and staggers
 * the order they fly past in.
 */
const RING_TILT = 90;

export type FacetPlace = {
  id: FacetId;
  /** Unit offsets on the ring: multiplied by --ring-rx / --ring-ry in CSS. */
  ux: number;
  uy: number;
  /** Depth in px - negative is further down the road. */
  z: number;
  /**
   * Perspective undo. A facet at depth z is projected toward the vanishing
   * point by persp / (persp - z), so its laid-out offset is pre-divided by
   * that to land back on a true ellipse. The ring centre and the perspective
   * origin are the same point - the orb - which is what makes this a plain
   * radial scale rather than a shear.
   */
  k: number;
};

/** Perspective depth of the road's 3D layers - must match road.css. */
export const PERSP = 900;

export const FACET_PLACES: FacetPlace[] = RING.map(({ id, deg }) => {
  const a = (deg * Math.PI) / 180;
  const z = -RING_TILT * Math.cos(a);
  return {
    id,
    ux: Number(Math.sin(a).toFixed(4)),
    uy: Number((-Math.cos(a)).toFixed(4)),
    z: Number(z.toFixed(1)),
    k: Number(((PERSP - z) / PERSP).toFixed(4)),
  };
});

/** Depth at which a card has passed the camera and should be gone. */
export const CAMERA_Z = 620;
/** How far the camera travels while the facets fly past. */
export const DEPART_TRAVEL = 1400;

/**
 * Where the light sits on the road, in vh (y) and % (horizon).
 *
 * After the hero flies, it settles on a composed cruise - a little above
 * the old floor-hugging pose, still sitting on the grid. That cruise is
 * the path for the rest of the journey. A problem/answer card is the only
 * thing that pulls it down onto the near road; once the card has passed,
 * it returns.
 */
export const LIGHT = {
  heroY: 70,
  heroSize: 0.84,
  heroHorizon: 70,
  /** Empty-road frame: lower third, horizon raised so the orb stays on the floor. */
  cruiseY: 66,
  cruiseSize: 0.82,
  cruiseHorizon: 58,
  /** While a problem/answer owns the middle, the light yields to the near road. */
  readY: 78,
  readSize: 0.56,
} as const;

/**
 * The depth at which something renders at `s` times its natural size.
 *
 * Depth is driven from apparent size rather than sliding z directly: screen
 * size goes as 1/z, so an even slide in z crawls while it is far away and
 * then arrives in a rush. Solving the other way round gives an approach that
 * reads at one steady speed the whole way in.
 */
export const zForScale = (s: number) => (-PERSP * (1 - s)) / s;

/**
 * One station, in its own local time (0 → 1 of its slot).
 *
 * A point of light shows up at the vanishing point, above the orb and far
 * down the road. It grows into a card carrying one numbered problem, holds
 * long enough to be read, and then the light sweeps across it and the problem
 * renders into its answer. The card passes the camera, and by then the next
 * point of light is already out there.
 *
 * Hold the problem a beat longer than the answer: landing on the feeling
 * is the job; the wipe is the relief.
 */
export const STATION = {
  /** the signal is already on the road before the slot formally opens */
  sigIn: -0.1,
  sigPeak: 0.02,
  /** by here the card has taken over and the point of light is spent */
  sigOut: 0.18,
  /** apparent size the moment the card separates from the signal */
  bornScale: 0.12,
  /** card grows out of the vanishing point into reading position */
  arrive: 0.22,
  /** the sweep: problem renders into answer */
  turnFrom: 0.5,
  turnTo: 0.68,
  /** and away past the camera */
  passFrom: 0.88,
} as const;

export const PHASE = {
  /** facets + hero fly past the camera */
  depart: 0.14,
  /** six numbered stations share the middle */
  stations: 0.76,
  /** closing line */
  philosophy: 0.1,
} as const;

/** Extra screens of scroll so six stations each get a full read. */
export const STAGE_SCREENS = 12;

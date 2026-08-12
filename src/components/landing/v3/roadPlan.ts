import type { FacetId } from "./faces";

/**
 * Where each life facet sits around the light at rest.
 *
 * This is the first viewport: everything about you, visible at once, arranged
 * around the orb on the road - the composition from the design brief's sketch.
 * They are NOT revealed one at a time; a queue would argue against the very
 * claim the page is making. The reveal is the journey, not the arrangement.
 *
 * x / y are percentages of the stage. z is depth in px - negative is further
 * down the road. Scrolling adds to z, which is what flies them past the camera.
 */
export type FacetPlace = {
  id: FacetId;
  x: number;
  y: number;
  z: number;
  /** Yaw, so each card hinges to face the road rather than lying flat */
  ry: number;
  rx: number;
  /**
   * Where this card sits on a phone. Eight cards cannot ring an orb inside
   * 375px without colliding, so only four make the cut - the rest stand down
   * rather than being shrunk past legibility.
   */
  mobile?: { x: number; y: number };
};

export const FACET_PLACES: FacetPlace[] = [
  // Spacing rule: neighbours on the same side must clear each other either
  // vertically (more than a card's height apart) or horizontally (more than a
  // card's width). Depth alone does not separate them - perspective barely
  // shrinks a card over this range, so overlaps have to be solved in x/y.

  // far pair - smallest, tucked either side of the wordmark
  { id: "notes", x: 30, y: 45, z: -300, ry: 40, rx: 7 },
  { id: "mind", x: 70, y: 46, z: -320, ry: -40, rx: 7 },
  // mid pair - pushed to the outer edges
  { id: "health", x: 12, y: 52, z: -150, ry: 34, rx: 6, mobile: { x: 27, y: 45 } },
  { id: "wealth", x: 88, y: 50, z: -160, ry: -34, rx: 6, mobile: { x: 73, y: 44 } },
  // near pair - still outboard, a clear drop below the mid pair
  { id: "work", x: 11, y: 74, z: -40, ry: 28, rx: 4, mobile: { x: 27, y: 76 } },
  { id: "people", x: 89, y: 72, z: -50, ry: -28, rx: 4, mobile: { x: 73, y: 75 } },
  // closest pair - swung inward and low, flanking the light on the road
  { id: "habits", x: 34, y: 84, z: 40, ry: 22, rx: 2 },
  { id: "time", x: 66, y: 83, z: 30, ry: -22, rx: 2 },
];

/** Depth at which a card has passed the camera and should be gone. */
export const CAMERA_Z = 620;
/** How far the camera travels while the facets fly past. */
export const DEPART_TRAVEL = 1400;

/**
 * Where the light sits on the road, in vh (y) and % (horizon).
 *
 * After the hero flies, it settles on a composed cruise - a little above
 * the old floor-hugging pose, still sitting on the grid. That cruise is
 * the path for the rest of the journey. A station (the point of light,
 * then the card) is the only thing that pulls it down onto the near road;
 * once the card has passed, it returns.
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

/** Perspective depth of the road's 3D layers - must match road.css. */
export const PERSP = 900;

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

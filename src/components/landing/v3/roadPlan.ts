import type { FacetId } from "./faces";

/**
 * Where each life facet sits around the light at rest.
 *
 * This is the first viewport: everything about you, visible at once, arranged
 * around the orb on the road — the composition from the design brief's sketch.
 * They are NOT revealed one at a time; a queue would argue against the very
 * claim the page is making. The reveal is the journey, not the arrangement.
 *
 * x / y are percentages of the stage. z is depth in px — negative is further
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
   * 375px without colliding, so only four make the cut — the rest stand down
   * rather than being shrunk past legibility.
   */
  mobile?: { x: number; y: number };
};

export const FACET_PLACES: FacetPlace[] = [
  // Spacing rule: neighbours on the same side must clear each other either
  // vertically (more than a card's height apart) or horizontally (more than a
  // card's width). Depth alone does not separate them — perspective barely
  // shrinks a card over this range, so overlaps have to be solved in x/y.

  // far pair — smallest, tucked either side of the wordmark
  { id: "notes", x: 30, y: 45, z: -300, ry: 40, rx: 7 },
  { id: "mind", x: 70, y: 46, z: -320, ry: -40, rx: 7 },
  // mid pair — pushed to the outer edges
  { id: "health", x: 12, y: 52, z: -150, ry: 34, rx: 6, mobile: { x: 27, y: 45 } },
  { id: "wealth", x: 88, y: 50, z: -160, ry: -34, rx: 6, mobile: { x: 73, y: 44 } },
  // near pair — still outboard, a clear drop below the mid pair
  { id: "work", x: 11, y: 74, z: -40, ry: 28, rx: 4, mobile: { x: 27, y: 76 } },
  { id: "people", x: 89, y: 72, z: -50, ry: -28, rx: 4, mobile: { x: 73, y: 75 } },
  // closest pair — swung inward and low, flanking the light on the road
  { id: "habits", x: 34, y: 84, z: 40, ry: 22, rx: 2 },
  { id: "time", x: 66, y: 83, z: 30, ry: -22, rx: 2 },
];

/** Depth at which a card has passed the camera and should be gone. */
export const CAMERA_Z = 620;
/** How far the camera travels while the facets fly past. */
export const DEPART_TRAVEL = 1400;

/** Perspective depth of the road's 3D layers — must match road.css. */
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
 * down the road. It grows into a card carrying one problem, holds long
 * enough to be read, and then the light sweeps across it and the problem
 * renders into its answer. The card passes the camera, and by then the next
 * point of light is already out there.
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
  arrive: 0.26,
  /** the sweep: problem renders into answer */
  turnFrom: 0.45,
  turnTo: 0.64,
  /** and away past the camera */
  passFrom: 0.87,
} as const;

export const PHASE = {
  /** facets + hero fly past the camera */
  depart: 0.18,
  /** four stations share the middle */
  stations: 0.7,
  /** closing line */
  philosophy: 0.12,
} as const;

export const STAGE_SCREENS = 8.5;

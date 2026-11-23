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
 * After the hero flies, the light settles onto the road - down and slightly
 * smaller, the far end of the journey opening above it. When the VIN cards
 * arrive it drops onto the near road beneath them, because from there on it
 * is the one doing the talking: its words sit on its crown, between it and
 * the card.
 *
 * The poses are deliberately close together. A 12vh plunge every time a card
 * arrived, six times over, was the single most restless thing on an earlier
 * version of this page.
 */
export const LIGHT = {
  heroY: 64,
  heroSize: 0.92,
  heroHorizon: 64,
  /**
   * Empty-road frame, and the pose the whole journey is measured from.
   *
   * The orb has to sit BELOW the skyline. At 66/0.82 its crown reached y=488
   * in a 900px frame while the horizon was at 522 - the light broke the
   * horizon line, so it read as hanging in the sky rather than travelling on
   * the floor, and everything born at the vanishing point (the point of light,
   * the bottom edge of an arriving card) was drawn straight across its face.
   * Dropping it to 72/0.80 puts the crown at 544, under the horizon and under
   * the lowest edge a card ever reaches. The composition stops overlapping
   * before any of the motion is asked to fix it.
   */
  cruiseY: 68,
  cruiseSize: 0.88,
  cruiseHorizon: 58,
  /**
   * Under the VIN cards: low on the near road, where it speaks from. It leans
   * back; it does not shrink away - an earlier version took a reading pose
   * to 0.56 and turned the protagonist into a bead pinched under a card.
   * Depth is read from the gap above the orb, not from how small it gets.
   *
   * vin.css sizes the card off this pose (--vin-orb-y / --vin-orb-s): change
   * one, change the other.
   */
  vinY: 82,
  vinSize: 0.64,
  /**
   * Under the "what it solves" collage. Nothing to say here, so the light
   * steps further back and gives the tiles the frame; solve.css sizes the
   * collage off this pose (--slv-orb-y / --slv-orb-s).
   */
  solveY: 91,
  solveSize: 0.5,
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
 * Everything on the road after the hero, measured in screens of scroll
 * travelled (one screen = one viewport height). Counting in screens rather
 * than as fractions of the whole pin means adding a beat to the road never
 * silently re-times every beat before it.
 *
 * The hero flies. A point of light shows on the horizon and three cards grow
 * out of it - Visualize, Interpret, Navigate - standing together. Then one
 * band of scroll per state: the three fold into one card, and that card shows
 * everything about you, joins three of those things into an insight, and
 * stands them up as steps. As it passes the camera, what all of that solves
 * comes up the road behind it as one collage. Then the road opens.
 *
 * The VIN bands are long on purpose. The change between states plays as a
 * timed transformation the moment a threshold is crossed, so the scroll only
 * has to decide WHICH state you are in - and a reader needs time on each one
 * for the light to finish speaking.
 */
export const ROAD = {
  /** facets + hero fly past the camera */
  depart: 1.2,
  vin: {
    /** The point of light the three cards are born out of. */
    sigIn: 0.7,
    sigPeak: 1.15,
    sigOut: 1.7,
    /** The three grow out of the horizon into place. */
    arriveFrom: 1.1,
    arriveTo: 2.1,
    /** Apparent size the moment the cards separate from the point of light. */
    bornScale: 0.12,
    /** Where each state takes over. Before `v`, the three stand together. */
    v: 3.0,
    i: 4.6,
    n: 6.2,
    /** Navigate is the last word, so it holds the longest - then away. */
    passFrom: 8.0,
    passTo: 8.75,
  },
  /**
   * What it solves: five tiles, composed at once and never queued. They come
   * out of the horizon as the VIN card is in its last moments past the
   * camera - late enough that the card's large, near words are already gone,
   * early enough that the road is never empty between the two.
   */
  solve: {
    arriveFrom: 8.45,
    arriveTo: 9.5,
    /** Each tile starts this much later than the one before, in arrival time. */
    stagger: 0.07,
    /**
     * Then the focus walks the tiles one at a time, this many screens each,
     * and once all five have had a turn the whole collage holds as one
     * picture until it passes.
     */
    focusFrom: 9.4,
    focusEvery: 0.42,
    passFrom: 12.0,
    passTo: 12.8,
  },
  /** The closing line, as the collage goes. */
  closeFrom: 12.4,
} as const;

/** Screens of scroll the pinned road lasts beyond its first. */
export const STAGE_SCREENS = 14;

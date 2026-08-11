import type { FacetId } from "./faces";

export type JourneyBeat = {
  id: FacetId;
  side: "left" | "right";
  /** Short line under the label — felt, not feature jargon */
  line: string;
  /** Orb horizontal rest (0–1 of viewport) while this beat owns the stage */
  orbX: number;
  /** Orb vertical rest while this beat owns the stage */
  orbY: number;
};

/**
 * The light walks the grid. Facets appear left / right as it passes —
 * a literal reading of “visualize and navigate your life.”
 */
export const JOURNEY: JourneyBeat[] = [
  {
    id: "health",
    side: "left",
    line: "Energy, rest, the body you move through the day.",
    orbX: 0.58,
    orbY: 0.46,
  },
  {
    id: "work",
    side: "right",
    line: "Projects stacked in time — what you’re building now.",
    orbX: 0.4,
    orbY: 0.5,
  },
  {
    id: "wealth",
    side: "left",
    line: "Money as trajectory, not a tab you avoid.",
    orbX: 0.6,
    orbY: 0.44,
  },
  {
    id: "people",
    side: "right",
    line: "The relationships that hold your context.",
    orbX: 0.38,
    orbY: 0.52,
  },
  {
    id: "habits",
    side: "left",
    line: "Practice rings — most days, not every day.",
    orbX: 0.62,
    orbY: 0.48,
  },
  {
    id: "mind",
    side: "right",
    line: "Attention, clarity, the quieter inner weather.",
    orbX: 0.42,
    orbY: 0.46,
  },
  {
    id: "time",
    side: "left",
    line: "Where the hours actually went.",
    orbX: 0.58,
    orbY: 0.54,
  },
  {
    id: "notes",
    side: "right",
    line: "Thoughts that stay findable when you need them.",
    orbX: 0.5,
    orbY: 0.42,
  },
];

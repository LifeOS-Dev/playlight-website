import type { FacetId } from "./faces";

/**
 * Facet glyphs - hairline instrument diagrams, not icon-library pictograms.
 * Each is 24×24, stroke-only, so the light decides how bright it reads.
 */

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      {children}
    </svg>
  );
}

const GLYPHS: Record<FacetId, React.ReactNode> = {
  // a breath - rise, hold, fall
  health: (
    <Frame>
      <path {...S} d="M2 15c3 0 3.4-7 6-7s2.8 10 5.4 10S16.6 9 19 9h3" />
    </Frame>
  ),
  // accumulation, plotted
  wealth: (
    <Frame>
      <path {...S} d="M3 20h18" opacity={0.5} />
      <path {...S} d="M6 20v-4M11 20v-8M16 20v-5M21 20v-11" />
    </Frame>
  ),
  // projects, overlapping in time
  work: (
    <Frame>
      <rect {...S} x="3" y="6" width="12" height="5" rx="1" />
      <rect {...S} x="8" y="13" width="13" height="5" rx="1" />
    </Frame>
  ),
  // two orbits that intersect
  people: (
    <Frame>
      <circle {...S} cx="9" cy="12" r="6" />
      <circle {...S} cx="15" cy="12" r="6" />
    </Frame>
  ),
  // the same shape at every scale - a print, not a portrait
  personality: (
    <Frame>
      <path {...S} d="M19.4 4.6A10.5 10.5 0 1 0 19.4 19.4" opacity={0.45} />
      <path {...S} d="M17 7.1A7 7 0 1 0 17 16.9" opacity={0.7} />
      <path {...S} d="M14.5 9.5A3.6 3.6 0 1 0 14.5 14.5" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
    </Frame>
  ),
  // an allocation, not a clock face
  time: (
    <Frame>
      <circle {...S} cx="12" cy="12" r="8.5" opacity={0.55} />
      <path {...S} d="M12 3.5A8.5 8.5 0 0 1 20.5 12H12z" />
    </Frame>
  ),
  // a bearing, and the thing you are steering toward
  goals: (
    <Frame>
      <circle {...S} cx="12" cy="12" r="8.5" opacity={0.5} />
      <circle {...S} cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path {...S} d="M4.5 19.5 9.2 14.8" opacity={0.8} />
    </Frame>
  ),
  // attention radiating from a centre
  mind: (
    <Frame>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path {...S} d="M12 12a6 6 0 0 1 6-6" opacity={0.8} />
      <path {...S} d="M12 12a9.5 9.5 0 0 0-9.5 9.5" opacity={0.45} />
      <path {...S} d="M12 12a5 5 0 0 0-5 5" opacity={0.65} />
    </Frame>
  ),
};

export function FacetGlyph({ id }: { id: FacetId }) {
  return <>{GLYPHS[id]}</>;
}

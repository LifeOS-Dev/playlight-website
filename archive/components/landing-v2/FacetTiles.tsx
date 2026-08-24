import * as React from "react";
import { FACETS, type FacetId } from "./faces";
import { FacetGlyph } from "./glyphs";

/**
 * Eight facets of a life, scattered around the light the way they are
 * scattered around a day — loose and hand-placed, never in orbit.
 *
 * `--x/--y` are desktop centres, `--mx/--my` mobile. `--lit` is how much of
 * the orb's light reaches that tile; `--in` staggers the page-load reveal.
 */

type Placement = {
  id: FacetId;
  x: string;
  y: string;
  mx: string;
  my: string;
  rot: number;
  depth: number;
  lit: number;
  /** Four of the eight stand down on small screens */
  mobile: boolean;
};

const PLACEMENT: Placement[] = [
  { id: "notes", x: "11%", y: "46%", mx: "0%", my: "0%", rot: -13, depth: 0.86, lit: 0.34, mobile: false },
  { id: "habits", x: "28%", y: "37%", mx: "0%", my: "0%", rot: -5, depth: 0.94, lit: 0.62, mobile: false },
  { id: "work", x: "20%", y: "64%", mx: "17%", my: "40%", rot: -8, depth: 0.97, lit: 0.58, mobile: true },
  { id: "health", x: "14%", y: "81%", mx: "21%", my: "77%", rot: -11, depth: 0.88, lit: 0.38, mobile: true },
  { id: "people", x: "71%", y: "40%", mx: "0%", my: "0%", rot: 4, depth: 0.95, lit: 0.6, mobile: false },
  { id: "wealth", x: "80%", y: "62%", mx: "83%", my: "74%", rot: 8, depth: 0.96, lit: 0.55, mobile: true },
  { id: "time", x: "87%", y: "80%", mx: "0%", my: "0%", rot: 12, depth: 0.85, lit: 0.32, mobile: false },
  { id: "mind", x: "89%", y: "44%", mx: "79%", my: "38%", rot: 14, depth: 0.87, lit: 0.36, mobile: true },
];

const LABEL: Record<FacetId, string> = Object.fromEntries(
  FACETS.map((f) => [f.id, f.label]),
) as Record<FacetId, string>;

export function FacetTiles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      {PLACEMENT.map((p, n) => (
        <div
          key={p.id}
          className={`pl2-tile ${p.mobile ? "" : "pl2-tile--wide"}`}
          style={
            {
              "--x": p.x,
              "--y": p.y,
              "--mx": p.mx,
              "--my": p.my,
              "--rot": `${p.rot}deg`,
              "--depth": p.depth,
              "--lit": p.lit,
              "--in": `${520 + n * 90}ms`,
              "--float": `${9 + (n % 4) * 1.7}s`,
              "--float-delay": `${n * 0.55}s`,
            } as React.CSSProperties
          }
        >
          <span className="pl2-tile__card">
            <span className="pl2-tile__glyph">
              <FacetGlyph id={p.id} />
            </span>
            <span className="pl2-tile__label">{LABEL[p.id]}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

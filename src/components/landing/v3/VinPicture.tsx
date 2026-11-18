import * as React from "react";
import {
  HEART,
  HEART_AT,
  KEY_NODES,
  NODES,
  RINGS,
  STAGE_H,
  STAGE_W,
  STEP_LINE,
  WHEN_X,
  type VinNode,
  type VinStep,
} from "./vin";

type Props = {
  step: VinStep;
  /**
   * Drawn once, in a fixed state, with nothing to replay - the reduced-motion
   * column. The picture is the same; it simply never changes state.
   */
  still?: boolean;
};

type Pt = [number, number];

/** The start pose: a little further out than where it settles, so it arrives inward. */
const outward = ([x, y]: Pt, k = 1.22): Pt => [
  HEART[0] + (x - HEART[0]) * k,
  HEART[1] + (y - HEART[1]) * k,
];

const vars = (node: { v: Pt; i: Pt; n: Pt }, extra: Record<string, string | number> = {}) => {
  const o = outward(node.v);
  return {
    "--ox": o[0].toFixed(1),
    "--oy": o[1].toFixed(1),
    "--vx": node.v[0],
    "--vy": node.v[1],
    "--ix": node.i[0],
    "--iy": node.i[1],
    "--nx": node.n[0],
    "--ny": node.n[1],
    ...extra,
  } as React.CSSProperties;
};

/**
 * A curve from a to b that bows by `bend` of its length - filaments, not
 * wires. Positive bends to the left of travel.
 */
function bow(a: Pt, b: Pt, bend: number) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  return `M${a[0]} ${a[1]}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0]} ${b[1]}`;
}

const [owl, health, marathon] = [
  KEY_NODES.find((n) => n.id === "owl")!,
  KEY_NODES.find((n) => n.id === "health")!,
  KEY_NODES.find((n) => n.id === "marathon")!,
];

/** The three pieces, joined to each other: the pattern. */
const EDGES = [
  bow(owl.i, marathon.i, -0.08),
  bow(marathon.i, health.i, -0.1),
  bow(health.i, owl.i, -0.1),
];

/**
 * The Visualize -> Interpret -> Navigate card.
 *
 * Built in HTML over one SVG, in a 160 x 90 stage that scales with the card:
 * every position is in stage units and resolved against the card's own width
 * (container units), so the picture keeps its proportions at any size and the
 * words stay real text. CSS owns every transition - this component only says
 * which state it is in.
 */
export function VinPicture({ step, still = false }: Props) {
  return (
    <div className="vin-pic" data-step={step} data-still={still ? "" : undefined}>
      <div className="vin-pic__in">
        <svg
          className="vin-pic__svg"
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          aria-hidden="true"
          focusable="false"
        >
          {/* The aura: four filled orbits stacked, so the bands step brighter
              toward the heart - the mark's concentric light, laid down in
              perspective. */}
          <g className="vin-pic__bands">
            {RINGS.map((r, i) => (
              <ellipse
                key={r.kind}
                className="vin-pic__band"
                cx={HEART[0]}
                cy={HEART[1]}
                rx={r.rx}
                ry={r.ry}
                style={{ "--ring": i } as React.CSSProperties}
              />
            ))}
          </g>
          <g className="vin-pic__orbits">
            {RINGS.map((r, i) => (
              <ellipse
                key={r.kind}
                className="vin-pic__orbit"
                cx={HEART[0]}
                cy={HEART[1]}
                rx={r.rx}
                ry={r.ry}
                style={{ "--ring": i } as React.CSSProperties}
              />
            ))}
          </g>

          <g className="vin-pic__links">
            {EDGES.map((d, i) => (
              <path
                key={`e${i}`}
                className="vin-pic__edge"
                d={d}
                pathLength={1}
                style={{ "--j": i } as React.CSSProperties}
              />
            ))}
          </g>

          <line
            className="vin-pic__track"
            pathLength={1}
            x1={STEP_LINE.x}
            y1={STEP_LINE.y0}
            x2={STEP_LINE.x}
            y2={STEP_LINE.y1}
          />
        </svg>

        {NODES.map((node) => (
          <Node key={node.id} node={node} />
        ))}

        <div className="vin-heart" style={vars({ v: HEART_AT.v, i: HEART_AT.i, n: HEART_AT.n })}>
          {/* Replayed on every change of state: the bands fall into the
              heart and it flares - the mark's own gesture, and the only
              transition the card has. Nothing is wiped. */}
          {still ? null : <span key={step} className="vin-heart__aura" aria-hidden="true" />}
          <span key={`c-${step}`} className="vin-heart__core" aria-hidden="true" />
          <span className="vin-heart__you">You</span>
        </div>
      </div>
    </div>
  );
}

function Node({ node }: { node: VinNode }) {
  const style = vars(node, {
    "--ring": node.ring,
    // The "when" tag lines up on the card's right edge, wherever the step stands.
    ...(node.key ? { "--k": node.key.n, "--wx": WHEN_X - node.n[0] } : {}),
  });

  return (
    <div
      className="vin-node"
      data-kind={node.kind}
      data-key={node.key ? "" : undefined}
      data-first={node.key?.n === 1 ? "" : undefined}
      style={style}
    >
      <span className="vin-node__mark" aria-hidden="true" />

      {node.label ? (
        <span className="vin-node__label" data-side={node.side}>
          {node.label}
        </span>
      ) : null}

      {node.key ? (
        <>
          <span className="vin-node__read" data-above={node.key.above ? "" : undefined}>
            <span className="vin-node__read-name">{node.label}</span>
            <span className="vin-node__read-val">{node.key.readout}</span>
          </span>
          <span className="vin-node__step">{node.key.step}</span>
          <span className="vin-node__when">{node.key.when}</span>
        </>
      ) : null}
    </div>
  );
}

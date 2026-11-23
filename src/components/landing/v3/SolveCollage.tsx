import * as React from "react";
import { lightLook, lightSpeak } from "@/components/landing/orb/lightCue";
import { LINES, wordsOf } from "./narration";
import { SOLVES, type SolveKind } from "./vin";
import "./solve.css";

/** When a tile's line starts, after its drawing has mostly played (solve.css). */
const LINE_AT_MS = 700;
const LINE_EVERY_MS = 55;

export type SolveFrame = {
  /** Depth of each tile on the road, in px - one per tile, so they can stagger in. */
  z: number[];
  /** Opacity of each tile. */
  o: number[];
  /** Opacity of the title above them. */
  ui: number;
  /**
   * Which tile has the reader's attention: -1 before they land, 0-4 one tile,
   * and SOLVES.length once every one has had its turn.
   */
  focus: number;
};

export type SolveHandle = {
  drive: (frame: SolveFrame) => void;
  /** Where tile `i` is across the screen, in px - the light leans toward it. */
  tileCentre: (i: number) => number | null;
};

/**
 * What it solves - the five things the VIN model does for a life, as one
 * collage that comes up the road as the VIN card passes.
 *
 * All five are on screen together, so the reader always sees the whole and
 * how far through it they are - but only one has their attention at a time.
 * Scrolling moves the focus along: that tile lifts, its drawing plays once
 * from the problem into the answer (the VIN card's gesture - scattered things
 * gathering into the light), and its one line appears. Then it settles, keeps
 * its answer and its line, and the next one takes the focus - so by the end
 * all five read as one picture with their answers on it.
 *
 * The light narrates this too: it says what the collage is ("Here's what
 * changes for you."), each tile's line is in its voice, and while a tile is
 * in focus the light leans toward it on the road below and looks at it
 * (RoadJourney moves it; this asks it to look). The eye goes where the
 * light goes.
 */
export const SolveCollage = React.forwardRef<SolveHandle>(function SolveCollage(_props, ref) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const tileRefs = React.useRef<Array<HTMLElement | null>>([]);
  const shownRef = React.useRef(true);
  const focusRef = React.useRef(-2);
  /** The light only talks about the collage while its words are up. */
  const liveRef = React.useRef(false);
  const [live, setLive] = React.useState(false);
  const [focus, setFocus] = React.useState(-1);

  React.useImperativeHandle(
    ref,
    () => ({
      drive({ z, o, ui, focus }) {
        const root = rootRef.current;
        if (!root) return;
        tileRefs.current.forEach((tile, i) => {
          if (!tile) return;
          tile.style.transform = `translate3d(0, 0, ${(z[i] ?? 0).toFixed(1)}px)`;
          tile.style.opacity = (o[i] ?? 0).toFixed(3);
        });
        root.style.setProperty("--slv-ui", ui.toFixed(3));
        const nowLive = ui > 0.5;
        if (nowLive !== liveRef.current) {
          liveRef.current = nowLive;
          setLive(nowLive);
        }
        const shown = ui > 0.02 || o.some((n) => n > 0.02);
        if (shown !== shownRef.current) {
          shownRef.current = shown;
          root.style.visibility = shown ? "" : "hidden";
          root.toggleAttribute("aria-hidden", !shown);
        }
        if (focus !== focusRef.current) {
          focusRef.current = focus;
          tileRefs.current.forEach((tile, i) => {
            if (!tile) return;
            tile.dataset.state = focus < i ? "wait" : focus === i ? "on" : "done";
          });
          root.toggleAttribute("data-all", focus >= SOLVES.length);
          setFocus(focus);
        }
      },
      tileCentre(i) {
        const tile = tileRefs.current[i];
        if (!tile) return null;
        const r = tile.getBoundingClientRect();
        return r.width > 0 ? r.left + r.width / 2 : null;
      },
    }),
    [],
  );

  // Look at the tile in focus, and say its line as it appears. Once every
  // tile has had its turn, the light looks back over the whole collage.
  React.useEffect(() => {
    if (!live || focus < 0) {
      lightLook("solve", null);
      return;
    }
    if (focus >= SOLVES.length) {
      lightLook("solve", rootRef.current?.querySelector(".pl3-solve__grid") ?? null);
      return;
    }
    lightLook("solve", tileRefs.current[focus]);
    return lightSpeak(wordsOf(SOLVES[focus].line).length, {
      startMs: LINE_AT_MS,
      everyMs: LINE_EVERY_MS,
    });
  }, [live, focus]);

  React.useEffect(() => () => lightLook("solve", null), []);

  return (
    <section ref={rootRef} className="pl3-solve" aria-labelledby="pl3-solve-title">
      {/* The light's line over the collage - in its voice, not a heading's. */}
      <h2 id="pl3-solve-title" className="pl3-solve__title">
        {LINES.solve.intro}
      </h2>
      <div className="pl3-solve__grid">
        {SOLVES.map((s, i) => (
          <article
            key={s.kind}
            ref={(n) => {
              tileRefs.current[i] = n;
            }}
            className="pl3-solve__tile"
            data-k={s.kind}
            data-state="wait"
          >
            <div className="pl3-solve__art">
              <SolveArt kind={s.kind} />
            </div>
            <h3 className="pl3-solve__name">{s.title}</h3>
            <p className="pl3-solve__line">
              {wordsOf(s.line).map((w, j) => (
                <React.Fragment key={j}>
                  <span className="pl3-solve__w" style={{ "--w": j } as React.CSSProperties}>
                    {w}
                  </span>{" "}
                </React.Fragment>
              ))}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
});

type Pt = [number, number];

/** Scattered, then on an orbit around the heart: the load, then one place. */
const LOAD_MARKS: Array<{ from: Pt; to: Pt; shape: "dot" | "ring" | "square" }> = [
  { from: [12, 12], to: [39.3, 31.9], shape: "dot" },
  { from: [30, 60], to: [80.7, 40.1], shape: "dot" },
  { from: [48, 8], to: [52.5, 47.3], shape: "square" },
  { from: [72, 62], to: [45, 12.5], shape: "ring" },
  { from: [96, 10], to: [93.7, 19.9], shape: "dot" },
  { from: [108, 48], to: [98.1, 48.5], shape: "square" },
  { from: [16, 38], to: [21.9, 48.5], shape: "ring" },
  { from: [86, 32], to: [60, 61], shape: "dot" },
  { from: [104, 66], to: [18.7, 27.4], shape: "ring" },
];

/** The two orbits the load settles onto - the mark's bands, around you. */
const LOAD_ORBITS: Pt[] = [
  [44, 25],
  [22, 12],
];

/** Five parts of a life; the low one is the one lifted. */
const BARS: Array<{ x: number; h: number }> = [
  { x: 21, h: 0.72 },
  { x: 39, h: 0.8 },
  { x: 57, h: 0.28 },
  { x: 75, h: 0.76 },
  { x: 93, h: 0.66 },
];

/**
 * Iterating while moving forward: a prolate cycloid - every loop is a review,
 * and every loop ends further on than it started.
 */
const LONG_PATH = (() => {
  const r = 5.2;
  const d = 12;
  const cy = 38;
  const x0 = 14;
  const T = 5.2 * Math.PI;
  const n = 140;
  let path = "";
  for (let k = 0; k <= n; k++) {
    const t = (k / n) * T;
    const x = x0 + r * t - d * Math.sin(t);
    const y = cy - d * Math.cos(t);
    path += `${k === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return path;
})();
const LONG_END: Pt = [
  Number((14 + 5.2 * 5.2 * Math.PI - 12 * Math.sin(5.2 * Math.PI)).toFixed(1)),
  Number((38 - 12 * Math.cos(5.2 * Math.PI)).toFixed(1)),
];

/** A life sketched onto a blank canvas, left to right, toward what you want. */
const CANVAS_PATH = "M18 56C32 56 38 36 54 36S76 50 88 30S100 16 104 14";
const CANVAS_DOTS: Pt[] = (() => {
  const out: Pt[] = [];
  for (let x = 16; x <= 104; x += 11) for (let y = 13; y <= 60; y += 9.4) out.push([x, y]);
  return out;
})();

function SolveArt({ kind }: { kind: SolveKind }) {
  return (
    <svg viewBox="0 0 120 72" className="slv" data-k={kind} aria-hidden="true" focusable="false">
      {kind === "load" ? (
        <>
          {LOAD_ORBITS.map(([rx, ry]) => (
            <ellipse key={`b${rx}`} className="slv__band" cx={60} cy={36} rx={rx} ry={ry} />
          ))}
          {LOAD_ORBITS.map(([rx, ry]) => (
            <ellipse key={`o${rx}`} className="slv__orbit" cx={60} cy={36} rx={rx} ry={ry} />
          ))}
          {LOAD_MARKS.map((m, i) => (
            <g
              key={i}
              className="slv__mark"
              style={
                {
                  "--fx": m.from[0],
                  "--fy": m.from[1],
                  "--tx": m.to[0],
                  "--ty": m.to[1],
                  "--i": i,
                } as React.CSSProperties
              }
            >
              {m.shape === "dot" ? (
                <circle r={1.9} className="slv__fill" />
              ) : m.shape === "ring" ? (
                <circle r={2} className="slv__ring" />
              ) : (
                <rect x={-1.6} y={-1.6} width={3.2} height={3.2} rx={0.5} className="slv__sq" />
              )}
            </g>
          ))}
          <circle className="slv__heart" cx={60} cy={36} r={3.4} />
        </>
      ) : null}

      {kind === "ground" ? (
        <>
          {/* The road under your feet - the same floor the page is drawn on. */}
          <g className="slv__floor">
            <path d="M60 46L18 72M60 46L46 72M60 46L74 72M60 46L102 72" />
          </g>
          {/* A horizon a hard week has knocked off level - and the light
              setting it straight. (It used to be a jagged line flattened,
              which read as a heart monitor flatlining.) */}
          <line className="slv__tilt" x1={10} y1={46} x2={110} y2={46} />
          <ellipse className="slv__band" cx={60} cy={46} rx={20} ry={8} />
          <ellipse className="slv__band" cx={60} cy={46} rx={10} ry={4} />
          <circle className="slv__heart" cx={60} cy={46} r={3.4} />
        </>
      ) : null}

      {kind === "improve" ? (
        <>
          <line className="slv__base" x1={10} y1={62} x2={110} y2={62} />
          <line className="slv__target" x1={10} y1={27.7} x2={110} y2={27.7} />
          {BARS.map((b, i) => (
            <rect
              key={i}
              className="slv__bar"
              data-low={b.h < 0.5 ? "" : undefined}
              x={b.x}
              y={18}
              width={8}
              height={44}
              rx={1.6}
              style={{ "--h": b.h } as React.CSSProperties}
            />
          ))}
          <path className="slv__lift" d="M57 21L61 17L65 21" />
          {/* The one label: which part is low - the sleep the light says
              it is lifting first. */}
          <text className="slv__label" x={61} y={69.5} textAnchor="middle">
            Sleep
          </text>
        </>
      ) : null}

      {kind === "long" ? (
        <>
          <path className="slv__loop-ghost" d={LONG_PATH} />
          <path className="slv__loop" d={LONG_PATH} pathLength={1} />
          <path className="slv__bead" d={LONG_PATH} pathLength={1} />
          <circle className="slv__heart" cx={LONG_END[0]} cy={LONG_END[1]} r={3.2} />
        </>
      ) : null}

      {kind === "canvas" ? (
        <>
          <rect className="slv__frame" x={8} y={6} width={104} height={60} rx={3} />
          {CANVAS_DOTS.map(([x, y], i) => (
            <circle key={i} className="slv__grid" cx={x} cy={y} r={0.55} />
          ))}
          <path className="slv__stroke" d={CANVAS_PATH} pathLength={1} />
          <circle
            className="slv__node"
            cx={54}
            cy={36}
            r={2}
            style={{ "--i": 0 } as React.CSSProperties}
          />
          <circle
            className="slv__node"
            cx={88}
            cy={30}
            r={2}
            style={{ "--i": 1 } as React.CSSProperties}
          />
          <circle className="slv__goal" cx={104} cy={14} r={4.6} />
          <circle className="slv__heart" cx={104} cy={14} r={2.6} />
        </>
      ) : null}
    </svg>
  );
}

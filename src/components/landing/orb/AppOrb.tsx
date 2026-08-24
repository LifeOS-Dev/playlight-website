import { Fragment, type CSSProperties } from "react";
import {
  AMBER_RAMP,
  AURA,
  CORE,
  CORONA,
  ESSENCE,
  ORB_BOX,
  PRISM_CONIC,
  WISP,
  rgba,
  type AccentRamp,
} from "./ramp";

type Stop = [offset: number, color: string];

const stopList = (stops: Stop[]) =>
  stops.map(([o, c]) => `${c} ${(o * 100).toFixed(1)}%`).join(",");

/**
 * The radial gradient for one layer - ported from
 * scripts/store-assets/lib/orb.mjs. Box is padded by the cy offset so a
 * raised gradient centre never clips into a hard arc (the app lesson for
 * icon-size orbs).
 */
function layerBox(d: number, cy: number) {
  const r = d / 2;
  const offset = (0.5 - cy) * d;
  const box = 2 * (r + Math.abs(offset));
  const yPct = ((box / 2 - offset) / box) * 100;
  return { r, box, yPct };
}

const layerGradient = (d: number, cy: number, stops: Stop[]) => {
  const { r, yPct } = layerBox(d, cy);
  return `radial-gradient(circle ${r}px at 50% ${yPct.toFixed(3)}%,${stopList(stops)})`;
};

function layerStyle(d: number, cy: number, stops: Stop[]): CSSProperties {
  const { box } = layerBox(d, cy);
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: box,
    height: box,
    marginLeft: -box / 2,
    marginTop: -box / 2,
    background: layerGradient(d, cy, stops),
  };
}

/**
 * The same layer as a prism: the conic carries the hue, the layer's own
 * alpha profile becomes the mask, so its shape is identical to the
 * single-hue version it cross-fades with.
 */
function prismStyle(d: number, cy: number, profile: AStop[]): CSSProperties {
  const { box } = layerBox(d, cy);
  const m = layerGradient(d, cy, mask(profile));
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: box,
    height: box,
    marginLeft: -box / 2,
    marginTop: -box / 2,
    background: PRISM_CONIC,
    maskImage: m,
    WebkitMaskImage: m,
  };
}

const essenceStops = (): Stop[] => [
  [0, "rgba(255,255,255,1)"],
  [0.2, "rgba(255,255,255,.92)"],
  [0.44, "rgba(244,246,250,.5)"],
  [0.68, "rgba(232,236,244,.16)"],
  [0.9, "rgba(232,236,244,.02)"],
  [1, "rgba(232,236,244,0)"],
];

const coreStops = (): Stop[] => [
  [0, "rgba(255,255,255,1)"],
  [0.45, "rgba(255,255,255,.7)"],
  [1, "rgba(255,255,255,0)"],
];

/**
 * Accent layers as alpha profiles: [offset, alpha, ramp key].
 *
 * Split out from the colour so the SAME numbers can produce either the
 * single-hue layer (alpha applied to a ramp colour) or the prism layer's
 * mask (alpha applied to black, over a conic gradient). If these were two
 * separate stop lists they would drift apart and the spectrum would stop
 * matching the amber orb it is meant to be a variant of.
 */
type AStop = [offset: number, alpha: number, key?: keyof AccentRamp];

/** RING: 0-34% clear so the white heart is never tinted. */
const RING_A: AStop[] = [
  [0, 0],
  [0.34, 0],
  [0.46, 0.42, "bright"],
  [0.58, 0.82],
  [0.72, 0.55],
  [0.86, 0.26],
  [1, 0, "deep"],
];

const AURA_A: AStop[] = [
  [0, 0.74],
  [0.24, 0.44],
  [0.5, 0.2],
  [0.76, 0.07],
  [0.92, 0.02],
  [1, 0],
];

const CORONA_A: AStop[] = [
  [0, 0.24],
  [0.36, 0.1],
  [0.66, 0.035],
  [0.88, 0.01],
  [1, 0],
];

const wispA = (peak: number, key: keyof AccentRamp): AStop[] => [
  [0, peak, key],
  [0.3, peak * 0.45, key],
  [0.6, peak * 0.1, key],
  [1, 0, key],
];

/** Alpha profile -> single-hue colour stops. */
const solid = (p: AStop[], r: AccentRamp): Stop[] =>
  p.map(([o, a, key]) => [o, rgba(r[key ?? "base"], a)]);

/** Alpha profile -> mask stops, so a conic behind it keeps this shape. */
const mask = (p: AStop[]): Stop[] => p.map(([o, a]) => [o, `rgba(0,0,0,${a})`]);

/** Golden-angle spark pool - same radii band as the app TASK_SPARK_POOL. */
const SPARKS: Array<[deg: number, rad: number, size: number]> = [
  [0, 92, 11],
  [137.5, 118, 9],
  [275, 104, 13],
  [52.5, 131, 8],
  [190, 87, 10],
  [327.5, 124, 12],
  [105, 110, 8],
];

export type AppOrbProps = {
  /** Visual diameter of the layout box (app default 200). */
  size?: number;
  /** false = pure white soul (no protocol yet). Marketing default: lit. */
  accent?: boolean;
  /** How many task sparks to light (0-7 shown). */
  sparks?: number;
  /** Extra CSS class on the outer box. */
  className?: string;
  /** Disable breath / wisp / spark motion. */
  reducedMotion?: boolean;
  /**
   * Accent ramp. Defaults to amber, which is what every existing caller
   * gets without passing anything.
   */
  ramp?: AccentRamp;
  /**
   * Set only by the gate. Renders the spectrum layers alongside the
   * single-hue ones so CSS can cross-fade between them; leave undefined
   * everywhere else and the prism layers are never created at all.
   */
  mode?: "solid" | "prism";
};

/**
 * Playlight app orb - web port of ShowcaseOrb / store-assets orb.mjs.
 *
 * Identity rules (do not break):
 * 1. White living essence never tints.
 * 2. Accent lives OUTSIDE the white heart (ring → aura → corona).
 * 3. Soft dissolve only - no hard disc edge.
 */
export function AppOrb({
  size = ORB_BOX,
  accent = true,
  sparks = 0,
  className = "",
  reducedMotion = false,
  ramp = AMBER_RAMP,
  mode,
}: AppOrbProps) {
  const scale = size / ORB_BOX;
  const motion = reducedMotion ? " app-orb--still" : "";
  const prism = mode !== undefined;

  /** One accent layer, as its single-hue self plus its prism twin. */
  const pair = (cls: string, d: number, cy: number, profile: AStop[]) => (
    <Fragment key={cls}>
      <div className={`${cls} app-orb__solid`} style={layerStyle(d, cy, solid(profile, ramp))} />
      {prism ? (
        <div className={`${cls} app-orb__prism`} style={prismStyle(d, cy, profile)} />
      ) : null}
    </Fragment>
  );

  return (
    <div
      className={`app-orb${motion} ${className}`.trim()}
      style={{ width: size, height: size, colorScheme: "only dark" }}
      data-mode={mode}
      aria-hidden
    >
      <div
        className="app-orb__stage"
        style={{
          width: ORB_BOX,
          height: ORB_BOX,
          transform: `scale(${scale})`,
        }}
      >
        <div className="app-orb__body">
          {accent ? pair("app-orb__corona", CORONA, 0.5, CORONA_A) : null}
          {accent ? pair("app-orb__aura", AURA, 0.5, AURA_A) : null}

          {accent ? (
            <>
              {pair("app-orb__wisp app-orb__wisp--a", WISP, 0.5, wispA(0.42, "base"))}
              {pair("app-orb__wisp app-orb__wisp--b", WISP, 0.5, wispA(0.36, "bright"))}
            </>
          ) : null}

          {/* white heart - never tinted, and painted over every accent below */}
          <div className="app-orb__essence" style={layerStyle(ESSENCE, 0.44, essenceStops())} />

          {/* accent ring - outside the resting white heart */}
          {accent ? pair("app-orb__ring", ESSENCE, 0.44, RING_A) : null}

          <div className="app-orb__core" style={layerStyle(CORE, 0.5, coreStops())} />
        </div>

        {accent && sparks > 0
          ? SPARKS.slice(0, Math.min(sparks, SPARKS.length)).map(([deg, rad, sz], i) => {
              const rx = Math.cos((deg * Math.PI) / 180) * rad;
              const ry = Math.sin((deg * Math.PI) / 180) * rad;
              return (
                <div
                  key={i}
                  className="app-orb__spark"
                  style={{
                    width: sz,
                    height: sz,
                    marginLeft: rx - sz / 2,
                    marginTop: ry - sz / 2,
                    background: `radial-gradient(circle,${rgba(ramp.pale, 0.95)} 0%,${rgba(ramp.base, 0.35)} 38%,${rgba(ramp.base, 0)} 72%)`,
                    animationDelay: `${i * 0.45}s`,
                  }}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

import type { CSSProperties } from "react";
import {
  AMBER_RAMP,
  AURA,
  CORE,
  CORONA,
  ESSENCE,
  ORB_BOX,
  WISP,
  rgba,
  type AccentRamp,
} from "./ramp";

type Stop = [offset: number, color: string];

const stopList = (stops: Stop[]) =>
  stops.map(([o, c]) => `${c} ${(o * 100).toFixed(1)}%`).join(",");

/**
 * One orb layer, centred — ported from scripts/store-assets/lib/orb.mjs.
 * Box is padded by the cy offset so a raised gradient centre never clips
 * into a hard arc (the app lesson for icon-size orbs).
 */
function layerStyle(
  d: number,
  cy: number,
  stops: Stop[],
): CSSProperties {
  const r = d / 2;
  const offset = (0.5 - cy) * d;
  const box = 2 * (r + Math.abs(offset));
  const yPct = ((box / 2 - offset) / box) * 100;
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: box,
    height: box,
    marginLeft: -box / 2,
    marginTop: -box / 2,
    background: `radial-gradient(circle ${r}px at 50% ${yPct.toFixed(3)}%,${stopList(stops)})`,
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

/** Accent RING: 0–34% clear so the white heart is never tinted. */
const ringStops = (r: AccentRamp): Stop[] => [
  [0, rgba(r.base, 0)],
  [0.34, rgba(r.base, 0)],
  [0.46, rgba(r.bright, 0.42)],
  [0.58, rgba(r.base, 0.82)],
  [0.72, rgba(r.base, 0.55)],
  [0.86, rgba(r.base, 0.26)],
  [1, rgba(r.deep, 0)],
];

const auraStops = (r: AccentRamp): Stop[] => [
  [0, rgba(r.base, 0.74)],
  [0.24, rgba(r.base, 0.44)],
  [0.5, rgba(r.base, 0.2)],
  [0.76, rgba(r.base, 0.07)],
  [0.92, rgba(r.base, 0.02)],
  [1, rgba(r.base, 0)],
];

const coronaStops = (r: AccentRamp): Stop[] => [
  [0, rgba(r.base, 0.24)],
  [0.36, rgba(r.base, 0.1)],
  [0.66, rgba(r.base, 0.035)],
  [0.88, rgba(r.base, 0.01)],
  [1, rgba(r.base, 0)],
];

const coreStops = (): Stop[] => [
  [0, "rgba(255,255,255,1)"],
  [0.45, "rgba(255,255,255,.7)"],
  [1, "rgba(255,255,255,0)"],
];

const wispStops = (hex: string, peak: number): Stop[] => [
  [0, rgba(hex, peak)],
  [0.3, rgba(hex, peak * 0.45)],
  [0.6, rgba(hex, peak * 0.1)],
  [1, rgba(hex, 0)],
];

/** Golden-angle spark pool — same radii band as the app TASK_SPARK_POOL. */
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
  /** How many task sparks to light (0–7 shown). */
  sparks?: number;
  /** Extra CSS class on the outer box. */
  className?: string;
  /** Disable breath / wisp / spark motion. */
  reducedMotion?: boolean;
};

/**
 * Playlight app orb — web port of ShowcaseOrb / store-assets orb.mjs.
 *
 * Identity rules (do not break):
 * 1. White living essence never tints.
 * 2. Accent lives OUTSIDE the white heart (ring → aura → corona).
 * 3. Soft dissolve only — no hard disc edge.
 */
export function AppOrb({
  size = ORB_BOX,
  accent = true,
  sparks = 0,
  className = "",
  reducedMotion = false,
}: AppOrbProps) {
  const ramp = AMBER_RAMP;
  const scale = size / ORB_BOX;
  const motion = reducedMotion ? " app-orb--still" : "";

  return (
    <div
      className={`app-orb${motion} ${className}`.trim()}
      style={{ width: size, height: size }}
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
          {accent ? (
            <div
              className="app-orb__corona"
              style={layerStyle(CORONA, 0.5, coronaStops(ramp))}
            />
          ) : null}

          {accent ? (
            <div
              className="app-orb__aura"
              style={layerStyle(AURA, 0.5, auraStops(ramp))}
            />
          ) : null}

          {accent ? (
            <>
              <div
                className="app-orb__wisp app-orb__wisp--a"
                style={layerStyle(WISP, 0.5, wispStops(ramp.base, 0.42))}
              />
              <div
                className="app-orb__wisp app-orb__wisp--b"
                style={layerStyle(WISP, 0.5, wispStops(ramp.bright, 0.36))}
              />
            </>
          ) : null}

          {/* white heart */}
          <div style={layerStyle(ESSENCE, 0.44, essenceStops())} />

          {/* accent ring — outside the resting white heart */}
          {accent ? (
            <div
              className="app-orb__ring"
              style={layerStyle(ESSENCE, 0.44, ringStops(ramp))}
            />
          ) : null}

          <div
            className="app-orb__core"
            style={layerStyle(CORE, 0.5, coreStops())}
          />
        </div>

        {accent && sparks > 0
          ? SPARKS.slice(0, Math.min(sparks, SPARKS.length)).map(
              ([deg, rad, sz], i) => {
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
              },
            )
          : null}
      </div>
    </div>
  );
}

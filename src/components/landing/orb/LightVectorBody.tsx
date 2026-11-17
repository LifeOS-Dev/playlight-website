import { type CSSProperties } from "react";

import {
  BODY_EXTENT,
  HEART_EXTENT,
  LIGHT_WHITE_PALETTE,
  hexToRgb,
  lightBodyStops,
  lightHeartStops,
  type GradientStop,
  type LightPalette,
} from "./lightProfile";
import { LIGHT_CANVAS, LIGHT_RADIUS } from "./lightShader";
import { AMBER_RAMP, ORB_BOX, PRISM_CONIC, type AccentRamp } from "./ramp";

/**
 * The living body, drawn without the shader.
 *
 * Two radial gradients that reproduce the shader's resting image (the maths is
 * in lightProfile.ts, and it is the shader's own angular mean rather than a
 * drawing made to look like it). This is what the site shows wherever the
 * shader cannot run: no WebGL, a visitor who has asked for less motion, or any
 * orb small or static enough that a GL context would be waste.
 *
 * Because it is the same picture, an orb that starts here and picks up the
 * shader is the orb beginning to MOVE, not one drawing replacing another.
 *
 * The gate needs a third state the app has no use for: every colour at once,
 * before one has been chosen. That is this same body with its own alpha
 * profile used as a mask over the brand conic, so the spectrum orb and the
 * single-hue orb are the same shape to the pixel and can cross-fade.
 */

/** The body gradient's radius in px: BODY_EXTENT body radii = half the canvas. */
const BODY_R = BODY_EXTENT * LIGHT_RADIUS;
/** The heart gradient's box, in px. */
const HEART_SIZE = Math.round(HEART_EXTENT * LIGHT_RADIUS * 2);

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

/** `{offset, color, opacity}` -> a CSS gradient stop list. */
const stopList = (stops: GradientStop[]) =>
  stops
    .map((s) => {
      const [r, g, b] = hexToRgb(s.color).map((v) => Math.round(v * 255));
      return `rgba(${r},${g},${b},${s.opacity.toFixed(4)}) ${pct(s.offset)}`;
    })
    .join(",");

/** The same stops as a mask: alpha only, so a conic behind keeps this shape. */
const maskList = (stops: GradientStop[]) =>
  stops.map((s) => `rgba(0,0,0,${s.opacity.toFixed(4)}) ${pct(s.offset)}`).join(",");

const paletteFor = (ramp: AccentRamp | undefined, accent: boolean): LightPalette =>
  accent && ramp
    ? {
        base: hexToRgb(ramp.base),
        bright: hexToRgb(ramp.bright),
        hot: hexToRgb(ramp.hot),
        deep: hexToRgb(ramp.deep),
      }
    : LIGHT_WHITE_PALETTE;

const layer = (box: number, background: string): CSSProperties => ({
  position: "absolute",
  left: "50%",
  top: "50%",
  width: box,
  height: box,
  marginLeft: -box / 2,
  marginTop: -box / 2,
  background,
});

export type LightVectorBodyProps = {
  /**
   * The layout box, in the orb's old 200-unit space - the same `size` the
   * stacked-gradient orb took, so this is a drop-in for it and every caller
   * and stylesheet still means what it meant.
   *
   * The light itself is BIGGER than this box and always was: the corona
   * reaches about 2.1 times it and simply overflows, because the body has no
   * edge to contain. Give it a parent that does not clip.
   */
  size?: number;
  /** False draws the body white: no colour has been picked yet. */
  accent?: boolean;
  /** 0..1, how alive the day is. */
  energy?: number;
  ramp?: AccentRamp;
  /**
   * Set only by the gate. Draws the spectrum body beside the single-hue one so
   * CSS can cross-fade between them; leave it undefined everywhere else and
   * the conic layer is never created at all.
   */
  mode?: "solid" | "prism";
  className?: string;
};

export function LightVectorBody({
  size = ORB_BOX,
  accent = true,
  energy = 1,
  // Amber, like the orb it replaces: a caller that passes no ramp is asking
  // for the brand's own colour, not for the colourless body.
  ramp = AMBER_RAMP,
  mode,
  className = "",
}: LightVectorBodyProps) {
  // Against ORB_BOX, not LIGHT_CANVAS: the canvas is drawn in the same units
  // the old orb's layers were (its body radius IS the old essence halved), so
  // a given `size` puts the light exactly where it used to be.
  const scale = size / ORB_BOX;
  const bodyStops = lightBodyStops(paletteFor(ramp, accent), energy);
  const heartStops = lightHeartStops();

  const bodyGradient = `radial-gradient(circle ${BODY_R}px at 50% 50%,${stopList(bodyStops)})`;
  const heartGradient = `radial-gradient(circle ${HEART_SIZE / 2}px at 50% 50%,${stopList(heartStops)})`;
  const bodyMask = `radial-gradient(circle ${BODY_R}px at 50% 50%,${maskList(bodyStops)})`;

  return (
    <div
      className={`light-vector ${className}`.trim()}
      style={{ width: size, height: size, colorScheme: "only dark" }}
      data-mode={mode}
      aria-hidden
    >
      <div
        className="light-vector__stage"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: LIGHT_CANVAS,
          height: LIGHT_CANVAS,
          marginLeft: -LIGHT_CANVAS / 2,
          marginTop: -LIGHT_CANVAS / 2,
          transform: `scale(${scale})`,
        }}
      >
        <div
          className="light-vector__body light-vector__solid"
          style={layer(LIGHT_CANVAS, bodyGradient)}
        />

        {mode !== undefined ? (
          <div
            className="light-vector__body light-vector__prism"
            style={{
              ...layer(LIGHT_CANVAS, PRISM_CONIC),
              maskImage: bodyMask,
              WebkitMaskImage: bodyMask,
            }}
          />
        ) : null}

        {/* the white heart - its own layer, so it can look around and blink */}
        <div className="light-vector__heart" style={layer(HEART_SIZE, heartGradient)} />
      </div>
    </div>
  );
}

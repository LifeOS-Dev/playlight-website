/**
 * The living body's resting image, as two radial gradients.
 *
 * Ported verbatim from the app's src/components/orb/lightProfile.ts - the
 * numbers are the app's, not re-tuned for the web, so the site shows the same
 * orb the app does.
 *
 * The orb's real body is a shader (lightShader.ts). The shader cannot always
 * run here: no WebGL, a machine that would rather not, or a visitor who has
 * asked for less motion. So the site needs a body drawn with plain gradients
 * that still IS the same orb, exactly as the app needs one for its launch
 * splash before Skia has loaded.
 *
 * At rest the shader's picture is radially symmetric apart from its noise:
 * every term is a function of the distance from the centre. So its angular
 * mean can be written down exactly and sampled into gradient stops:
 *
 *   BODY   everything coloured: the body, the hot halo round the heart, the
 *          aura and the corona, run through the shader's own brightness
 *          compression. One gradient, colour and alpha both varying.
 *   HEART  the white core, which the shader lays over the body with
 *          `mix(colour, white, w)`. That is exactly "white at alpha w, drawn
 *          over", so it is a second gradient on top, and because it is its own
 *          layer the vector body can still look around and blink.
 *
 * THE NUMBERS BELOW MIRROR lightShader.ts. They are not tuned by eye, and they
 * must change together with the shader. In the app,
 * `scripts/light-character.test.cjs` renders the real shader with Skia's
 * compiler, averages it around the circle and fails if this profile drifts
 * from it. That test is the source of truth for both copies: change a number
 * here and it has to change there, or the two orbs stop being one orb.
 *
 * The three `MEAN_*` constants are the only fitted values: what the shader's
 * noise terms average to around the circle. They were fitted against that same
 * render (worst error under 1 percent of full scale at the launch state).
 */

export type Rgb = [number, number, number];

export interface LightPalette {
  base: Rgb;
  bright: Rgb;
  hot: Rgb;
  deep: Rgb;
}

export interface GradientStop {
  /** 0..1 along the gradient radius. */
  offset: number;
  color: string;
  opacity: number;
}

/** The palette the shader uses while no colour has been picked (`uAccent` 0). */
export const LIGHT_WHITE_PALETTE: LightPalette = {
  base: [0.93, 0.94, 0.97],
  bright: [0.97, 0.98, 1.0],
  hot: [1.0, 1.0, 1.0],
  deep: [0.72, 0.75, 0.83],
};

/** Where the body gradient ends, in body radii: half the canvas (210 / 84). */
export const BODY_EXTENT = 2.5;
/** Where the heart gradient ends, in body radii. Its light is gone by here. */
export const HEART_EXTENT = 0.8;
/** The heart's radius at the middle of a breath (`0.27 + 0.03 * 0.5`). */
export const HEART_RADIUS = 0.285;

/** Angular means of the shader's noise terms at rest. Fitted, see above. */
const MEAN_F1 = 0.36;
const MEAN_VEINS = 0.16;
const MEAN_VEINS_SQ = 0;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const sq = (x: number) => x * x;

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.replace(/(.)/g, "$1$1") : h;
  const n = parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(n)) return [1, 1, 1];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const toHex = (rgb: number[]) =>
  "#" +
  rgb
    .map((v) =>
      Math.round(Math.max(0, Math.min(1, v)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");

/**
 * The coloured light at radius `r` (body radii), premultiplied, as the shader
 * outputs it at rest with the heart left out. `[r, g, b, alpha]`.
 */
export function lightBodyAt(palette: LightPalette, energy: number, r: number): number[] {
  const lit = mix(0.62, 1, energy);
  const aura = Math.exp(-sq(Math.max(r - 0.3, 0) / 0.58));
  const corona = Math.exp(-r * 1.35);
  const bodyMask = Math.exp(-sq(r / 0.78));
  const z = Math.sqrt(Math.max(1 - Math.min(r * r, 1), 0));
  const light = [0, 1, 2].map((c) => {
    let body = mix(palette.base[c], palette.bright[c], MEAN_VEINS * 0.7);
    body = mix(body, palette.deep[c], smoothstep(0.55, 1.15, r) * 0.55);
    let v =
      r < 1.7
        ? body * bodyMask * (0.62 + 0.26 * MEAN_F1 + 0.3 * MEAN_VEINS_SQ) * lit * (0.86 + 0.2 * z)
        : 0;
    v += palette.hot[c] * Math.exp(-sq(r / (HEART_RADIUS * 2))) * 0.5;
    v += palette.base[c] * aura * 0.42 * lit;
    v += palette.base[c] * corona * 0.2 * lit;
    return v;
  });
  const peak = Math.max(...light);
  const compress = (1 - Math.exp(-peak * 1.35)) / Math.max(peak, 0.0001);
  const edge = 1 - smoothstep(2.0, 2.45, r);
  const out = light.map((v) => v * compress * edge);
  return [...out, Math.max(...out)];
}

/** How much of the white heart covers the body at radius `r`, 0..1. */
export function lightHeartAt(r: number): number {
  return 1 - Math.exp(-1.7 * 1.25 * Math.exp(-sq(r / HEART_RADIUS)));
}

/** Sampled where the picture changes fastest: densely through the body. */
const BODY_RADII = [
  0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.15, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3,
  2.45, 2.5,
];
const HEART_RADII = [0, 0.06, 0.12, 0.18, 0.24, 0.3, 0.36, 0.42, 0.5, 0.6, 0.7, 0.8];

/** Stops for the body gradient, whose radius is `BODY_EXTENT` body radii. */
export function lightBodyStops(palette: LightPalette, energy: number): GradientStop[] {
  return BODY_RADII.map((r) => {
    const [red, green, blue, alpha] = lightBodyAt(palette, energy, r);
    // A gradient stop wants straight colour plus alpha, and the shader's
    // output is premultiplied. Where the light has gone to nothing there is
    // no colour to recover, so fall back to the accent itself.
    const color =
      alpha > 0.0005 ? toHex([red / alpha, green / alpha, blue / alpha]) : toHex(palette.base);
    return { offset: r / BODY_EXTENT, color, opacity: Math.max(0, Math.min(1, alpha)) };
  });
}

/** Stops for the heart gradient, whose radius is `HEART_EXTENT` body radii. */
export function lightHeartStops(): GradientStop[] {
  return HEART_RADII.map((r, i) => ({
    offset: r / HEART_EXTENT,
    color: "#FFFFFF",
    // Forced to exactly zero at the rim so the layer has no visible edge.
    opacity: i === HEART_RADII.length - 1 ? 0 : lightHeartAt(r),
  }));
}

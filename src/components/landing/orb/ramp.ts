/**
 * Amber accent ramp — verbatim from los_client AMBER_RAMP / store-assets theme.
 * White essence stays untinted; accent lives outside as ring + aura + corona.
 */
export const AMBER_RAMP = {
  core: "#FFFFFF",
  hot: "#FFF588",
  bright: "#FFC95C",
  base: "#FFA32B",
  deep: "#D97A06",
  border: "#D35400",
  pale: "#FFD58C",
} as const;

export type AccentRamp = typeof AMBER_RAMP;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** App layer diameters (Orb.tsx). */
export const ORB_BOX = 200;
export const ESSENCE = 168;
export const AURA = 300;
export const CORONA = 400;
export const WISP = 320;
export const CORE = 48;

export const SCALE_MIN = 0.6;
export const SCALE_MAX = 1.1;

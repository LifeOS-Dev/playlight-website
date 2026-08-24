import { DEFAULT_VIBE, vibeById, type Vibe, type VibeId } from "@/components/landing/orb/ramp";

const KEY = "playlight.vibe";

/**
 * The chosen light, remembered.
 *
 * Reads are guarded because this runs under SSR, where there is no
 * localStorage and no document - and because Safari throws on storage
 * access in private mode rather than returning null.
 */
export function readVibe(): VibeId | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v && vibeById(v).id === v ? (v as VibeId) : null;
  } catch {
    return null;
  }
}

export function writeVibe(id: VibeId) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* private mode - the choice just won't survive the session */
  }
}

const rgbOf = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** `a` blended `t` of the way toward `b`. */
const mix = (a: [number, number, number], b: [number, number, number], t: number): string =>
  a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(" ");

/**
 * Publish a ramp as CSS custom properties so the rest of the site can
 * wear it without importing anything. Set on the .pl3 root rather than
 * :root, to stay inside the surface pl3.css already scopes itself to.
 *
 * The `-rgb` values are bare triples, not hex, because pl3.css needs to
 * vary their alpha - sometimes through a calc() of --lit that color-mix()
 * could not express.
 */
export function applyVibe(root: HTMLElement | null, vibe: Vibe) {
  if (!root) return;
  const r = vibe.ramp;
  const base = rgbOf(r.base);

  root.style.setProperty("--v-hot", r.hot);
  root.style.setProperty("--v-bright", r.bright);
  root.style.setProperty("--v-base", r.base);
  root.style.setProperty("--v-deep", r.deep);
  root.style.setProperty("--v-border", r.border);
  root.style.setProperty("--v-pale", r.pale);

  root.style.setProperty("--v-base-rgb", base.join(" "));
  root.style.setProperty("--v-hue", String(vibe.hue));
  // swings the baked-amber app screenshots onto this light
  root.style.setProperty("--v-rotate", `${vibe.shift}deg`);
  // Page text: near-white carrying just enough of the light to change its
  // temperature, without dropping contrast on --void.
  root.style.setProperty("--v-paper-rgb", mix([255, 253, 250], base, 0.09));
  // Wireframe rules: the light, pulled well down toward the page's ash.
  root.style.setProperty("--v-edge-rgb", mix(rgbOf(r.bright), [138, 128, 120], 0.34));

  root.dataset.vibe = vibe.id;
}

export const defaultVibe = () => vibeById(DEFAULT_VIBE);

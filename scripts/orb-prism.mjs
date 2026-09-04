/**
 * Build public/orb-prism.png - the gate's every-colour mark - from the
 * brand artwork.
 *
 * Two things happen here that cannot be recovered from the PNG itself,
 * which is why this script exists rather than a one-off command:
 *
 * 1. THE ROTATION. The gate is a picker: the angle you point at selects
 *    the hue (see PRISM_CONIC and the VIBES angles in orb/ramp.ts), and
 *    the torch leaving the rim is sampled from that same angle. The
 *    artwork's own spectrum sat 94deg off it, so the light you touched
 *    was not the light you took - Aqua's angle pointed at red, Amber's
 *    at magenta. Turning the artwork brings the two into agreement
 *    without touching the mapping. Solved as the rigid rotation with the
 *    least squared hue error across the five vibes; the residual is
 *    ~14deg RMS, which is as close as five named lights get to a
 *    continuous spectrum.
 *
 * 2. THE ALPHA. The artwork is light painted on black. Composited as-is
 *    it drags its own black square along, and screen-blending it would
 *    need a group the gate's hit box does not give it (that box is a
 *    stacking context, which isolates the blend). So the black becomes
 *    real alpha: for additive light a = max(r,g,b) and c = rgb/a
 *    reproduces the source EXACTLY over black, and behaves sanely over
 *    anything else.
 *
 * The site's icons come from the same two steps, so they are cut here
 * too and can never drift from the mark on the gate.
 *
 * Usage: node scripts/orb-prism.mjs [path/to/source.png]
 */
import sharp from "sharp";

const SRC = process.argv[2] ?? "C:/Desktop 17-04-26/playlight/Logo New/logo to use.png";
const OUT = "public/orb-prism.png";

/**
 * How much of the artwork an icon keeps. The glow has faded to nothing
 * by ~0.85 of the half-width, so the outer fifth is margin the tile is
 * about to add back - cropping it is what stops a 16px favicon from
 * being a bright speck adrift in black.
 */
const ICON_CROP = 0.78;

/** The tile behind it. A light-on-dark mark vanishes on a pale tab bar. */
const TILE = "#07060a";
/** Corner radius as a fraction of the tile - 14/64, from the old icon. */
const TILE_R = 14 / 64;

/** Rendered at most ~420 CSS px, so this covers 2x. */
const SIZE = 1024;

/**
 * Degrees, counter-clockwise on screen - the direction orb angles are
 * measured in. See note 1 above.
 */
const TURN = 94;

/** Work large enough that the turn costs no detail, then come down. */
const WORK = 2048;

const flat = sharp(SRC).flatten({ background: "#000" }).resize(WORK, WORK, { kernel: "lanczos3" });

/* Rotating a square expands it; the crop takes the middle back. Nothing
   is lost: the glow has died to black well inside the inscribed circle,
   so the corners the rotation swings out of frame were empty. */
const turned = await sharp(await flat.png().toBuffer())
  .rotate(-TURN, { background: "#000" })
  .toBuffer();
const grown = await sharp(turned).metadata();
const inset = Math.round((grown.width - WORK) / 2);

const { data, info } = await sharp(turned)
  .extract({ left: inset, top: inset, width: WORK, height: WORK })
  .resize(SIZE, SIZE, { kernel: "lanczos3" })
  .raw()
  .toBuffer({ resolveWithObject: true });

const c = info.channels;
const out = Buffer.alloc(SIZE * SIZE * 4);
for (let i = 0, o = 0; o < out.length; i += c, o += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = Math.max(r, g, b);
  if (a === 0) continue; // Buffer.alloc already zeroed it
  out[o] = Math.min(255, Math.round((r * 255) / a));
  out[o + 1] = Math.min(255, Math.round((g * 255) / a));
  out[o + 2] = Math.min(255, Math.round((b * 255) / a));
  out[o + 3] = a;
}

const mark = sharp(out, { raw: { width: SIZE, height: SIZE, channels: 4 } });
await mark.clone().png({ compressionLevel: 9, effort: 10 }).toFile(OUT);

/* ── icons ──────────────────────────────────────────────────── */

const keep = Math.round(SIZE * ICON_CROP);
const cropped = await mark
  .clone()
  .extract({
    left: Math.round((SIZE - keep) / 2),
    top: Math.round((SIZE - keep) / 2),
    width: keep,
    height: keep,
  })
  .png()
  .toBuffer();

/**
 * One icon. `inset` is how much of the tile the mark leaves as margin;
 * `round` is off for the Apple icon, which iOS masks itself and which
 * turns any transparency it is given into black.
 */
async function icon(file, px, { inset, round }) {
  const art = Math.round(px * (1 - inset));
  const tile = round
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}">
         <rect width="${px}" height="${px}" rx="${(px * TILE_R).toFixed(2)}" fill="${TILE}"/>
       </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}">
         <rect width="${px}" height="${px}" fill="${TILE}"/>
       </svg>`;
  await sharp(Buffer.from(tile))
    .composite([
      {
        input: await sharp(cropped).resize(art, art, { kernel: "lanczos3" }).png().toBuffer(),
        left: Math.round((px - art) / 2),
        top: Math.round((px - art) / 2),
      },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(file);
  return file;
}

const icons = [
  await icon("public/favicon-16.png", 16, { inset: 0.06, round: true }),
  await icon("public/favicon-32.png", 32, { inset: 0.08, round: true }),
  await icon("public/favicon-180.png", 180, { inset: 0.1, round: true }),
  await icon("public/apple-touch-icon.png", 180, { inset: 0.12, round: false }),
];

console.log(`${OUT} <- ${SRC} (turned ${TURN}deg, ${SIZE}px)`);
console.log(`icons: ${icons.join(", ")}`);

/**
 * Draw the QR code on the desktop "Get Playlight" sheet: public/get-qr.svg.
 *
 * It encodes one address, https://www.playlight.app/get, which the /get route
 * answers with a redirect to the store for the phone that scanned it. So the
 * code never has to change when a listing does - stores.ts is the one place
 * the store links live.
 *
 * The encoder is `toqr` (MIT, by Phil Pluckthun - the one Expo's CLI ships),
 * not a dependency of this site because nothing at runtime needs it. Point
 * TOQR at a copy, e.g. the app's own:
 *
 *   TOQR="../../playlight New/los_client/node_modules/toqr/dist/toqr.mjs" node scripts/qr-get.mjs
 *
 * Dark modules on white with the full four-module quiet zone: scanning
 * reliability beats styling, and the sheet frames it in a white card anyway.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const URL_TO_ENCODE = "https://www.playlight.app/get";
const QUIET = 4;

const modulePath = process.env.TOQR;
if (!modulePath) {
  console.error("Set TOQR to the path of toqr's dist/toqr.mjs - see the header of this file.");
  process.exit(1);
}
const { toQR } = await import(pathToFileURL(resolve(modulePath)).href);

// ECLevel.M (enum value 0): survives a scratched screen or a glare spot.
const cells = toQR(URL_TO_ENCODE, 0);
const n = Math.round(Math.sqrt(cells.length));
if (n * n !== cells.length) throw new Error("unexpected QR matrix");

let d = "";
for (let y = 0; y < n; y++) {
  for (let x = 0; x < n; x++) {
    if (cells[y * n + x]) d += `M${x + QUIET} ${y + QUIET}h1v1h-1z`;
  }
}

const size = n + QUIET * 2;
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
  `<title>QR code: ${URL_TO_ENCODE}</title>` +
  `<rect width="${size}" height="${size}" fill="#fff"/>` +
  `<path fill="#07060a" d="${d}"/>` +
  `</svg>\n`;

const out = resolve("public/get-qr.svg");
writeFileSync(out, svg);
console.log(`wrote ${out} (${n}x${n} modules + quiet zone) for ${URL_TO_ENCODE}`);

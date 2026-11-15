/**
 * Where the two download buttons point.
 *
 * Both listings are live, so the links are kept here as plain constants.
 * Neither carries a storefront or a language - apps.apple.com/app/... and
 * the bare Play id both send a visitor to their own region's listing, and
 * a hard-coded /us/ or ?hl=en would send everyone to ours.
 *
 * VITE_APP_STORE_URL and VITE_PLAY_STORE_URL still override them, so a
 * moved listing can be corrected from the deploy environment without a
 * release. See .env.example.
 */
const APP_STORE = "https://apps.apple.com/app/playlight-the-personal-os/id6798870154";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=app.playlight";

/** Only an https URL is allowed through; anything else keeps the listing above. */
function storeUrl(configured: string | undefined, listing: string) {
  const raw = configured?.trim();
  if (!raw) return listing;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return listing;
    return url.toString();
  } catch {
    return listing;
  }
}

export const APP_STORE_URL = storeUrl(import.meta.env.VITE_APP_STORE_URL, APP_STORE);

export const PLAY_STORE_URL = storeUrl(import.meta.env.VITE_PLAY_STORE_URL, PLAY_STORE);

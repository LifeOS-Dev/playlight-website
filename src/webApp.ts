/** The signed-in web app. An env override can point elsewhere, including /app. */
const DEFAULT_WEB_APP_URL = "https://app.playlight.app/";
const configuredUrl = import.meta.env.VITE_PLAYLIGHT_WEB_APP_URL?.trim() || DEFAULT_WEB_APP_URL;

export const webAppUrl = (() => {
  if (!configuredUrl) return null;

  // Keep the app on the current website origin when it is mounted at /app.
  if (/^\/app(?:\/|$)/.test(configuredUrl) && !configuredUrl.startsWith("//")) {
    return configuredUrl;
  }

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "https:" && url.hostname !== "localhost") return null;
    return url.toString();
  } catch {
    return null;
  }
})();

/** Set only after the signed-in web app has a verified deployment URL. */
const configuredUrl = import.meta.env.VITE_PLAYLIGHT_WEB_APP_URL?.trim();

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

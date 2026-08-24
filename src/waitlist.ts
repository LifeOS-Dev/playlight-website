/**
 * Where the whole site is pointed until the app ships.
 *
 * WAITLIST_ENDPOINT takes a JSON POST of `{ email, source }`. It points at
 * our own route by default - see src/routes/api/waitlist.ts - so a visitor
 * types their address once and is done. Point it at Formspree, Buttondown,
 * ConvertKit or anything else that speaks JSON if you'd rather skip the hop.
 *
 * waitlistMailto is only the safety net: if the endpoint is down or has no
 * delivery configured, the form offers the address to a mail client instead
 * of pretending the sign-up landed.
 */
export const WAITLIST_ENDPOINT = "/api/waitlist";

export const NOTIFY_EMAIL = "hello@playlight.app";

/** Community links offered alongside the email option. */
export const DISCORD_URL = "https://discord.gg/sNFN2N5Cv";
export const WHATSAPP_URL = "https://chat.whatsapp.com/Bcx6xNPich92FCMHEI8W3q";

export function waitlistMailto(email: string) {
  const subject = "Notify me - Playlight";
  const body = `Please email me when Playlight opens.\n\nEmail: ${email}\n`;
  return `mailto:${NOTIFY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Where the whole site is pointed until the app ships.
 *
 * Set WAITLIST_ENDPOINT to any service that accepts a JSON POST of
 * `{ email, source }` - Formspree, Buttondown, ConvertKit, a route of your
 * own. Leave it null and the form still works: it hands the address to the
 * visitor's mail client instead, addressed to NOTIFY_EMAIL.
 */
export const WAITLIST_ENDPOINT: string | null = null;

export const NOTIFY_EMAIL = "hello@playlight.app";

export function waitlistMailto(email: string) {
  const subject = "Waitlist - Playlight";
  const body = `Please add me to the Playlight waitlist.\n\nEmail: ${email}\n`;
  return `mailto:${NOTIFY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

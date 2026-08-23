import { NOTIFY_EMAIL } from "@/waitlist";

/**
 * How the site's forms reach us. Server side only - imported by the routes
 * under src/routes/api, which carry no component and so never reach the
 * browser bundle.
 *
 * A form used to hand its message to the visitor's mail client and ask them
 * to press send a second time. These helpers do the sending instead, through
 * whichever of these the deployment has configured:
 *   RESEND_API_KEY       - mails us, reply-to the address on the form
 *   WAITLIST_WEBHOOK_URL - forwards the payload as JSON, for Formspree,
 *                          Zapier, a sheet, anything that speaks HTTP
 * With neither set, deliver() reports "unconfigured" and the form falls back
 * to a mail link, so nobody is ever turned away empty-handed.
 */

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** Who is asking, as best a proxy can tell us. */
export function caller(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Best-effort, per-instance throttle. Not a wall, just a speed bump for the
// bots that find any public endpoint eventually.
const WINDOW_MS = 60_000;
const seen = new Map<string, number[]>();

export function tooFast(who: string, limit = 5) {
  const now = Date.now();
  if (seen.size > 500) {
    for (const [key, hits] of seen) {
      if (hits.every((t) => now - t > WINDOW_MS)) seen.delete(key);
    }
  }
  const hits = (seen.get(who) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  seen.set(who, hits);
  return hits.length > limit;
}

export type Notice = {
  /** Subject line, if it goes out as mail. */
  subject: string;
  /** The message itself, plain text. */
  text: string;
  /** The address on the form. Replying should reach them. */
  replyTo: string;
  /** The same request as data, for a webhook that would rather have fields. */
  payload: Record<string, unknown>;
};

export type Delivery = "sent" | "unconfigured";

export async function deliver(notice: Notice): Promise<Delivery> {
  const key = process.env.RESEND_API_KEY;
  const hook = process.env.WAITLIST_WEBHOOK_URL;

  if (key) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.WAITLIST_FROM ?? "Playlight <onboarding@resend.dev>",
        to: [process.env.WAITLIST_TO ?? NOTIFY_EMAIL],
        reply_to: notice.replyTo,
        subject: notice.subject,
        text: notice.text,
      }),
    });
    if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
    return "sent";
  }

  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(notice.payload),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}: ${await res.text()}`);
    return "sent";
  }

  return "unconfigured";
}

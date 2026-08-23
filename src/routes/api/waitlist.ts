import { createFileRoute } from "@tanstack/react-router";
import { EMAIL, caller, deliver, json, tooFast } from "@/lib/notify.server";

/**
 * The waitlist's own front door.
 *
 * The form used to hand the address to the visitor's mail client, which asked
 * them to send a second email to finish signing up. This takes the address
 * itself and does the sending, so one submit is the whole errand.
 */
export const Route = createFileRoute("/api/waitlist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: { email?: unknown; source?: unknown };
        try {
          payload = await request.json();
        } catch {
          return json({ ok: false, error: "bad request" }, 400);
        }

        const email = typeof payload.email === "string" ? payload.email.trim() : "";
        if (!email || email.length > 254 || !EMAIL.test(email)) {
          return json({ ok: false, error: "that address doesn't look right" }, 400);
        }

        if (tooFast(`waitlist:${caller(request)}`)) {
          return json({ ok: false, error: "too many tries, give it a minute" }, 429);
        }

        const source = typeof payload.source === "string" ? payload.source.slice(0, 64) : "web";
        const at = new Date().toISOString();

        let delivery;
        try {
          delivery = await deliver({
            subject: `Waitlist - ${email}`,
            text: `${email}\nsource: ${source}\nat: ${at}\n`,
            replyTo: email,
            payload: { kind: "waitlist", email, source, at },
          });
        } catch (err) {
          console.error("[waitlist] delivery failed", err);
          return json({ ok: false, error: "couldn't record that" }, 502);
        }

        if (delivery === "unconfigured") {
          // Nowhere to put it. Leave it in the logs and let the form fall back.
          console.warn(`[waitlist] no delivery configured; dropping ${email}`);
          return json({ ok: false, error: "unconfigured" }, 501);
        }

        return json({ ok: true });
      },
    },
  },
});

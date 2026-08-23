import { createFileRoute } from "@tanstack/react-router";
import { EMAIL, caller, deliver, json, tooFast } from "@/lib/notify.server";

/**
 * Deletion requests, taken and sent in one press.
 *
 * A request arriving here proves only that someone typed the address - the
 * mail client at least sent it from an inbox. The note below says so plainly,
 * so nothing is deleted on the strength of this form alone; verification is
 * still ours to do, as the page promises.
 */
export const Route = createFileRoute("/api/deletion-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: { email?: unknown; mode?: unknown; reason?: unknown };
        try {
          payload = await request.json();
        } catch {
          return json({ ok: false, error: "bad request" }, 400);
        }

        const email = typeof payload.email === "string" ? payload.email.trim() : "";
        if (!email || email.length > 254 || !EMAIL.test(email)) {
          return json({ ok: false, error: "that address doesn't look right" }, 400);
        }

        const mode = payload.mode === "data" ? "data" : "account";
        const reason =
          typeof payload.reason === "string" ? payload.reason.trim().slice(0, 2000) : "";
        const at = new Date().toISOString();

        if (tooFast(`deletion:${caller(request)}`, 3)) {
          return json({ ok: false, error: "too many tries, give it a minute" }, 429);
        }

        const wanted =
          mode === "account"
            ? "Delete account and associated data"
            : "Delete data only (keep account)";

        let delivery;
        try {
          delivery = await deliver({
            subject:
              mode === "account"
                ? "Playlight account deletion request"
                : "Playlight data deletion request",
            text: [
              `Request type: ${wanted}`,
              `Account email: ${email}`,
              `Reason: ${reason || "(not provided)"}`,
              `Received: ${at}`,
              "",
              "Submitted through the web form on playlight.app/delete.",
              "The address is unverified - confirm ownership before processing.",
            ].join("\n"),
            replyTo: email,
            payload: { kind: "deletion", mode, email, reason, at },
          });
        } catch (err) {
          console.error("[deletion] delivery failed", err);
          return json({ ok: false, error: "couldn't send that" }, 502);
        }

        if (delivery === "unconfigured") {
          console.warn(`[deletion] no delivery configured; dropping request from ${email}`);
          return json({ ok: false, error: "unconfigured" }, 501);
        }

        return json({ ok: true });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/stores";

/**
 * One address for both stores: what the QR code on the desktop "Get
 * Playlight" sheet encodes (public/get-qr.svg, drawn by scripts/qr-get.mjs).
 *
 * A phone that scans it lands on its own store. Anything else - a desktop, a
 * crawler, a phone we cannot tell - lands on the homepage, where both stores
 * are offered. The store links themselves live only in stores.ts, so the
 * printed code never has to change when a listing moves.
 */
function storeFor(ua: string): string {
  if (/iPhone|iPad|iPod/i.test(ua)) return APP_STORE_URL;
  if (/Android/i.test(ua)) return PLAY_STORE_URL;
  return "/";
}

export const Route = createFileRoute("/get")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        new Response(null, {
          status: 302,
          headers: {
            Location: storeFor(request.headers.get("user-agent") ?? ""),
            // The answer depends on who is asking, so nothing may cache one
            // phone's answer for another.
            "Cache-Control": "no-store",
            Vary: "User-Agent",
          },
        }),
    },
  },
});

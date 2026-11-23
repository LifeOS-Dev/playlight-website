import * as React from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { webAppUrl } from "@/webApp";
import { GET_PLAYLIGHT_EVENT, consumeTrigger } from "./getPlaylight";
import { StoreButtons } from "./StoreButtons";

/**
 * "Get Playlight", for a desktop.
 *
 * A computer cannot install a phone app, so the store pages a desktop
 * visitor used to be sent to were a dead end with extra steps. This sheet
 * puts a QR code in front of them instead: point a phone at it and the phone
 * opens its own store (the code encodes /get, which redirects by device -
 * see routes/get.ts). The two store links stay underneath for anyone who
 * would rather look first, and once the web app has a verified address,
 * a way to open it in this browser too.
 *
 * Mounted once per page. Native <dialog>: focus trapping, Esc and the inert
 * backdrop come from the platform, and the top layer escapes the road's 3D
 * transforms entirely.
 */
export function GetAppSheet() {
  const ref = React.useRef<HTMLDialogElement | null>(null);
  const opener = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const onOpen = () => {
      opener.current = consumeTrigger();
      ref.current?.showModal();
    };
    window.addEventListener(GET_PLAYLIGHT_EVENT, onOpen);
    return () => window.removeEventListener(GET_PLAYLIGHT_EVENT, onOpen);
  }, []);

  const close = React.useCallback(() => ref.current?.close(), []);

  // Hand focus back where it came from, so the journey does not lose its place.
  const onClose = React.useCallback(() => opener.current?.focus(), []);

  // Clicking the backdrop dismisses; clicking the panel must not.
  const onBackdrop = React.useCallback((e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) ref.current?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className="pl3-get"
      aria-labelledby="pl3-get-title"
      onClose={onClose}
      onClick={onBackdrop}
    >
      <div className="pl3-get__panel">
        <button type="button" className="pl3-get__close" onClick={close} aria-label="Close">
          <X aria-hidden />
        </button>

        <h2 id="pl3-get-title" className="pl3-get__title">
          Get Playlight
        </h2>
        <p className="pl3-get__sub">Free on iPhone and Android.</p>

        <div className="pl3-get__qr">
          <img
            src="/get-qr.svg"
            width={176}
            height={176}
            alt="QR code. Scan it with your phone's camera to open Playlight in your app store."
          />
        </div>

        {/* The light, one last time: the same voice as the page behind. */}
        <p className="pl3-get__say">Point your phone's camera here. See you in the app.</p>

        <p className="pl3-get__or">Or go to the store</p>
        <StoreButtons variant="quiet" className="pl3-get__stores" />

        {webAppUrl ? (
          <a href={webAppUrl} className="pl3-get__web">
            Or open Playlight in this browser
          </a>
        ) : null}

        <div className="pl3-get__foot">
          <Link to="/support" onClick={close}>
            Support
          </Link>
          <span aria-hidden className="pl3-get__dot" />
          <Link to="/privacy" onClick={close}>
            Privacy
          </Link>
          <span aria-hidden className="pl3-get__dot" />
          <Link to="/terms" onClick={close}>
            Terms
          </Link>
        </div>
      </div>
    </dialog>
  );
}

import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { GET_PLAYLIGHT_EVENT, consumeTrigger, openGetPlaylight } from "./getPlaylight";
import { NOTIFY_EMAIL, WAITLIST_ENDPOINT, waitlistMailto } from "@/waitlist";

/**
 * The single call to action. One button, one decision.
 *
 * It asks for early access rather than a download, because there is nothing
 * to download yet and a button that lies is worse than one that waits.
 */
export function TryToday({
  variant = "solid",
  className = "",
}: {
  variant?: "solid" | "quiet";
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`pl3-try ${className}`}
      data-variant={variant}
      onClick={(e) => openGetPlaylight(e.currentTarget)}
    >
      Get early access
    </button>
  );
}

type State = "idle" | "sending" | "done" | "error";

/**
 * One field and one button. With no endpoint configured the address is
 * handed to the visitor's mail client, so the form is never a dead end
 * while the list is still being set up.
 */
function WaitlistForm() {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<State>("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const address = email.trim();
    if (!address || state === "sending") return;

    if (!WAITLIST_ENDPOINT) {
      window.location.href = waitlistMailto(address);
      setState("done");
      return;
    }

    setState("sending");
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: address, source: "web" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p className="pl3-get__done">
        You're on the list. We'll write once — the day it opens.
        {WAITLIST_ENDPOINT ? null : (
          <span className="pl3-get__hint">
            If your mail app didn't open, send a note to {NOTIFY_EMAIL}.
          </span>
        )}
      </p>
    );
  }

  return (
    <form className="pl3-get__form" onSubmit={submit}>
      <label className="sr-only" htmlFor="pl3-waitlist-email">
        Email address
      </label>
      <input
        id="pl3-waitlist-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="pl3-get__input"
      />
      <button type="submit" className="pl3-get__submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending" : "Join the waitlist"}
        <ArrowRight aria-hidden />
      </button>

      {state === "error" ? (
        <p className="pl3-get__hint" role="alert">
          That didn't send. Email {NOTIFY_EMAIL} and we'll add you by hand.
        </p>
      ) : (
        <p className="pl3-get__hint">One email, on the day it opens. Nothing else.</p>
      )}
    </form>
  );
}

/**
 * Mounted once per page. Uses a native <dialog>, so focus trapping, Esc to
 * dismiss and the inert backdrop come from the platform — and the top layer
 * escapes the 3D scene's transforms entirely.
 */
export function GetPlaylightPanel() {
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

  const close = React.useCallback(() => {
    ref.current?.close();
  }, []);

  // Send focus back where it came from, so the journey doesn't lose your place.
  const onClose = React.useCallback(() => {
    opener.current?.focus();
  }, []);

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

        <p className="pl3-get__eyebrow">Get Playlight</p>
        <h2 id="pl3-get-title" className="pl3-get__title">
          Come into the light.
        </h2>
        <p className="pl3-get__sub">
          Playlight is still being built. Leave your address and you'll be in the first group
          through the door.
        </p>

        <WaitlistForm />

        <div className="pl3-get__foot">
          <Link to="/support" onClick={close}>
            Support
          </Link>
          <span aria-hidden className="pl3-get__dot" />
          <Link to="/privacy" onClick={close}>
            Privacy
          </Link>
        </div>
      </div>
    </dialog>
  );
}

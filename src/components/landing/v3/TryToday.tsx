import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, X } from "lucide-react";
import { GET_PLAYLIGHT_EVENT, consumeTrigger, openGetPlaylight } from "./getPlaylight";
import {
  DISCORD_URL,
  NOTIFY_EMAIL,
  WAITLIST_ENDPOINT,
  WHATSAPP_URL,
  waitlistMailto,
} from "@/waitlist";

/** Brand marks kept to a single path each, colored via currentColor. */
function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.028C.533 9.046-.319 13.58.099 18.058a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.009c.12.099.246.198.373.292a.077.077 0 01-.006.128 12.3 12.3 0 01-1.873.891.076.076 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.418 0-1.334.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.417-2.157 2.417zm7.975 0c-1.183 0-2.157-1.085-2.157-2.418 0-1.334.955-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.42 0 1.332-.946 2.417-2.157 2.417z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.463 3.488A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}

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

/** One of the two community links in the three-way choice. */
function LinkTile({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="pl3-get__tile">
      <span className="pl3-get__tile-icon">{icon}</span>
      <span className="pl3-get__tile-label">{label}</span>
    </a>
  );
}

type State = "idle" | "sending" | "done" | "error";

/**
 * One field and one button, and the submit is the whole errand: the address
 * goes straight to the waitlist endpoint. Only if that fails does the mail
 * client get offered, and then as a link the visitor can choose - never as a
 * second window opening on its own.
 */
function WaitlistForm() {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<State>("idle");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const address = email.trim();
    if (!address || state === "sending") return;

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
        Got it. We'll email you when Playlight is ready to open the door.
      </p>
    );
  }

  return (
    <form className="pl3-get__form" onSubmit={submit}>
      <label className="sr-only" htmlFor="pl3-waitlist-email">
        Email address
      </label>
      <input
        ref={inputRef}
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
        {state === "sending" ? "Sending" : "Notify me"}
        <ArrowRight aria-hidden />
      </button>

      {state === "error" ? (
        <p className="pl3-get__hint" role="alert">
          That didn't send. <a href={waitlistMailto(email.trim())}>Send it to {NOTIFY_EMAIL}</a> and
          we'll reach out by hand.
        </p>
      ) : (
        <p className="pl3-get__hint">We'll email you once, the day it opens. Nothing else.</p>
      )}
    </form>
  );
}

/**
 * Mounted once per page. Uses a native <dialog>, so focus trapping, Esc to
 * dismiss and the inert backdrop come from the platform - and the top layer
 * escapes the 3D scene's transforms entirely.
 */
export function GetPlaylightPanel() {
  const ref = React.useRef<HTMLDialogElement | null>(null);
  const opener = React.useRef<HTMLElement | null>(null);
  const [showEmail, setShowEmail] = React.useState(false);

  React.useEffect(() => {
    const onOpen = () => {
      opener.current = consumeTrigger();
      setShowEmail(false);
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
          Three ways in.
        </h2>
        <p className="pl3-get__sub">Playlight is still being built. Pick how you'd like in.</p>

        <div className="pl3-get__tiles">
          <LinkTile href={DISCORD_URL} label="Discord" icon={<DiscordIcon />} />
          <LinkTile href={WHATSAPP_URL} label="WhatsApp" icon={<WhatsAppIcon />} />
          <button
            type="button"
            className="pl3-get__tile"
            aria-expanded={showEmail}
            onClick={() => setShowEmail((v) => !v)}
          >
            <span className="pl3-get__tile-icon">
              <Mail aria-hidden />
            </span>
            <span className="pl3-get__tile-label">Email</span>
          </button>
        </div>

        {showEmail ? <WaitlistForm /> : null}

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

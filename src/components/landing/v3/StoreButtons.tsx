import { APP_STORE_URL, PLAY_STORE_URL } from "@/stores";

/** Brand marks kept to a single path each, colored via currentColor. */
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202c1.302.661 1.302 2.733 0 3.394zM1.337.924a1.986 1.986 0 00-.112.568v21.017c0 .217.045.419.124.6l10.715-10.646L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a2.045 2.045 0 00-1.051-.188l11.145 10.982zm0 2.067l-11.1 11.021c.337.033.68-.042.983-.223l13.358-7.562-3.24-3.236z" />
    </svg>
  );
}

/**
 * The call to action, as little as it can be: one word, "Download", and the
 * two stores' marks beside it - each mark is the link to its store. One
 * thing to read, two places to tap, instead of two long buttons that both
 * say "Download on the ...".
 *
 * The "quiet" variant is the same thing, smaller, in the header bar. The
 * word is a label, not a link: each mark carries the full phrase for
 * screen readers ("Download on the App Store"), because a bare logo does
 * not say what pressing it does.
 */
export function StoreButtons({
  variant = "solid",
  className = "",
}: {
  variant?: "solid" | "quiet";
  className?: string;
}) {
  return (
    <div className={`pl3-stores ${className}`} data-variant={variant}>
      <span className="pl3-stores__label" aria-hidden>
        Download
      </span>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="pl3-store"
        data-variant={variant}
        data-store="apple"
        aria-label="Download on the App Store"
        title="App Store"
      >
        <AppleIcon />
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="pl3-store"
        data-variant={variant}
        data-store="play"
        aria-label="Download on Google Play"
        title="Google Play"
      >
        <PlayIcon />
      </a>
    </div>
  );
}

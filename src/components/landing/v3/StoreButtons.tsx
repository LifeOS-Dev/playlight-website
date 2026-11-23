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
 * The call to action: one button per store, side by side.
 *
 * A phone sees only its own store's button - a second one it cannot use is
 * only something more to read. Which one is pure CSS off <html
 * data-platform>, set before the first paint (see __root.tsx); a desktop,
 * or a page with no script, shows both.
 *
 * The "quiet" variant rides in the header bar, where the labels shorten to
 * the store's name - the full phrase is kept for screen readers, because
 * "App Store" alone does not say what pressing it does.
 */
export function StoreButtons({
  variant = "solid",
  className = "",
}: {
  variant?: "solid" | "quiet";
  className?: string;
}) {
  const short = variant === "quiet";

  return (
    <div className={`pl3-stores ${className}`} data-variant={variant}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="pl3-store"
        data-variant={variant}
        data-store="apple"
        aria-label="Download on the App Store"
      >
        <span className="pl3-store__icon">
          <AppleIcon />
        </span>
        <span className="pl3-store__label">
          {short ? "App Store" : "Download on the App Store"}
        </span>
      </a>

      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="pl3-store"
        data-variant={variant}
        data-store="play"
        aria-label="Download on the Play Store"
      >
        <span className="pl3-store__icon">
          <PlayIcon />
        </span>
        <span className="pl3-store__label">
          {short ? "Play Store" : "Download on the Play Store"}
        </span>
      </a>
    </div>
  );
}

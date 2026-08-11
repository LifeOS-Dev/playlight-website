import { Link } from "@tanstack/react-router";
import { openGetPlaylight } from "../v3/getPlaylight";

/**
 * Closing CTA — still one job, and now the same job as everywhere else:
 * it opens the one waitlist panel the site has, instead of keeping its own
 * pair of store buttons that led nowhere.
 */
export function StoryCta() {
  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={(e) => openGetPlaylight(e.currentTarget)}
        className="inline-flex items-center gap-3 rounded-[14px] bg-[#FFA32B] px-6 py-3 text-sm font-medium text-[#15110A] transition-transform hover:-translate-y-0.5"
      >
        Get early access
      </button>

      <p className="text-sm text-[var(--story-ink-dim)]">
        Not out yet — one email, on the day it opens.
      </p>

      <Link
        to="/"
        className="mt-2 text-sm text-[var(--story-ink-dim)] transition-colors hover:text-[var(--story-ink)]"
      >
        ← back home
      </Link>
    </div>
  );
}

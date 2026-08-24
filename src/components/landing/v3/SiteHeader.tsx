import { Link } from "@tanstack/react-router";
import { TryToday } from "./TryToday";
import type { Vibe } from "@/components/landing/orb/ramp";

type Props = {
  /**
   * The light currently worn, and the way back to the gate. Both or
   * neither: the dot is only offered where there is a gate to reopen,
   * which today is the home page. The doc pages get the bar without it.
   */
  vibe?: Vibe;
  onChangeVibe?: () => void;
};

/**
 * One header for every page. The support and privacy pages used to carry a
 * different bar with a "stealth · building" badge, which made a footer link
 * feel like leaving for another product.
 */
export function SiteHeader({ vibe, onChangeVibe }: Props = {}) {
  return (
    <header className="pl3-nav">
      <Link to="/" className="pl3-nav__mark">
        playlight
      </Link>
      <nav className="pl3-nav__links" aria-label="Main">
        <Link to="/support">Support</Link>
        <Link to="/privacy">Privacy</Link>
        <TryToday variant="quiet" />
        {/* The dot is the label. A word here - "vibe", "colour", "theme" -
            would be the only piece of interface copy on a page that
            otherwise explains nothing, and the swatch says it better:
            this is the light you are wearing, and it can be changed. */}
        {vibe && onChangeVibe ? (
          <button
            type="button"
            className="pl3-nav__vibe"
            onClick={onChangeVibe}
            title="Change your vibe"
            aria-label={`Vibe: ${vibe.name}. Choose another.`}
          >
            <span className="pl3-nav__vibe-dot" aria-hidden />
          </button>
        ) : null}
      </nav>
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { TryToday } from "./TryToday";

/**
 * One header for every page. The support and privacy pages used to carry a
 * different bar with a "stealth · building" badge, which made a footer link
 * feel like leaving for another product.
 */
export function SiteHeader() {
  return (
    <header className="pl3-nav">
      <Link to="/" className="pl3-nav__mark">
        playlight
      </Link>
      <nav className="pl3-nav__links" aria-label="Main">
        <Link to="/support">Support</Link>
        <Link to="/privacy">Privacy</Link>
        <TryToday variant="quiet" />
      </nav>
    </header>
  );
}

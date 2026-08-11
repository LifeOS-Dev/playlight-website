import { Link } from "@tanstack/react-router";
import { TryToday } from "./TryToday";

export function V3Footer() {
  return (
    <footer className="pl3-footer">
      <div className="pl3-footer__close">
        <p className="pl3-footer__line">Come into the light.</p>
        <p className="pl3-footer__sub">Not for more noise. For a calmer next step.</p>
        <TryToday />
      </div>

      <div className="pl3-footer__base">
        <span className="pl3-footer__mark">playlight</span>

        <nav className="pl3-footer__nav" aria-label="Footer">
          <Link to="/privacy">Privacy</Link>
          <Link to="/support">Support</Link>
          <Link to="/about">Story</Link>
          <Link to="/delete">Delete account or data</Link>
        </nav>

        <span className="pl3-footer__legal">© Light Technologies</span>
      </div>
    </footer>
  );
}

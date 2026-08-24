import { Link } from "@tanstack/react-router";
import { DownloadButtons } from "./DownloadButtons";

export function V2Footer() {
  return (
    <footer className="pl2-footer">
      <div className="pl2-footer__close">
        <p className="pl2-footer__line">Come into the light.</p>
        <p className="pl2-footer__sub">Not for more noise. For a calmer next step.</p>
        <DownloadButtons />
      </div>

      <div className="pl2-footer__base">
        <span className="pl2-footer__mark">playlight</span>

        <nav className="pl2-footer__nav" aria-label="Footer">
          <Link to="/privacy">Privacy</Link>
          <Link to="/support">Support</Link>
          <Link to="/about">Story</Link>
          <Link to="/delete">Delete account or data</Link>
        </nav>

        <span className="pl2-footer__legal">© Light Technologies</span>
      </div>
    </footer>
  );
}

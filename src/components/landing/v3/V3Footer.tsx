import { Link } from "@tanstack/react-router";
import { StoreButtons } from "./StoreButtons";
import { LINES } from "./narration";

export function V3Footer() {
  return (
    <footer className="pl3-footer">
      {/* The page's one close, after the proof and the questions. The light
          says it - "Your move.", back to the game the gate opened with - and
          the line under it is the plain fact a visitor needs to act on. */}
      <div className="pl3-footer__close">
        <p className="pl3-footer__line">{LINES.close.line}</p>
        <p className="pl3-footer__sub">{LINES.close.sub}</p>
        <StoreButtons />
      </div>

      <div className="pl3-footer__base">
        <span className="pl3-footer__mark">
          <span className="pl3-play">play</span>light
        </span>

        <nav className="pl3-footer__nav" aria-label="Footer">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/support">Support</Link>
          <Link to="/delete">Delete account or data</Link>
        </nav>

        <span className="pl3-footer__legal">© Light Technologies</span>
      </div>
    </footer>
  );
}

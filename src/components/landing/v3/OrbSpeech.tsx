import * as React from "react";

/**
 * What the light says while it is still with you, before the road takes over.
 * Short, spoken, no product pitch - the hero copy already does that job.
 */
const LINES = [
  "I see the whole of it.",
  "Not more noise.",
  "Walk when you're ready.",
] as const;

const GO_LINE = "Let's move forward.";

const CHAR_MS = 22;
const GO_CHAR_MS = 12;
const HOLD_MS = 2600;
const OUT_MS = 720;
const GAP_MS = 380;
const ARRIVE_MS = 1200;

function inDuration(text: string, charMs: number) {
  return 480 + text.length * charMs;
}

function renderChars(text: string, key: string, charMs: number) {
  return Array.from(text).map((ch, i) => (
    <span key={`${key}-${i}`} className="pl3-say__ch" style={{ animationDelay: `${i * charMs}ms` }}>
      {ch === " " ? "\u00a0" : ch}
    </span>
  ));
}

/**
 * A line of speech tethered to the orb. No box, no tail, no caret - the
 * words condense out of the glow and fall back into it.
 *
 * Idle lines cycle at rest. The first scroll sets data-speech="go" on .pl3,
 * and the light cuts to the forward line before it visibly leans.
 */
export function OrbSpeech() {
  const [index, setIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<"in" | "out">("in");
  const [ready, setReady] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [go, setGo] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  React.useEffect(() => {
    const root = document.querySelector(".pl3");
    if (!root) return;
    const sync = () => setGo(root.getAttribute("data-speech") === "go");
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["data-speech"] });
    sync();
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    if (go) setPhase("in");
  }, [go]);

  React.useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const t = window.setTimeout(() => setReady(true), ARRIVE_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  React.useEffect(() => {
    if (!ready || reduced || go) return;
    const text = LINES[index];
    const stay = inDuration(text, CHAR_MS) + HOLD_MS;
    const out = window.setTimeout(() => setPhase("out"), stay);
    const next = window.setTimeout(() => {
      setIndex((i) => (i + 1) % LINES.length);
      setPhase("in");
    }, stay + OUT_MS + GAP_MS);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(next);
    };
  }, [index, ready, reduced, go]);

  if (!ready && !go) return null;

  const text = go ? GO_LINE : reduced ? LINES[0] : LINES[index];
  const key = go ? "go" : String(index);
  const charMs = go ? GO_CHAR_MS : CHAR_MS;

  return (
    <p className="pl3-say" aria-hidden="true">
      <span key={key} className={"pl3-say__line" + (phase === "out" && !go ? " is-out" : "")}>
        {reduced ? text : renderChars(text, key, charMs)}
      </span>
    </p>
  );
}

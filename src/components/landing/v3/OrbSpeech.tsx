import * as React from "react";

/**
 * What the light says while it is still with you, before the road takes over.
 * Short, spoken, no product pitch - the hero copy already does that job.
 */
const LINES = ["I see the whole of it.", "Not more noise.", "Walk when you're ready."] as const;

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
 * Idle lines cycle at rest. Touch a facet on the life map and it puts that
 * facet's readout in data-say on .pl3, which the light says instead - eight
 * streams in, one sentence out. The first scroll sets data-speech="go" and
 * the light cuts to the forward line before it visibly leans.
 */
export function OrbSpeech() {
  const [index, setIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<"in" | "out">("in");
  const [ready, setReady] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [go, setGo] = React.useState(false);
  const [said, setSaid] = React.useState<string | null>(null);

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
    const sync = () => {
      setGo(root.getAttribute("data-speech") === "go");
      setSaid(root.getAttribute("data-say"));
    };
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["data-speech", "data-say"] });
    sync();
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    if (go || said) setPhase("in");
  }, [go, said]);

  React.useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const t = window.setTimeout(() => setReady(true), ARRIVE_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  React.useEffect(() => {
    if (!ready || reduced || go || said) return;
    const text = LINES[index];
    const stay = inDuration(text, CHAR_MS) + HOLD_MS;
    const out = window.setTimeout(() => setPhase("out"), stay);
    const next = window.setTimeout(
      () => {
        setIndex((i) => (i + 1) % LINES.length);
        setPhase("in");
      },
      stay + OUT_MS + GAP_MS,
    );
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(next);
    };
  }, [index, ready, reduced, go, said]);

  if (!ready && !go && !said) return null;

  // A readout answers a touch, so it lands at once - the idle pace would
  // still be typing itself out after the pointer had moved on.
  const text = go ? GO_LINE : (said ?? (reduced ? LINES[0] : LINES[index]));
  const key = go ? "go" : said ? `say:${said}` : String(index);
  const charMs = go || said ? GO_CHAR_MS : CHAR_MS;

  return (
    <p className="pl3-say" aria-hidden="true">
      <span
        key={key}
        className={"pl3-say__line" + (phase === "out" && !go && !said ? " is-out" : "")}
      >
        {reduced ? text : renderChars(text, key, charMs)}
      </span>
    </p>
  );
}

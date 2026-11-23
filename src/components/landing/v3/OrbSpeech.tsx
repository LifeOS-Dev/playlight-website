import * as React from "react";
import { lightSpeak } from "@/components/landing/orb/lightCue";
import { LINES, WORD_MS, wordsOf } from "./narration";

/**
 * Light's voice at the top of the page: the hero, and the empty road after it.
 *
 * One line at a time, condensing out of the glow on the orb's crown - between
 * the ring it is talking about and the light itself, so the eye runs from the
 * pieces, to the sentence, to the light. No box, no tail, no caret.
 *
 * The beats, at rest:
 *   hello  "Hi. I'm Light." - only to a visitor who did not just meet it at
 *          the gate; someone who did has heard it introduce itself already.
 *   intro  the brand in the light's own words, held.
 *   hint   after a quiet spell with no facet touched: the demo, offered in
 *          the light's voice instead of a 10px label in a corner. Held.
 *
 * Touching a facet puts that facet's readout in data-say on .pl3 (LifeMap),
 * which the light says at once; letting go returns it to the intro. The first
 * scroll sets data-speech="go": the light says the go line and holds it down
 * the empty road, until the VIN cards arrive and their own voice takes over.
 *
 * Every line is said once. Coming back to one - the intro after a readout -
 * shows it whole rather than saying it again. And while a line is being
 * said, the light acts it out (lightCue.ts): a beat of thinking, then a warm
 * pulse per word.
 */

type Stage = "wait" | "hello" | "intro" | "hint";

type Line = {
  key: string;
  text: string;
  /** ms of thinking before the first word; 0 for none. */
  think: number;
  /** ms between words. */
  every: number;
};

/** First word on a page with no gate in front of it. */
const ARRIVE_MS = 900;
/** First word after the gate has handed its light over. */
const AFTER_GATE_MS = 240;
const THINK_MS = 650;
const HOLD_HELLO_MS = 1300;
/** How long the intro stands, said, before the demo is offered. */
const IDLE_MS = 5000;

const spokenFor = (l: Pick<Line, "text" | "think" | "every">) =>
  l.think + wordsOf(l.text).length * l.every + 600;

export function OrbSpeech() {
  const [reduced, setReduced] = React.useState(false);
  const [touch, setTouch] = React.useState(false);

  // What the page says about itself, on its root.
  const [gateUp, setGateUp] = React.useState(true);
  const [met, setMet] = React.useState(false);
  const [go, setGo] = React.useState(false);
  const [said, setSaid] = React.useState<string | null>(null);

  const [stage, setStage] = React.useState<Stage>("wait");
  const [touched, setTouched] = React.useState(false);
  /** Taken once, the first time the gate is out of the way. */
  const [start, setStart] = React.useState<null | { met: boolean; reduced: boolean }>(null);

  React.useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hv = window.matchMedia("(hover: none)");
    const sync = () => {
      setReduced(rm.matches);
      setTouch(hv.matches);
    };
    sync();
    rm.addEventListener("change", sync);
    hv.addEventListener("change", sync);
    return () => {
      rm.removeEventListener("change", sync);
      hv.removeEventListener("change", sync);
    };
  }, []);

  React.useEffect(() => {
    const root = document.querySelector(".pl3");
    if (!root) return;
    const sync = () => {
      setGateUp(root.hasAttribute("data-gate"));
      setMet(root.hasAttribute("data-met"));
      setGo(root.getAttribute("data-speech") === "go");
      setSaid(root.getAttribute("data-say"));
    };
    const obs = new MutationObserver(sync);
    obs.observe(root, {
      attributes: true,
      attributeFilter: ["data-gate", "data-met", "data-speech", "data-say"],
    });
    sync();
    return () => obs.disconnect();
  }, []);

  // The light starts talking once there is nothing in front of it - and only
  // then. Reopening the gate later from the header does not start it over.
  React.useEffect(() => {
    if (!gateUp && start === null) setStart({ met, reduced });
  }, [gateUp, met, reduced, start]);

  React.useEffect(() => {
    if (!start) return;
    const timers: number[] = [];
    if (start.met || start.reduced) {
      timers.push(window.setTimeout(() => setStage("intro"), start.reduced ? 0 : AFTER_GATE_MS));
    } else {
      timers.push(window.setTimeout(() => setStage("hello"), ARRIVE_MS));
      const hello = spokenFor({ text: LINES.hero.hello, think: 500, every: WORD_MS });
      timers.push(window.setTimeout(() => setStage("intro"), ARRIVE_MS + hello + HOLD_HELLO_MS));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [start]);

  // A touched facet is the demo found: the offer is never needed again.
  React.useEffect(() => {
    if (said) setTouched(true);
  }, [said]);

  React.useEffect(() => {
    if (stage !== "intro" || touched || go) return;
    const after = spokenFor({ text: LINES.hero.intro, think: THINK_MS, every: WORD_MS }) + IDLE_MS;
    const id = window.setTimeout(() => setStage("hint"), after);
    return () => window.clearTimeout(id);
  }, [stage, touched, go]);

  let line: Line | null = null;
  if (go) line = { key: "go", text: LINES.hero.go, think: 0, every: 45 };
  else if (said) line = { key: `say:${said}`, text: said, think: 0, every: 28 };
  else if (stage === "hint" && !touched)
    line = {
      key: "hint",
      text: touch ? LINES.hero.hint.touch : LINES.hero.hint.pointer,
      think: 500,
      every: WORD_MS,
    };
  else if (stage === "intro" || stage === "hint")
    line = { key: "intro", text: LINES.hero.intro, think: THINK_MS, every: WORD_MS };
  else if (stage === "hello") line = { key: "hello", text: LINES.hero.hello, think: 500, every: WORD_MS };

  // Said once: the first showing of a line is spoken, any later one is simply
  // there. Decided once per showing, in an effect, so a re-render mid-sentence
  // can never flip a line from spoken to shown and cut it off.
  const shown = React.useRef(new Set<string>());
  const [display, setDisplay] = React.useState<null | { line: Line; instant: boolean }>(null);
  const lineKey = line?.key ?? "";
  const lineText = line?.text ?? "";
  React.useEffect(() => {
    if (!line) {
      setDisplay(null);
      return;
    }
    const instant = reduced || shown.current.has(line.key);
    shown.current.add(line.key);
    setDisplay({ line, instant });
    // `line` is rebuilt every render; its key and text are what identify it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineKey, lineText, reduced]);

  // The light acts out what it is saying.
  React.useEffect(() => {
    if (!display || display.instant) return;
    const { line: l } = display;
    return lightSpeak(wordsOf(l.text).length, { thinkMs: l.think, everyMs: l.every });
  }, [display]);

  if (!display) return null;
  const { line: l, instant } = display;

  return (
    <p className="pl3-say" aria-hidden="true">
      <span
        key={l.key}
        className="pl3-say__line"
        data-instant={instant ? "" : undefined}
        style={{ "--think": `${l.think}ms`, "--every": `${l.every}ms` } as React.CSSProperties}
      >
        {!instant && l.think > 0 ? (
          <span className="pl3-say__think">
            <i />
            <i />
            <i />
          </span>
        ) : null}
        {wordsOf(l.text).map((w, i) => (
          <React.Fragment key={i}>
            <span className="pl3-say__w" style={{ "--i": i } as React.CSSProperties}>
              {w}
            </span>{" "}
          </React.Fragment>
        ))}
      </span>
    </p>
  );
}

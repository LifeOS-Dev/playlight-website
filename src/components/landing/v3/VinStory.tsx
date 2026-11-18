import * as React from "react";
import { VinPicture } from "./VinPicture";
import { INSIGHT, NAV_NOTE, RINGS, VIN, VIN_STEPS, type VinStage, type VinStep } from "./vin";
import "./vin.css";

export type VinFrame = {
  /** Which state the card is in. Changes play as timed transitions, never scrubbed. */
  step: VinStep;
  /** Depth of the cards on the road, in px - negative is further away. */
  z: number;
  /** Opacity of the cards themselves. */
  o: number;
  /** Opacity of everything around them: the title, the tabs, the light's voice. */
  ui: number;
};

export type VinHandle = {
  /** Driven by the road's single scroll handler. */
  drive: (frame: VinFrame) => void;
};

/**
 * Here's how Light helps you: the VIN model, told on the road.
 *
 * Three cards come up out of the horizon together - Visualize, Interpret,
 * Navigate - standing in an arc, each with a glimpse of what it does. The
 * next scroll folds them into one card, and from then on that one card is
 * the whole story: it shows everything about you, then joins three of those
 * things into an insight, then stands those same three up as steps.
 *
 * Underneath, the light says what each one is in a single sentence, the way
 * it would in the app - a beat of thinking while the picture changes, then
 * the words. Never both moving at once: one thing at a time is the product's
 * promise, so it is the page's rule too.
 *
 * Travel along the road (arriving, passing the camera) is scrubbed by scroll
 * like everything else on it. The change from one state to the next is not:
 * crossing a threshold plays the whole transformation through, so a reader
 * who stops scrolling is never left looking at a picture caught halfway.
 */
export const VinStory = React.forwardRef<VinHandle>(function VinStory(_props, ref) {
  const [step, setStep] = React.useState<VinStep>("intro");
  const stepRef = React.useRef<VinStep>("intro");
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const worldRef = React.useRef<HTMLDivElement | null>(null);
  const shownRef = React.useRef(true);

  React.useImperativeHandle(
    ref,
    () => ({
      drive({ step: next, z, o, ui }) {
        if (next !== stepRef.current) {
          stepRef.current = next;
          setStep(next);
        }
        const world = worldRef.current;
        const root = rootRef.current;
        if (world) {
          world.style.transform = `translate3d(0, 0, ${z.toFixed(1)}px)`;
          world.style.opacity = o.toFixed(3);
        }
        if (root) {
          root.style.setProperty("--vin-ui", ui.toFixed(3));
          // Out of the frame entirely: off the hit-test and out of the
          // accessibility tree, so nobody tabs into a card that isn't there.
          const shown = o > 0.02 || ui > 0.02;
          if (shown !== shownRef.current) {
            shownRef.current = shown;
            root.style.visibility = shown ? "" : "hidden";
            root.toggleAttribute("aria-hidden", !shown);
          }
        }
      },
    }),
    [],
  );

  const at = step === "intro" ? -1 : VIN_STEPS.indexOf(step);

  return (
    <div ref={rootRef} className="pl3-vin" data-step={step}>
      <div className="pl3-vin__top">
        <div className="pl3-vin__head">
          <h2 className="pl3-vin__title">
            Here's how Light helps you through its{" "}
            <span className="pl3-vin__acro" aria-label="VIN">
              <span>V</span>
              <span>I</span>
              <span>N</span>
            </span>{" "}
            model
          </h2>
          <p className="pl3-vin__pun">
            Designed to make you <em>win</em>. Pun intended.
          </p>
        </div>

        <ol className="pl3-vin__tabs" aria-label="The VIN model">
          {VIN_STEPS.map((k, j) => (
            <li
              key={k}
              className="pl3-vin__tab"
              data-on={j === at ? "" : undefined}
              data-done={j < at ? "" : undefined}
              aria-current={j === at ? "step" : undefined}
            >
              <span>
                <span className="pl3-vin__tab-l">{VIN[k].letter}</span>
                {VIN[k].rest}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div ref={worldRef} className="pl3-vin__world">
        <div className="pl3-vin__trio" aria-hidden={step !== "intro"}>
          {VIN_STEPS.map((k) => (
            <article key={k} className="pl3-vin__mini" data-k={k}>
              <h3 className="pl3-vin__mini-word">
                <span className="pl3-vin__mini-l">{VIN[k].letter}</span>
                {VIN[k].rest}
              </h3>
              <div className="pl3-vin__mini-art">
                <MiniArt kind={k} />
              </div>
            </article>
          ))}
        </div>

        {/* Three into one: the cards go into the light, and the light is
            where the card's own heart comes up. */}
        {step === "v" ? <span className="pl3-vin__merge" aria-hidden="true" /> : null}

        <div className="pl3-vin__card" aria-hidden={step === "intro"}>
          <VinPicture step={step} />
          <CardFoot step={step} />
        </div>
      </div>

      <Voice step={step} />

      {/* The same sentence for anyone listening rather than watching. */}
      <p className="pl3-vin__sr" aria-live="polite">
        {step === "intro" ? "" : `${VIN[step].word}. ${VIN[step].says}`}
      </p>

      <VinStill />
    </div>
  );
});

/** What sits under the picture: a key, then the insight, then where you are. */
function CardFoot({ step }: { step: VinStep }) {
  return (
    <div className="pl3-vin__foot" data-step={step}>
      <ul className="pl3-vin__legend">
        {RINGS.map((ring, i) => (
          <li key={ring.kind} style={{ "--ring": i } as React.CSSProperties}>
            <span className="vin-key" data-kind={ring.kind} aria-hidden="true" />
            {ring.label}
          </li>
        ))}
      </ul>
      <p className="pl3-vin__insight">
        <span className="pl3-vin__insight-tag">{INSIGHT.tag}</span>
        {INSIGHT.text}
      </p>
      <p className="pl3-vin__nav">{NAV_NOTE}</p>
    </div>
  );
}

/**
 * The light, talking. A beat of thinking while the picture changes above it,
 * then one sentence, word by word, condensing out of the glow the way the
 * orb speaks at the top of the page. Silent while the three cards stand
 * together: the title above them has just said what they are.
 */
function Voice({ step }: { step: VinStep }) {
  if (step === "intro") return <div className="pl3-vin__voice" aria-hidden="true" />;
  const words = VIN[step].says.split(" ");

  return (
    <div className="pl3-vin__voice" aria-hidden="true">
      <div key={step} className="pl3-vin__said">
        <span className="pl3-vin__think">
          <i />
          <i />
          <i />
        </span>
        <p className="pl3-vin__words">
          {words.map((w, i) => (
            <React.Fragment key={i}>
              <span className="pl3-vin__w" style={{ "--w": i } as React.CSSProperties}>
                {w}
              </span>{" "}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}

/**
 * Motion reduced: the same three states, laid out as a column and never
 * changing. The picture is kept; only the travel goes.
 */
function VinStill() {
  return (
    <div className="pl3-vin__still">
      <h2 className="pl3-vin__title">
        Here's how Light helps you through its <span className="pl3-vin__acro">VIN</span> model
      </h2>
      <p className="pl3-vin__pun">
        Designed to make you <em>win</em>. Pun intended.
      </p>
      {VIN_STEPS.map((k: VinStage) => (
        <section key={k} className="pl3-vin__still-step" aria-label={VIN[k].word}>
          <h3 className="pl3-vin__still-name">
            <span className="pl3-vin__tab-l">{VIN[k].letter}</span>
            {VIN[k].rest}
          </h3>
          <div className="pl3-vin__card" data-still="">
            <VinPicture step={k} still />
            <CardFoot step={k} />
          </div>
          <p className="pl3-vin__still-says">{VIN[k].says}</p>
        </section>
      ))}
    </div>
  );
}

/** A glimpse of each state, small enough to stand three abreast. */
function MiniArt({ kind }: { kind: VinStage }) {
  if (kind === "v") {
    const rings = [
      [16, 8],
      [30, 15],
      [44, 22],
      [56, 29],
    ];
    const dots: Array<[number, number, number]> = [
      [60, 32, 0],
      [44, 40, 0],
      [76, 40, 0],
      [35, 31, 1],
      [86, 51, 1],
      [97, 27, 2],
      [22, 52, 2],
      [41, 13, 3],
      [83, 67, 3],
      [109, 46, 3],
    ];
    return (
      <svg viewBox="0 0 120 80" className="vin-mini" aria-hidden="true">
        {rings.map(([rx, ry], i) => (
          <ellipse key={`b${i}`} className="vin-mini__band" cx={60} cy={40} rx={rx} ry={ry} />
        ))}
        {rings.map(([rx, ry], i) => (
          <ellipse key={`o${i}`} className="vin-mini__orbit" cx={60} cy={40} rx={rx} ry={ry} />
        ))}
        {dots.map(([x, y, r], i) => (
          <circle
            key={i}
            className="vin-mini__dot"
            data-r={r}
            cx={x}
            cy={y}
            r={r === 0 ? 1.9 : r === 3 ? 1.5 : 1.7}
          />
        ))}
        <circle className="vin-mini__heart" cx={60} cy={40} r={3.4} />
      </svg>
    );
  }

  if (kind === "i") {
    const a: Pt = [24, 18];
    const b: Pt = [96, 18];
    const c: Pt = [60, 66];
    const h: Pt = [60, 38];
    return (
      <svg viewBox="0 0 120 80" className="vin-mini" aria-hidden="true">
        <ellipse className="vin-mini__band" cx={60} cy={38} rx={22} ry={13} />
        <path className="vin-mini__edge" d={bow(a, b, -0.08)} />
        <path className="vin-mini__edge" d={bow(b, c, -0.1)} />
        <path className="vin-mini__edge" d={bow(c, a, -0.1)} />
        {[a, b, c].map((p, i) => (
          <React.Fragment key={i}>
            <path className="vin-mini__spoke" d={bow(p, h, 0.16)} />
            <circle className="vin-mini__node" cx={p[0]} cy={p[1]} r={2.6} />
          </React.Fragment>
        ))}
        <circle className="vin-mini__heart" cx={h[0]} cy={h[1]} r={3.4} />
      </svg>
    );
  }

  const rows = [
    [18, 102],
    [40, 88],
    [62, 76],
  ];
  return (
    <svg viewBox="0 0 120 80" className="vin-mini" aria-hidden="true">
      <line className="vin-mini__track" x1={20} y1={18} x2={20} y2={62} />
      {rows.map(([y, end], i) => (
        <React.Fragment key={i}>
          <line
            className="vin-mini__bar"
            data-first={i === 0 ? "" : undefined}
            x1={32}
            y1={y}
            x2={end}
            y2={y}
          />
          {i === 0 ? (
            <circle className="vin-mini__heart" cx={20} cy={y} r={3.4} />
          ) : (
            <circle className="vin-mini__step" cx={20} cy={y} r={2.6} />
          )}
        </React.Fragment>
      ))}
    </svg>
  );
}

type Pt = [number, number];

function bow(a: Pt, b: Pt, bend: number) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return `M${a[0]} ${a[1]}Q${(mx - dy * bend).toFixed(1)} ${(my + dx * bend).toFixed(1)} ${b[0]} ${b[1]}`;
}

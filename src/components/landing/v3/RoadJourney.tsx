import * as React from "react";
import { StoreButtons } from "./StoreButtons";
import { LifeMap, type LifeMapHandle } from "./LifeMap";
import { VinStory, type VinHandle } from "./VinStory";
import { SolveCollage, type SolveHandle } from "./SolveCollage";
import { SOLVES, type VinStep } from "./vin";
import { DEPART_TRAVEL, LIGHT, ROAD, STAGE_SCREENS, zForScale } from "./roadPlan";
import "./road.css";

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Cut the number of distinct values written per frame, so paint isn't redone
 *  for a change nobody can see. */
const step = (n: number, s: number) => Math.round(n / s) * s;

/** 0 -> 1 across [from, to]. */
const span = (s: number, from: number, to: number) => clamp01((s - from) / (to - from));

/** Which VIN state a point on the road belongs to, in screens travelled. */
const vinStepAt = (s: number): VinStep =>
  s < ROAD.vin.v ? "intro" : s < ROAD.vin.i ? "v" : s < ROAD.vin.n ? "i" : "n";

/**
 * Something coming up the road and then past you: grows out of the vanishing
 * point at a steady apparent speed, holds, then passes the camera - falling
 * away quicker than it arrived, so what is behind you never competes with
 * what is ahead.
 */
const travelZ = (arrive: number, pass: number) =>
  pass > 0 ? lerp(0, 560, pass) : zForScale(lerp(ROAD.vin.bornScale, 1, arrive));
const travelO = (arrive: number, pass: number) => clamp01(arrive / 0.45) * (1 - pass) ** 2.4;

/**
 * The road: one continuous forward journey.
 *
 * At rest the eight life facets ring the light and are wired into it - the
 * whole of a life visible in one frame, and visibly one system. Scrolling
 * drives the camera forward: the ring rushes past, a point of light shows on
 * the horizon, and out of it come three cards - how Light helps you, as the
 * VIN model. They fold into one card that visualizes, interprets and then
 * navigates, while the light below says what each of those means. As that
 * card passes, what it all solves comes up the road behind it as a collage
 * of five tiles. Then the road opens.
 *
 * All travel is written straight to the DOM from one scroll handler. React
 * renders only when the VIN card changes state - four times on the whole
 * road - never while you travel.
 */
export function RoadJourney() {
  const section = React.useRef<HTMLElement | null>(null);
  const mapRef = React.useRef<LifeMapHandle | null>(null);
  const vinRef = React.useRef<VinHandle | null>(null);
  const solveRef = React.useRef<SolveHandle | null>(null);
  const heroRef = React.useRef<HTMLDivElement | null>(null);
  const signalRef = React.useRef<HTMLDivElement | null>(null);
  const philRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = section.current;
    if (!el) return;
    const root = el.closest(".pl3") as HTMLElement | null;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      const rect = el.getBoundingClientRect();
      const pinned = rect.top <= 1 && rect.bottom > window.innerHeight - 1;
      const past = rect.bottom <= window.innerHeight;

      if (pinned) root.setAttribute("data-road", "");
      else root.removeAttribute("data-road");

      const p = clamp01(-rect.top / travel);
      /** Screens of road travelled - every beat on the road is planned in these. */
      const s = p * STAGE_SCREENS;

      // ── Phase 1: the camera leaves, the ring flies past ──────────
      const dep = clamp01(s / ROAD.depart);
      const camera = smooth(dep) * DEPART_TRAVEL;

      mapRef.current?.travel(camera, dep);

      if (heroRef.current) {
        const e = smooth(clamp01(dep / 0.75));
        heroRef.current.style.setProperty("--hero-scale", `${1 + e * 0.8}`);
        heroRef.current.style.opacity = `${e < 0.2 ? 1 : Math.max(0, 1 - smooth((e - 0.2) / 0.8))}`;
        heroRef.current.style.setProperty("--hero-blur", `${(e * e * 9).toFixed(2)}px`);
        // Opacity alone leaves the flown-away button clickable, and
        // `pointer-events: none` on this layer would not override the
        // button's own `auto`. Visibility does remove it from hit-testing.
        heroRef.current.style.visibility = e > 0.55 ? "hidden" : "";
      }

      // ── Phase 2: a point of light, then the VIN cards ────────────
      const V = ROAD.vin;
      if (signalRef.current) {
        const rise = smooth(span(s, V.sigIn, V.sigPeak));
        const fall = 1 - span(s, V.sigPeak, V.sigOut);
        const grow = span(s, V.sigIn, V.sigOut);
        signalRef.current.style.opacity = (rise * fall).toFixed(3);
        signalRef.current.style.setProperty("--sig-s", lerp(0.3, 2.6, grow).toFixed(3));
      }

      const arrive = smooth(span(s, V.arriveFrom, V.arriveTo));
      const pass = smooth(span(s, V.passFrom, V.passTo));
      // The words around the cards wait until the cards have landed, and
      // leave before they go.
      const ui = smooth(clamp01((arrive - 0.6) / 0.4)) * (1 - smooth(clamp01(pass / 0.45)));
      vinRef.current?.drive({
        step: vinStepAt(s),
        z: travelZ(arrive, pass),
        o: travelO(arrive, pass),
        ui,
      });

      // ── Phase 3: what it solves, up the road behind the card ─────
      // Five tiles, composed at once - each a beat behind the one before,
      // so the collage reads as assembling rather than as a queue.
      const S = ROAD.solve;
      const tiles = SOLVES.length;
      const each = (S.arriveTo - S.arriveFrom) * (1 - S.stagger * (tiles - 1));
      const sPass = smooth(span(s, S.passFrom, S.passTo));
      const sArrive = smooth(span(s, S.arriveFrom, S.arriveTo));
      const tz: number[] = [];
      const to: number[] = [];
      for (let i = 0; i < tiles; i++) {
        const from = S.arriveFrom + i * S.stagger * (S.arriveTo - S.arriveFrom);
        const a = smooth(span(s, from, from + each));
        tz.push(travelZ(a, sPass));
        to.push(travelO(a, sPass));
      }
      // One tile in focus at a time, walked by the scroll; -1 until they
      // have landed, and past the last one the collage holds as a whole.
      const focus =
        s < S.focusFrom ? -1 : Math.min(tiles, Math.floor((s - S.focusFrom) / S.focusEvery));
      solveRef.current?.drive({
        z: tz,
        o: to,
        ui: smooth(clamp01((sArrive - 0.5) / 0.5)) * (1 - smooth(clamp01(sPass / 0.45))),
        focus,
      });

      // ── Phase 4: the road opens out ──────────────────────────────
      const ph = span(s, ROAD.closeFrom, STAGE_SCREENS);
      if (philRef.current) {
        const o = smooth(ph);
        philRef.current.style.opacity = o.toFixed(3);
        // Opacity alone leaves the faded-in button clickable on the way
        // in. Visibility removes it from hit-testing.
        philRef.current.style.visibility = o > 0.08 ? "visible" : "hidden";
      }

      // Road pace: hard acceleration away from the hero, easing to a crawl as
      // the cards arrive and while there is something to read, a surge as
      // each thing passes, and a stop as the road opens out.
      let rush = smooth(dep);
      rush = lerp(rush, 0.1, arrive);
      rush = Math.max(rush, Math.sin(pass * Math.PI) * 0.7, Math.sin(sPass * Math.PI) * 0.7);
      rush *= 1 - smooth(ph);
      root.style.setProperty("--road-rush", step(past ? 0 : rush, 0.02).toFixed(2));

      if (!pinned) {
        root.style.setProperty("--speech-o", "0");
        root.removeAttribute("data-speech");
        return;
      }

      // First real scroll: the orb has not visibly leaned yet. Hold the
      // line through that lean, then dissolve as the hero starts to fly.
      if (dep > 0.012) root.setAttribute("data-speech", "go");
      else root.removeAttribute("data-speech");
      root.style.setProperty("--speech-o", (1 - smooth(clamp01((dep - 0.16) / 0.28))).toFixed(3));

      // ── The light itself ─────────────────────────────────────────
      // The hero flies and the light settles onto the road below the
      // horizon. As the cards arrive it drops onto the near road beneath
      // them - from there it does the talking - and it comes back up to
      // cruise once the card has passed.
      const near = smooth(clamp01(dep / 0.55));
      const gone = smooth(clamp01((dep - 0.42) / 0.58));
      let y = lerp(LIGHT.heroY, LIGHT.cruiseY, gone);
      let size = lerp(lerp(LIGHT.heroSize, 1.08, near), LIGHT.cruiseSize, gone);
      let glow = lerp(lerp(1.05, 1.35, near), 1.05, gone);
      let grid = lerp(1, 0.78, gone);
      const horizon = lerp(LIGHT.heroHorizon, LIGHT.cruiseHorizon, gone);

      // Under the cards it speaks from the near road; under the collage it
      // has nothing to say, so it steps further back and gives the tiles the
      // frame.
      const sit = arrive * (1 - sPass);
      y = lerp(y, LIGHT.vinY, sit);
      size = lerp(size, LIGHT.vinSize, sit);
      glow = lerp(glow, 1.2, sit);
      grid = lerp(grid, 0.62, sit);
      const back = sArrive * (1 - sPass);
      y = lerp(y, LIGHT.solveY, back);
      size = lerp(size, LIGHT.solveSize, back);
      glow = lerp(glow, 1.05, back);

      if (ph > 0) {
        // Arrival: the road opens out and the light comes back to cruise
        // under the closing line rather than sitting behind it.
        const e = smooth(ph);
        y = lerp(y, LIGHT.cruiseY, e);
        size = lerp(size, 0.92, e);
        glow = lerp(glow, 1.45, e);
        grid = lerp(grid, 0.34, e);
      }

      root.style.setProperty("--orb-x", "50vw");
      root.style.setProperty("--orb-y", `${y.toFixed(2)}vh`);
      root.style.setProperty("--orb-scale", size.toFixed(3));
      root.style.setProperty("--orb-i", glow.toFixed(3));
      root.style.setProperty("--grid-o", grid.toFixed(3));
      root.style.setProperty("--horizon", `${horizon.toFixed(2)}%`);
      root.style.setProperty("--road-speed", lerp(2.2, 7, smooth(ph)).toFixed(2));
    };

    if (reduced) {
      // Nothing flies, but the page keeps its identity: the ring composed
      // around the light exactly as it is at rest with motion on, then the
      // VIN model as three cards in a column. Reduce the motion, keep the
      // picture.
      mapRef.current?.travel(0, 0);
      if (philRef.current) {
        philRef.current.style.opacity = "1";
        philRef.current.style.visibility = "visible";
      }
      // Whole and still in the column, every drawing showing its answer.
      solveRef.current?.drive({
        z: SOLVES.map(() => 0),
        o: SOLVES.map(() => 1),
        ui: 1,
        focus: SOLVES.length,
      });

      // Park the light inside the composition rather than letting the page-wide
      // stops drag it up over the hero. Released once the road scrolls away so
      // the FAQ and footer still get their own placement.
      const scene = el.querySelector<HTMLElement>(".pl3-road__scene");
      const hold = () => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const own = r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
        const s = scene?.getBoundingClientRect();
        const atRing = !s || s.bottom > window.innerHeight * 0.5;
        if (own && !atRing) {
          // Reading the VIN column: the light stays on the road but drops to
          // its foot, small and quiet, so it never sits on a card's words.
          root.setAttribute("data-road", "");
          root.style.setProperty("--orb-y", "96vh");
          root.style.setProperty("--orb-x", "50vw");
          root.style.setProperty("--orb-scale", "0.5");
          root.style.setProperty("--orb-i", "0.6");
          root.style.setProperty("--grid-o", "0.3");
          root.style.setProperty("--speech-o", "0");
        } else if (own) {
          // The same pose the moving version rests in - the ring is laid out
          // around the vanishing point, so parking the light anywhere else
          // leaves the filaments converging on nothing.
          root.setAttribute("data-road", "");
          root.style.setProperty("--orb-y", `${LIGHT.heroY}vh`);
          root.style.setProperty("--orb-x", "50vw");
          root.style.setProperty("--orb-scale", String(LIGHT.heroSize));
          root.style.setProperty("--orb-i", "1");
          root.style.setProperty("--grid-o", "0.8");
          root.style.setProperty("--horizon", `${LIGHT.heroHorizon}%`);
          root.style.setProperty("--speech-o", "1");
        } else {
          root.removeAttribute("data-road");
          root.style.setProperty("--speech-o", "0");
        }
      };
      hold();
      const onQuiet = () => {
        if (raf) return;
        raf = requestAnimationFrame(hold);
      };
      window.addEventListener("scroll", onQuiet, { passive: true });
      window.addEventListener("resize", onQuiet);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onQuiet);
        window.removeEventListener("resize", onQuiet);
        root.removeAttribute("data-road");
        root.removeAttribute("data-speech");
        root.style.removeProperty("--speech-o");
      };
    }

    apply();
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.removeAttribute("data-road");
      root.removeAttribute("data-speech");
      root.style.removeProperty("--road-rush");
      root.style.removeProperty("--speech-o");
    };
  }, []);

  return (
    <section
      ref={section}
      className="pl3-road"
      style={{ height: `${(1 + STAGE_SCREENS) * 100}vh` }}
      aria-label="Playlight - how Light helps you visualize, interpret, and navigate life"
    >
      <div className="pl3-road__stage">
        {/* Ringed around the light and wired into it: the whole of a life,
            at once, and visibly one system rather than eight apps. */}
        <LifeMap ref={mapRef} />

        {/* What comes next, still only a point of light on the road */}
        <div ref={signalRef} className="pl3-road__signal" aria-hidden="true">
          <span className="pl3-road__signal-core" />
          <span className="pl3-road__signal-ring" />
        </div>

        {/* Visualize, interpret, navigate - three cards that become one. */}
        <VinStory ref={vinRef} />

        {/* What all of that solves, as one collage. */}
        <SolveCollage ref={solveRef} />

        {/* Hero rides at the front of the camera and flies past first */}
        <div ref={heroRef} className="pl3-road__hero">
          <h1 className="pl3-road__mark">playlight</h1>
          <p className="pl3-road__line">
            Your personalized OS to help you visualize, interpret, and navigate life.
          </p>
          <StoreButtons />
          <span className="pl3-road__cue" aria-hidden="true" />
        </div>

        <div ref={philRef} className="pl3-road__phil">
          <p className="pl3-road__phil-line">Come into the light.</p>
          <p className="pl3-road__phil-sub">Not more noise. A calmer next step.</p>
          <StoreButtons />
        </div>

        <a className="pl3-skip" href="#faq">
          Skip ahead
        </a>
      </div>
    </section>
  );
}

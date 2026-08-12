import * as React from "react";
import { TryToday } from "./TryToday";
import { FacetScene } from "./FacetScene";
import { FACES, FACETS, FACE_COUNT, type FacetId } from "./faces";
import { JOURNEY } from "./journey";
import { Motif } from "./motifs";
import {
  CAMERA_Z,
  DEPART_TRAVEL,
  FACET_PLACES,
  LIGHT,
  PHASE,
  STAGE_SCREENS,
  STATION,
  zForScale,
} from "./roadPlan";
import "./road.css";

const LABEL: Record<FacetId, string> = Object.fromEntries(
  FACETS.map((f) => [f.id, f.label]),
) as Record<FacetId, string>;

const LINE: Record<string, string> = Object.fromEntries(JOURNEY.map((b) => [b.id, b.line]));

const pad = (n: number) => String(n).padStart(2, "0");

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Cut the number of distinct values written per frame, so paint isn't redone
 *  for a change nobody can see. */
const step = (n: number, s: number) => Math.round(n / s) * s;

/** Fade a card as it reaches, then passes, the camera. */
function depthOpacity(z: number) {
  if (z > CAMERA_Z) return 0;
  if (z > CAMERA_Z - 260) return 1 - (z - (CAMERA_Z - 260)) / 260;
  if (z < -520) return clamp01((z + 760) / 240);
  return 1;
}

/**
 * The road: one continuous forward journey.
 *
 * At rest the eight life facets are composed around the light - the whole of a
 * life visible in one frame. Scrolling drives the camera forward: the facets
 * rush past, then the road ahead is empty except for a point of light above
 * the orb. Each point grows into a numbered problem, the light sweeps across
 * it and it becomes the answer, and it flies past. Six of those, then the
 * road opens.
 *
 * A compass at the top of the stage (03 / 06 · name) stays put the whole
 * way, so a loaded mind always knows where it is. All motion is written
 * straight to the DOM from one scroll handler - React never re-renders
 * while you travel.
 */
export function RoadJourney() {
  const section = React.useRef<HTMLElement | null>(null);
  const sceneRef = React.useRef<HTMLDivElement | null>(null);
  const heroRef = React.useRef<HTMLDivElement | null>(null);
  const facetRefs = React.useRef<Array<HTMLElement | null>>([]);
  const plateRefs = React.useRef<Array<HTMLElement | null>>([]);
  const signalRef = React.useRef<HTMLDivElement | null>(null);
  const philRef = React.useRef<HTMLDivElement | null>(null);
  const railRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const stopRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const hudRef = React.useRef<HTMLDivElement | null>(null);
  const hudNumRef = React.useRef<HTMLSpanElement | null>(null);
  const hudNameRef = React.useRef<HTMLSpanElement | null>(null);
  const railBarRef = React.useRef<HTMLDivElement | null>(null);
  const ashRef = React.useRef<HTMLDivElement | null>(null);
  const offerRef = React.useRef<HTMLDivElement | null>(null);
  const activeRef = React.useRef(-1);

  React.useEffect(() => {
    const el = section.current;
    if (!el) return;
    const root = el.closest(".pl3") as HTMLElement | null;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const place = (node: HTMLElement, z: number) => {
      node.style.setProperty("--z", `${z.toFixed(1)}px`);
      node.style.opacity = depthOpacity(z).toFixed(3);
    };

    const setCompass = (i: number) => {
      if (i === activeRef.current) return;
      activeRef.current = i;
      if (i < 0 || i >= FACE_COUNT) {
        stopRefs.current.forEach((node) => {
          if (!node) return;
          node.removeAttribute("data-on");
          node.removeAttribute("data-done");
        });
        return;
      }
      const face = FACES[i];
      if (hudNumRef.current) hudNumRef.current.textContent = pad(face.n);
      if (hudNameRef.current) hudNameRef.current.textContent = face.name;
      if (railBarRef.current) {
        railBarRef.current.setAttribute("aria-valuenow", String(face.n));
        railBarRef.current.setAttribute(
          "aria-valuetext",
          `${face.n} of ${FACE_COUNT}: ${face.name}`,
        );
      }
      stopRefs.current.forEach((node, s) => {
        if (!node) return;
        if (s === i) node.setAttribute("data-on", "");
        else node.removeAttribute("data-on");
        if (s < i) node.setAttribute("data-done", "");
        else node.removeAttribute("data-done");
      });
    };

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

      // ── Phase 1: the camera leaves, facets fly past ──────────────
      const dep = clamp01(p / PHASE.depart);
      const camera = smooth(dep) * DEPART_TRAVEL;

      facetRefs.current.forEach((node, i) => {
        if (!node) return;
        place(node, FACET_PLACES[i].z + camera);
      });

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

      // ── Phase 2: stations arrive out of the horizon ──────────────
      // Left unclamped on purpose: while the hero is still flying, the first
      // station's local time is already negative-and-rising, which is what
      // puts its point of light out on the road before you arrive.
      const sp = (p - PHASE.depart) / PHASE.stations;
      const per = 1 / FACE_COUNT;

      let sigLevel = 0;
      let sigGrow = 0;
      /** How far the current answer has been drawn - the light blooms with it. */
      let bloom = 0;
      /** 1 while the road is covering ground, 0 while there is something to read. */
      let moving = 0;
      /** 1 while a card owns the middle - the light yields to the near road. */
      let hold = 0;
      let active = -1;

      FACES.forEach((_face, i) => {
        const q = (sp - i * per) / per;

        // One segment per station, so the road has a countable length
        // rather than an unknowable one.
        const seg = railRefs.current[i];
        if (seg) seg.style.transform = `scaleX(${clamp01(q).toFixed(3)})`;

        if (q >= 0 && q < 1) active = i;

        if (q > 0 && q < 1) {
          const enter = smooth(
            clamp01((q - STATION.arrive * 0.4) / (STATION.arrive * 0.6)),
          );
          const leave =
            1 -
            smooth(
              clamp01((q - STATION.passFrom) / Math.max(0.04, 1 - STATION.passFrom)),
            );
          hold = Math.max(hold, enter * leave);
        }

        // The point of light, before there is anything to read.
        if (q > STATION.sigIn && q < STATION.sigOut) {
          const rise = smooth(clamp01((q - STATION.sigIn) / (STATION.sigPeak - STATION.sigIn)));
          const fall = 1 - clamp01((q - STATION.sigPeak) / (STATION.sigOut - STATION.sigPeak));
          if (rise * fall > sigLevel) {
            sigLevel = rise * fall;
            sigGrow = clamp01((q - STATION.sigIn) / (STATION.sigOut - STATION.sigIn));
          }
        }

        const node = plateRefs.current[i];
        if (!node) return;

        if (q <= 0 || q >= 1.02) {
          if (node.style.visibility !== "hidden") {
            node.style.visibility = "hidden";
            node.style.opacity = "0";
          }
          return;
        }
        node.style.visibility = "";

        const inT = smooth(clamp01(q / STATION.arrive));
        const passT = smooth(clamp01((q - STATION.passFrom) / (1 - STATION.passFrom)));
        // Out of the vanishing point at a steady rate, then past the camera.
        const z = passT > 0 ? lerp(0, 520, passT) : zForScale(lerp(STATION.bornScale, 1, inT));

        // The turn: the light crosses the card and the problem becomes
        // the answer. Quantised - a wipe repaints, and 1/100th of a card
        // is under the sweep glow anyway.
        const turn = step(
          smooth(clamp01((q - STATION.turnFrom) / (STATION.turnTo - STATION.turnFrom))),
          0.01,
        );

        node.style.setProperty("--z", `${z.toFixed(1)}px`);
        node.style.setProperty("--turn", turn.toFixed(2));
        // Falls away quicker than it arrived: what is behind you should not
        // compete with the next point of light coming up the road.
        const fade = (1 - passT) ** 2.4;
        node.style.opacity = (clamp01(q / (STATION.arrive * 0.5)) * fade).toFixed(3);

        bloom = Math.max(bloom, turn * (1 - passT));
        // The journey has a pulse: cover ground, then slow down to read.
        moving = Math.max(
          moving,
          clamp01(
            Math.max(1 - q / STATION.arrive, (q - STATION.passFrom) / (1 - STATION.passFrom)),
          ),
        );
      });

      if (signalRef.current) {
        signalRef.current.style.opacity = sigLevel.toFixed(3);
        signalRef.current.style.setProperty("--sig-s", lerp(0.3, 2.6, sigGrow).toFixed(3));
      }

      // ── Phase 3: the road opens out ──────────────────────────────
      // Starts as the last card begins to pass, so the close never
      // writes itself across a station that is still being read.
      const philStart =
        PHASE.depart + (PHASE.stations * (FACE_COUNT - 1 + STATION.passFrom)) / FACE_COUNT;
      const ph = clamp01((p - philStart) / Math.max(0.08, 1 - philStart));
      if (philRef.current) {
        const o = smooth(ph);
        philRef.current.style.opacity = o.toFixed(3);
        // Opacity alone leaves the faded-in button clickable on the way
        // in, and clickable-but-invisible while the stations still own
        // the stage. Visibility removes it from hit-testing.
        philRef.current.style.visibility = o > 0.08 ? "visible" : "hidden";
      }

      // Compass + rail: fade in as the first station arrives, fade out as
      // the road opens, so they never snap and never sit on the close.
      const compass =
        (pinned ? 1 : 0) * smooth(clamp01(sp / 0.045)) * (1 - smooth(clamp01(ph / 0.18)));
      if (hudRef.current) {
        hudRef.current.style.opacity = compass.toFixed(3);
        hudRef.current.toggleAttribute("aria-hidden", compass < 0.12);
      }
      if (railBarRef.current) railBarRef.current.style.opacity = compass.toFixed(3);

      // Sky line: after the hero has left and the orb is on the road,
      // before the first problem card arrives.
      let offer = 0;
      if (pinned) {
        const offerIn = smooth(clamp01((dep - 0.46) / 0.16));
        const offerOut = 1 - smooth(clamp01((sp + 0.02) / 0.08));
        offer = offerIn * offerOut;
      }
      if (offerRef.current) {
        offerRef.current.style.opacity = offer.toFixed(3);
        offerRef.current.toggleAttribute("aria-hidden", offer < 0.12);
      }

      if (active < 0 && sp > 0) active = FACE_COUNT - 1;
      if (sp <= 0) setCompass(-1);
      else setCompass(active);

      // Ash joins on the last station, as the answer is drawn, and stays
      // quietly beside the light when the road opens.
      const ashQ = (sp - (FACE_COUNT - 1) * per) / per;
      let ash = smooth(clamp01((ashQ - STATION.turnFrom) / (STATION.turnTo - STATION.turnFrom)));
      if (ph > 0) ash = lerp(ash, 0.7, smooth(ph));
      if (ashRef.current) ashRef.current.style.opacity = ash.toFixed(3);

      // Road pace: hard acceleration away from the hero, then a pulse -
      // covering ground between stations, easing down to a crawl whenever
      // there is something in front of you to read - and finally a stop as
      // the road opens out.
      let rush = smooth(dep);
      if (sp > 0) rush = lerp(1, lerp(0.12, 0.72, moving), smooth(clamp01(sp / 0.08)));
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
      root.style.setProperty(
        "--speech-o",
        (1 - smooth(clamp01((dep - 0.16) / 0.28))).toFixed(3),
      );

      // ── The light itself ─────────────────────────────────────────
      // The hero flies and the light rises into the vacated frame, settling
      // on a cruise that holds for the rest of the road. A problem/answer
      // card is the only disturbance - it pulls the light down onto the near
      // road so the middle stays readable. After it passes, the cruise returns.
      const near = smooth(clamp01(dep / 0.55));
      const gone = smooth(clamp01((dep - 0.42) / 0.58));
      let y = lerp(LIGHT.heroY, LIGHT.cruiseY, gone);
      let size = lerp(lerp(LIGHT.heroSize, 1.08, near), LIGHT.cruiseSize, gone);
      let glow = lerp(lerp(1.05, 1.35, near), 1.05, gone);
      let grid = lerp(1, 0.78, gone);
      let horizon = lerp(LIGHT.heroHorizon, LIGHT.cruiseHorizon, gone);

      if (sp > 0) {
        // Only the card pulls the light off cruise. The point of light on
        // the horizon is ahead of it, not a reason to hug the floor.
        y = lerp(y, LIGHT.readY, hold);
        size = lerp(size, LIGHT.readSize, hold);
        // Every answer is drawn by this light, so it swells as one lands.
        glow += bloom * 0.6;
        size += bloom * 0.12;
        grid += bloom * 0.16;
      }

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
      // Nothing flies, but the page keeps its identity: facets laid out plainly,
      // stations readable in order, the light still holding the middle.
      // Each facet keeps its own resting depth - flattening them all to z:0
      // is what collapsed the composition into a pile, which is why this
      // path had to fall back to a grid before.
      facetRefs.current.forEach((node, i) => {
        if (node) {
          node.style.opacity = "1";
          node.style.setProperty("--z", `${FACET_PLACES[i].z}px`);
        }
      });
      plateRefs.current.forEach((node) => {
        if (node) {
          node.style.opacity = "1";
          node.style.setProperty("--z", "0px");
        }
      });
      if (philRef.current) {
        philRef.current.style.opacity = "1";
        philRef.current.style.visibility = "visible";
      }
      if (ashRef.current) ashRef.current.style.opacity = "0";
      if (offerRef.current) offerRef.current.style.opacity = "0";

      // Park the light inside the composition rather than letting the page-wide
      // stops drag it up over the hero. Released once the road scrolls away so
      // the FAQ and footer still get their own placement.
      const hold = () => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const own = r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
        if (own) {
          root.setAttribute("data-road", "");
          root.style.setProperty("--orb-y", "62vh");
          root.style.setProperty("--orb-x", "50vw");
          root.style.setProperty("--orb-scale", "0.7");
          root.style.setProperty("--orb-i", "1");
          root.style.setProperty("--grid-o", "0.8");
          root.style.setProperty("--horizon", "70%");
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
      aria-label="Playlight - a forward journey of six problems"
    >
      <div className="pl3-road__stage">
        <div ref={sceneRef} className="pl3-road__scene">
          {/* Composed around the light: the whole of a life, at once */}
          {FACET_PLACES.map((place, i) => (
            <article
              key={place.id}
              ref={(n) => {
                facetRefs.current[i] = n;
              }}
              className="pl3-facet"
              data-lit
              data-phone={place.mobile ? "" : undefined}
              style={
                {
                  "--fx": `${place.x}%`,
                  "--fy": `${place.y}%`,
                  "--mfx": `${place.mobile?.x ?? place.x}%`,
                  "--mfy": `${place.mobile?.y ?? place.y}%`,
                  "--ry": `${place.ry}deg`,
                  "--rx": `${place.rx}deg`,
                  "--z": `${place.z}px`,
                } as React.CSSProperties
              }
            >
              <div className="pl3-facet__panel">
                <p className="pl3-facet__tag">{LABEL[place.id]}</p>
                <FacetScene id={place.id} active />
                <p className="pl3-facet__line">{LINE[place.id]}</p>
              </div>
            </article>
          ))}
        </div>

        {/* The next problem, still only a point of light on the road */}
        <div ref={signalRef} className="pl3-road__signal" aria-hidden="true">
          <span className="pl3-road__signal-core" />
          <span className="pl3-road__signal-ring" />
        </div>

        {/* Ash joins on the last station - a second light on the same road. */}
        <div ref={ashRef} className="pl3-road__ash" aria-hidden="true">
          <span className="pl3-road__ash-core" />
          <span className="pl3-road__ash-ring" />
        </div>

        {/* Spoken into the vacated sky, while the road is still empty. */}
        <div ref={offerRef} className="pl3-road__offer" aria-hidden="true">
          <p className="pl3-road__offer-line">
            Here's how I can help you throughout your life's journey
          </p>
        </div>

        {/* Stays put while the cards fly. You always know which stop this is. */}
        <div
          ref={hudRef}
          className="pl3-road__hud"
          aria-live="polite"
          aria-atomic="true"
          aria-hidden="true"
        >
          <p className="pl3-road__hud-line">
            <span ref={hudNumRef}>01</span>
            <span className="pl3-road__hud-of"> / {pad(FACE_COUNT)}</span>
            <span className="pl3-road__hud-dot" aria-hidden="true">
              ·
            </span>
            <span ref={hudNameRef} className="pl3-road__hud-name">
              Invisible life
            </span>
          </p>
        </div>

        {/* Stations along the road - their own layer so that with motion
            reduced they can reflow into a plain column instead of being
            trapped inside the facet composition. */}
        <div className="pl3-road__stations">
          {FACES.map((face, i) => (
            <article
              key={face.id}
              ref={(n) => {
                plateRefs.current[i] = n;
              }}
              className="pl3-plate"
            >
              <div className="pl3-plate__panel">
                <p className="pl3-plate__where">
                  <span className="pl3-plate__n">{pad(face.n)}</span>
                  <span className="pl3-plate__name">{face.name}</span>
                </p>
                {/* Both states occupy the same cell. The sweep wipes one
                    into the other, so the answer is visibly made out of
                    the problem rather than replacing it. */}
                <div className="pl3-plate__face" data-side="problem">
                  <div className="pl3-plate__motif" data-side="problem">
                    <Motif kind={face.motif} side="problem" />
                  </div>
                  <blockquote className="pl3-plate__quote">“{face.quote}”</blockquote>
                </div>

                <div className="pl3-plate__face" data-side="solution">
                  <div className="pl3-plate__motif" data-side="solution">
                    <Motif kind={face.motif} side="solution" />
                  </div>
                  <p className="pl3-plate__answer">{face.answer}</p>
                </div>

                <span className="pl3-plate__sweep" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>

        {/* Hero rides at the front of the camera and flies past first */}
        <div ref={heroRef} className="pl3-road__hero">
          <h1 className="pl3-road__mark">playlight</h1>
          <p className="pl3-road__line">
            Your personalized OS to help you understand, organize, and play life.
          </p>
          <TryToday />
          <span className="pl3-road__cue" aria-hidden="true" />
        </div>

        <div ref={philRef} className="pl3-road__phil">
          <p className="pl3-road__phil-line">Come into the light.</p>
          <p className="pl3-road__phil-sub">Not more noise. A calmer next step.</p>
          <TryToday />
        </div>

        <a className="pl3-skip" href="#faq">
          Skip ahead
        </a>

        <div
          ref={railBarRef}
          className="pl3-road__rail"
          role="progressbar"
          aria-label="Journey progress"
          aria-valuemin={1}
          aria-valuemax={FACE_COUNT}
          aria-valuenow={1}
        >
          {FACES.map((face, i) => (
            <span
              key={face.id}
              ref={(node) => {
                stopRefs.current[i] = node;
              }}
              className="pl3-road__stop"
            >
              <span className="pl3-road__stop-n">{face.n}</span>
              <span className="pl3-road__rail-seg">
                <span
                  ref={(node) => {
                    railRefs.current[i] = node;
                  }}
                  className="pl3-road__rail-fill"
                />
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

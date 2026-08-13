import * as React from "react";
import { ESSENCE, ORB_BOX } from "@/components/landing/orb/ramp";
import { FACET_BY_ID, type FacetId } from "./faces";
import { FacetGlyph } from "./glyphs";
import { CAMERA_Z, FACET_PLACES } from "./roadPlan";
import "./life-map.css";

/**
 * The life map: eight facets ringed around the light, wired into it.
 *
 * Everything here argues one thing - these are not eight apps sitting near
 * each other, they are one system, and the light in the middle is what they
 * add up to. So the filaments run INWARD: the orb is the sum of what it is
 * given, never a lamp shining out onto your life.
 *
 * Each facet carries a word and a glyph and nothing else. Touch one and the
 * light answers with a single line drawn from that facet - twelve streams in,
 * one sentence out. That is the product, demonstrated rather than described.
 *
 * Geometry: the ring is laid out in CSS from unit offsets (--ux/--uy) against
 * two radii, so it stays an ellipse at every width. Depth (--z) tilts it into
 * the road's perspective; --k undoes the projection so the tilt reads as depth
 * without bending the ellipse. The filaments are measured from the rendered
 * ports rather than recomputed, so they always land where the glyphs actually
 * are.
 */

export type LifeMapHandle = {
  /**
   * Driven by the road's single scroll handler.
   * `camera` is depth travelled in px, `depart` the 0-1 of that first phase.
   */
  travel: (camera: number, depart: number) => void;
};

type Wire = { id: FacetId; d: string; beads: Array<[number, number]> };

type Web = {
  w: number;
  h: number;
  /** The light, in the map's own coordinates. */
  cx: number;
  cy: number;
  /** Radius of the sphere the filaments dissolve into. */
  r: number;
  wires: Wire[];
};

/** How far a filament turns as it falls in, in radians. */
const TWIST = (13 * Math.PI) / 180;
/** Gap between a port's edge and where its filament starts. */
const PORT_GAP = 6;

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const f2 = (n: number) => n.toFixed(2);

/** Fade a facet as it reaches, then passes, the camera. */
function depthOpacity(z: number) {
  if (z > CAMERA_Z) return 0;
  if (z > CAMERA_Z - 260) return 1 - (z - (CAMERA_Z - 260)) / 260;
  return 1;
}

/**
 * One filament, as a spiral from a port into the light.
 *
 * Straight spokes would make a sunburst, and a sunburst points outward. The
 * radius falls while the bearing turns, so the line arrives at the orb off the
 * radial - light bending as it is drawn in. Hermite tangents keep the cubic on
 * the true spiral instead of near it.
 */
function spiral(cx: number, cy: number, r1: number, a1: number, r0: number, a0: number): Wire["d"] {
  const at = (r: number, a: number): [number, number] => [
    cx + r * Math.cos(a),
    cy + r * Math.sin(a),
  ];
  const dr = r0 - r1;
  const da = a0 - a1;
  const tangent = (r: number, a: number): [number, number] => [
    dr * Math.cos(a) - r * da * Math.sin(a),
    dr * Math.sin(a) + r * da * Math.cos(a),
  ];

  const [x0, y0] = at(r1, a1);
  const [x3, y3] = at(r0, a0);
  const [tx0, ty0] = tangent(r1, a1);
  const [tx3, ty3] = tangent(r0, a0);

  return (
    `M${f2(x0)} ${f2(y0)}C${f2(x0 + tx0 / 3)} ${f2(y0 + ty0 / 3)} ` +
    `${f2(x3 - tx3 / 3)} ${f2(y3 - ty3 / 3)} ${f2(x3)} ${f2(y3)}`
  );
}

export const LifeMap = React.forwardRef<LifeMapHandle>(function LifeMap(_props, ref) {
  const root = React.useRef<HTMLDivElement | null>(null);
  const web = React.useRef<SVGSVGElement | null>(null);
  const nodes = React.useRef<Array<HTMLButtonElement | null>>([]);
  const ports = React.useRef<Array<HTMLSpanElement | null>>([]);

  const [drawn, setDrawn] = React.useState<Web | null>(null);
  const [active, setActive] = React.useState<FacetId | null>(null);
  const activeRef = React.useRef<FacetId | null>(null);
  const leaving = React.useRef(0);
  /** A resize while the road is in flight can only be measured back at rest. */
  const stale = React.useRef(false);
  const resting = React.useRef(true);

  const say = React.useCallback((id: FacetId | null) => {
    activeRef.current = id;
    setActive(id);
    const page = root.current?.closest(".pl3") as HTMLElement | null;
    if (!page) return;
    // The orb speaks it, in the same voice it uses for its own lines. One
    // writer: nothing else on the page touches data-say.
    if (id) page.setAttribute("data-say", FACET_BY_ID[id].says);
    else page.removeAttribute("data-say");
  }, []);

  const hold = React.useCallback(
    (id: FacetId) => {
      window.clearTimeout(leaving.current);
      say(id);
    },
    [say],
  );

  // Crossing the gap between two facets should not drop the page back to the
  // light's idle lines and straight out again.
  const release = React.useCallback(() => {
    window.clearTimeout(leaving.current);
    leaving.current = window.setTimeout(() => say(null), 420);
  }, [say]);

  const measure = React.useCallback(() => {
    const box = root.current?.getBoundingClientRect();
    const orb = document.querySelector(".pl3-orb")?.getBoundingClientRect();
    if (!box || !orb || box.width < 2 || orb.width < 2) return;

    const cx = orb.left + orb.width / 2 - box.left;
    const cy = orb.top + orb.height / 2 - box.top;
    // The glow reaches much further, but this is the body of light a filament
    // has to disappear into.
    const r = (orb.width * (ESSENCE / ORB_BOX)) / 2;

    const wires: Wire[] = [];
    FACET_PLACES.forEach((place, i) => {
      const port = ports.current[i]?.getBoundingClientRect();
      if (!port || port.width < 2) return;
      const px = port.left + port.width / 2 - box.left;
      const py = port.top + port.height / 2 - box.top;

      const a1 = Math.atan2(py - cy, px - cx);
      const r1 = Math.hypot(px - cx, py - cy) - (port.width / 2 + PORT_GAP);
      const r0 = r * 0.46;
      const a0 = a1 - TWIST;
      if (r1 <= r0) return;

      const beads: Array<[number, number]> = [0.34, 0.68].map((t) => {
        const rb = lerp(r1, r0, t);
        const ab = lerp(a1, a0, t);
        return [cx + rb * Math.cos(ab), cy + rb * Math.sin(ab)];
      });

      wires.push({ id: place.id, d: spiral(cx, cy, r1, a1, r0, a0), beads });
    });

    setDrawn({ w: box.width, h: box.height, cx, cy, r, wires });
  }, []);

  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    // Twice: once now, so a tab that is never painted still wires itself up
    // (a backgrounded page gets no frames at all), and once a frame later,
    // because the ports are laid out from clamp()s and a web font and the
    // first pass can measure either mid-settle.
    measure();
    let raf = requestAnimationFrame(measure);
    const again = () => {
      if (!resting.current) {
        stale.current = true;
        return;
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    // Belt to the frame's braces. The synchronous pass above can land before
    // the stylesheet does (dev serves CSS through JS), and the frame that
    // would fix that never comes in a tab nobody is looking at. A timer fires
    // either way, so the map is never left unwired.
    const settle = window.setTimeout(measure, 120);

    const ro = new ResizeObserver(again);
    ro.observe(el);
    window.addEventListener("resize", again);
    document.fonts?.ready.then(again).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      ro.disconnect();
      window.removeEventListener("resize", again);
    };
  }, [measure]);

  React.useImperativeHandle(
    ref,
    () => ({
      travel(camera, depart) {
        nodes.current.forEach((node, i) => {
          if (!node) return;
          const z = FACET_PLACES[i].z + camera;
          node.style.setProperty("--z", `${z.toFixed(1)}px`);
          // --fade, not opacity: the stylesheet dims the facets you are not
          // pointing at through --dim, and an inline opacity would win.
          node.style.setProperty("--fade", depthOpacity(z).toFixed(3));
        });

        // The filaments describe the system at rest. Once the camera moves
        // they would be drawing yesterday's positions, so they go early -
        // the light keeps what they were carrying.
        const o = 1 - smooth(clamp01(depart / 0.09));
        web.current?.style.setProperty("--web-o", o.toFixed(3));

        const rest = depart < 0.012;
        if (rest !== resting.current) {
          resting.current = rest;
          root.current?.toggleAttribute("data-live", rest);
          if (!rest && activeRef.current) {
            window.clearTimeout(leaving.current);
            say(null);
          }
          if (rest && stale.current) {
            stale.current = false;
            requestAnimationFrame(measure);
          }
        }
      },
    }),
    [measure, say],
  );

  React.useEffect(() => () => window.clearTimeout(leaving.current), []);

  const current = active ? FACET_BY_ID[active] : null;

  return (
    <div ref={root} className="pl3-road__scene pl3-map" data-live data-on={active ?? undefined}>
      <svg
        ref={web}
        className="pl3-map__web"
        viewBox={drawn ? `0 0 ${f2(drawn.w)} ${f2(drawn.h)}` : undefined}
        data-ready={drawn ? "" : undefined}
        fill="none"
        aria-hidden="true"
      >
        {drawn ? (
          <>
            <defs>
              {/* Filaments do not stop at the orb, they stop being visible in
                  it. Two ramps rather than one so a lit branch can brighten
                  without the dissolve moving. */}
              <radialGradient
                id="pl3-map-fall"
                gradientUnits="userSpaceOnUse"
                cx={drawn.cx}
                cy={drawn.cy}
                r={drawn.r}
              >
                <stop offset="0" stopColor="#ffae47" stopOpacity="0" />
                <stop offset="0.58" stopColor="#ffae47" stopOpacity="0" />
                <stop offset="1" stopColor="#ffae47" stopOpacity="0.52" />
              </radialGradient>
              <radialGradient
                id="pl3-map-fall-lit"
                gradientUnits="userSpaceOnUse"
                cx={drawn.cx}
                cy={drawn.cy}
                r={drawn.r}
              >
                <stop offset="0" stopColor="#fff4e2" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff4e2" stopOpacity="0" />
                <stop offset="1" stopColor="#ffc95c" stopOpacity="1" />
              </radialGradient>
            </defs>

            {drawn.wires.map((wire, i) => (
              <g
                key={wire.id}
                className="pl3-map__branch"
                data-lit={active === wire.id ? "" : undefined}
                style={{ "--i": i } as React.CSSProperties}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") hold(wire.id);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== "touch") release();
                }}
                onClick={() => hold(wire.id)}
              >
                {/* A hairline is not a target. The whole run of light from the
                    facet to the orb answers to the pointer, not just the glyph
                    at the end of it. */}
                <path className="pl3-map__hit" d={wire.d} />
                <path className="pl3-map__line" d={wire.d} pathLength={1} />
                <path className="pl3-map__flow" d={wire.d} pathLength={1} />
                {wire.beads.map(([x, y], b) => (
                  <circle key={b} className="pl3-map__bead" cx={x} cy={y} r={1.35} />
                ))}
              </g>
            ))}
          </>
        ) : null}
      </svg>

      {FACET_PLACES.map((place, i) => (
        <button
          key={place.id}
          type="button"
          ref={(node) => {
            nodes.current[i] = node;
          }}
          className="pl3-map__node"
          // The word is right there in the button, but naming it explicitly
          // survives the label ever becoming decorative.
          aria-label={FACET_BY_ID[place.id].label}
          data-side={place.ux >= 0 ? "right" : "left"}
          data-lit={active === place.id ? "" : undefined}
          style={
            {
              "--ux": place.ux,
              "--uy": place.uy,
              "--k": place.k,
              "--z": `${place.z}px`,
              "--i": i,
            } as React.CSSProperties
          }
          onPointerEnter={(e) => {
            if (e.pointerType !== "touch") hold(place.id);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "touch") release();
          }}
          onClick={() => hold(place.id)}
          onFocus={() => hold(place.id)}
          onBlur={release}
        >
          <span
            className="pl3-map__port"
            ref={(node) => {
              ports.current[i] = node;
            }}
          >
            <FacetGlyph id={place.id} />
          </span>
          <span className="pl3-map__label">{FACET_BY_ID[place.id].label}</span>
        </button>
      ))}

      {/* The readout is the demo, so it cannot be left to be stumbled on. */}
      <p className="pl3-map__hint" aria-hidden="true">
        <span data-pointer>Hover a facet</span>
        <span data-touch>Tap a facet</span>
      </p>

      {/* The light's answer is drawn above the orb and hidden from readers.
          This is the same sentence, for anyone listening instead. */}
      <p className="pl3-map__sr" role="status">
        {current ? `${current.label}. ${current.says}` : ""}
      </p>
    </div>
  );
});

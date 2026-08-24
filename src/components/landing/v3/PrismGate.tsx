import * as React from "react";

import { AppOrb } from "@/components/landing/orb/AppOrb";
import { VIBES, hueAtAngle, nearestVibe, type Vibe } from "@/components/landing/orb/ramp";

/** The orb's full visual extent is CORONA (400), so scale by width/400. */
const FIELD = 400;

/** Milestones of the arrival, in ms from mount. */
const T_BLOOM = 1150;
const T_WORDS = 2050;

type Props = {
  /** Called once, with the light the visitor took. */
  onChoose: (vibe: Vibe) => void;
};

/**
 * The gate: one orb holding every colour, and nothing else.
 *
 * You pick by pointing - the angle from the orb's centre selects the hue,
 * so you take the colour you are touching rather than a swatch that
 * stands for it. A torch of that hue follows the cursor out of the rim.
 *
 * The orb is held STILL here. The production orb breathes, but the torch
 * does not, so a breathing rim slides in and out against a fixed beam and
 * the junction between them opens and closes.
 */
export function PrismGate({ onChoose }: Props) {
  const root = React.useRef<HTMLDivElement | null>(null);
  const hit = React.useRef<HTMLDivElement | null>(null);

  const [active, setActive] = React.useState<number | null>(null);
  const [taken, setTaken] = React.useState(false);

  /**
   * The arrival is a pure CSS timeline - see prism-gate.css. Driving it
   * from a chain of setTimeouts meant an effect cleanup during hydration
   * could clear them and strand the intro half-played, with no error to
   * show for it. CSS animations start at first paint and nothing in the
   * React lifecycle can cancel them.
   *
   * All that is left for JS is refusing input until the sequence has
   * landed, and elapsed time answers that without a timer of its own.
   */
  const born = React.useRef(0);
  if (born.current === 0) born.current = Date.now();
  const settled = () =>
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      Date.now() - born.current >= T_WORDS);

  const ready = () => settled() && !taken;

  /* ── scale: the orb and the torch must share one, or the torch's inner
        edge stops sitting on the rim ── */
  React.useEffect(() => {
    const node = hit.current;
    if (!node) return;
    const fit = () => {
      const w = node.getBoundingClientRect().width || FIELD;
      node.style.setProperty("--s", String(w / FIELD));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(node);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  /** Angle and distance of a pointer from the orb's centre. */
  const at = React.useCallback((e: React.PointerEvent) => {
    const r = hit.current!.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    let deg = (Math.atan2(-dy, dx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return { deg, dist: Math.hypot(dx, dy), radius: r.width / 2 };
  }, []);

  /* Kept unwrapped: crossing 359 -> 1 would otherwise swing the beam the
     long way round instead of nudging it across the seam. */
  const turn = React.useRef(0);
  const turned = React.useRef(false);

  const aim = React.useCallback((deg: number) => {
    let target = 90 - deg;
    if (turned.current) {
      while (target - turn.current > 180) target -= 360;
      while (target - turn.current < -180) target += 360;
    }
    turn.current = target;
    turned.current = true;
    root.current?.style.setProperty("--torch-deg", `${target.toFixed(1)}deg`);
  }, []);

  const point = React.useCallback(
    (deg: number) => {
      aim(deg);
      root.current?.style.setProperty("--pick", hueAtAngle(deg));
      setActive(nearestVibe(deg));
    },
    [aim],
  );

  const onMove = (e: React.PointerEvent) => {
    if (!ready()) return;
    const p = at(e);
    // the very centre has no meaningful angle
    if (p.dist < p.radius * 0.14) {
      setActive(null);
      return;
    }
    point(p.deg);
  };

  const onDown = (e: React.PointerEvent) => {
    if (!ready()) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const p = at(e);
    if (p.dist < p.radius * 0.14) return;
    point(p.deg);
    take(VIBES[nearestVibe(p.deg)]);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!ready()) return;
    const last = VIBES.length - 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const i = active === null ? 0 : (active + 1) % VIBES.length;
      point(VIBES[i].angle);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      const i = active === null ? last : (active - 1 + VIBES.length) % VIBES.length;
      point(VIBES[i].angle);
    } else if ((e.key === "Enter" || e.key === " ") && active !== null) {
      e.preventDefault();
      take(VIBES[active]);
    }
  };

  /**
   * Fly the gate's orb onto the site's own orb, then hand over.
   *
   * The target is measured from the live `.pl3-orb` element rather than
   * recomputed from --orb-x/--orb-y/--orb-scale: it is already on screen
   * underneath the gate, and its rect includes the scroll listener's
   * current values, so the two can never disagree.
   *
   * Both orbs draw a 200-unit stage. The site renders it at its own box
   * width; the gate renders CORONA (400 units) across the hit box, so its
   * 200-unit stage is half that - hence the /2.
   */
  function flyToSiteOrb() {
    const from = hit.current?.getBoundingClientRect();
    const to = document.querySelector(".pl3-orb")?.getBoundingClientRect();
    if (!from || !to || !root.current) return;
    root.current.style.setProperty(
      "--fly-x",
      `${(to.left + to.width / 2 - (from.left + from.width / 2)).toFixed(1)}px`,
    );
    root.current.style.setProperty(
      "--fly-y",
      `${(to.top + to.height / 2 - (from.top + from.height / 2)).toFixed(1)}px`,
    );
    root.current.style.setProperty("--fly-s", (to.width / (from.width / 2)).toFixed(4));
  }

  function take(vibe: Vibe) {
    if (taken) return;
    root.current?.style.setProperty("--pick", vibe.ramp.base);
    // measure before the fade begins, while everything is still in place
    flyToSiteOrb();
    setTaken(true);
    onChoose(vibe);
  }

  const current = active === null ? null : VIBES[active];

  return (
    <div
      ref={root}
      className="pl-gate"
      data-picking={current && !taken ? "1" : "0"}
      data-taken={taken ? "1" : "0"}
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
      onPointerDown={onDown}
    >
      <p className="pl-gate__lead">Choose your vibe</p>

      <div
        ref={hit}
        className="pl-gate__hit"
        tabIndex={0}
        role="slider"
        aria-label="Choose your vibe - arrow keys move through the colors, Enter chooses"
        aria-valuemin={1}
        aria-valuemax={VIBES.length}
        aria-valuenow={(active ?? 0) + 1}
        aria-valuetext={current ? current.name : "none selected"}
        onKeyDown={onKey}
      >
        {/* Above the orb: underneath, the orb's own faint outer layers
            composite over the beam and dull it right at the rim. The
            mask's inner hole is what keeps the white core clean. */}
        <div className="pl-gate__torch" aria-hidden />
        <AppOrb
          size={FIELD}
          accent
          sparks={0}
          reducedMotion
          mode={taken ? "solid" : "prism"}
          ramp={current?.ramp}
          className="pl-gate__orb"
        />
      </div>

      <div className="pl-gate__label">
        <span className="pl-gate__name">{current ? current.name : " "}</span>
      </div>

      <p className="pl-gate__hint">(tap anywhere to choose)</p>
    </div>
  );
}

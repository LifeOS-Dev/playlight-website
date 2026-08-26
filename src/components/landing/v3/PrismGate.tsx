import * as React from "react";

import { AppOrb } from "@/components/landing/orb/AppOrb";
import {
  PRISM_LINEAR,
  VIBES,
  angleForT,
  hueAtAngle,
  hueTripleAtAngle,
  nearestVibe,
  spinFor,
  tForAngle,
  tripleOf,
  type Vibe,
  type VibeId,
} from "@/components/landing/orb/ramp";
import {
  DEFAULT_GATE_MODE,
  GATE_MODES,
  GATE_MODE_HINT,
  GATE_MODE_LABEL,
  type GateMode,
} from "@/components/landing/v3/gateMode";

/** The orb's full visual extent is CORONA (400), so scale by width/400. */
const FIELD = 400;

/** Milestones of the arrival, in ms from mount. */
const T_WORDS = 2050;

/**
 * How long the handover takes, tap to finished - the `handover` section of
 * prism-gate.css owns the beats and this is where they end. The page holds
 * the gate mounted for exactly this long, so the two move together.
 */
const T_EXIT = 1520;

/** The same, for a visitor who asked for no motion: there is nothing to wait for. */
export const gateExitMs = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 80
    : T_EXIT;

/** A replay closes without a handover, so it only owes the fade below. */
const T_CLOSE = 280;
export const gateCloseMs = () => T_CLOSE;

/** The orb's dead centre, as a fraction of its radius - no angle lives there. */
const DEAD = 0.14;

/**
 * Wheel: degrees of spectrum per pixel of finger. One colour is 72deg, so
 * this is a colour every ~72px and a whole turn inside a phone's width.
 */
const SPIN_PER_PX = 1;

/** Under this much travel, a gesture was a tap and not a drag. */
const TAP_SLOP = 9;

/**
 * Show the mechanic once, unprompted, rather than describing it.
 *
 * The dial and the wheel are both invisible until a hand arrives, and a
 * black screen with one orb on it does not say "this turns". After the
 * words land the light demonstrates itself and then lets go. The track
 * needs none of this - it is a control, and it looks like one.
 *
 * Set false to meet each mechanic cold.
 */
const ATTRACT = true;

/** A gesture belongs to whichever control it started on. */
type Drag = {
  id: number;
  kind: GateMode;
  x: number;
  y: number;
  /** Furthest travelled, so a tap can be told from a swipe on release. */
  moved: number;
  /** Wheel only: the spin the gesture started from. */
  spin: number;
};

type Props = {
  /** Called once, with the light the visitor took. */
  onChoose: (vibe: Vibe) => void;
  /**
   * Reopened from the header rather than met on arrival.
   *
   * The arrival is a two-second ceremony and it earns that once. Coming
   * back to change your mind it would be a toll, so a replay opens ready:
   * no timeline, pointing at the light already worn, and leavable without
   * choosing.
   */
  replay?: boolean;
  /** The light in use, so a replay opens on it. */
  current?: VibeId;
  /** Replay only - leave with the light unchanged. */
  onDismiss?: () => void;
  /** Replay only - the page has accepted the dismissal; fade out. */
  closing?: boolean;
  /** Which mechanic is being tried. See gateMode.ts. */
  mode?: GateMode;
  /** Set only while trying them; renders the switcher along the bottom. */
  onMode?: (mode: GateMode) => void;
};

/**
 * The gate: one orb holding every colour, and nothing else.
 *
 * You pick by pointing - the angle from the orb's centre selects the hue,
 * so you take the colour you are touching rather than a swatch that
 * stands for it. A torch of that hue follows the cursor out of the rim.
 *
 * That is the cursor's version. A finger has no hover to preview with, so
 * it borrows the one interval a mouse never uses: between pressing and
 * letting go. Press previews, lift takes. `mode` chooses between that and
 * the two other answers - see gateMode.ts.
 *
 * The orb is held STILL here. The production orb breathes, but the torch
 * does not, so a breathing rim slides in and out against a fixed beam and
 * the junction between them opens and closes.
 */
export function PrismGate({
  onChoose,
  replay = false,
  current,
  onDismiss,
  closing,
  mode = DEFAULT_GATE_MODE,
  onMode,
}: Props) {
  const root = React.useRef<HTMLDivElement | null>(null);
  const hit = React.useRef<HTMLDivElement | null>(null);
  const track = React.useRef<HTMLDivElement | null>(null);

  const [active, setActive] = React.useState<number | null>(null);

  /**
   * The light that was taken, kept whole rather than as a flag.
   *
   * It used to be a boolean, and the departing orb read its colour back
   * off `active` - which is cleared the moment the pointer leaves. On
   * touch the browser fires pointerleave the instant the finger lifts, so
   * by the time the orb began to move `active` was already null, AppOrb
   * fell back to its default ramp, and every choice flew home amber.
   */
  const [taken, setTaken] = React.useState<Vibe | null>(null);

  /**
   * Whether a hand has touched the bar yet.
   *
   * Until it has, the orb holds every colour at once - that is what the
   * arrival is for, and resolving it before anyone has asked would throw
   * the promise away to answer a question nobody put. The first touch is
   * what turns the spectrum into a choice.
   */
  const [engaged, setEngaged] = React.useState(false);

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
    replay ||
    (typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        Date.now() - born.current >= T_WORDS));

  const ready = () => settled() && !taken;

  /**
   * The same fact as `settled()`, but as state, because the torch has to
   * be told to stay dark and CSS cannot ask a function. The wheel and the
   * track open already pointing at something - a mark and a thumb stand
   * somewhere from the first frame - so without this the beam would be
   * lit underneath the whole arrival.
   */
  const [live, setLive] = React.useState(false);
  React.useEffect(() => {
    if (settled()) {
      setLive(true);
      return;
    }
    const id = window.setTimeout(() => setLive(true), T_WORDS - (Date.now() - born.current));
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── scale: the orb and the torch must share one, or the torch's inner
        edge stops sitting on the rim ── */
  React.useEffect(() => {
    const node = hit.current;
    if (!node) return;
    const fit = () => {
      const w = node.getBoundingClientRect().width || FIELD;
      node.style.setProperty("--s", String(w / FIELD));
      /* The torch is drawn at half size and scaled back up, so it needs
         twice this. It gets its own property rather than a calc() in the
         transform: `scale(calc(var(--s) * 2))` silently resolved to the
         fallback in the production CSS pipeline and left the beam frozen
         at the wrong size, while a plain `scale(var(--x))` has always
         worked. Two numbers from one measurement cannot drift. */
      node.style.setProperty("--s2", String((w / FIELD) * 2));
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

  /**
   * Which colour is being shown, held in a ref beside the state.
   *
   * `take` is now called from pointerup, and pointerup can land in the
   * same frame as the pointermove that chose - before React has
   * re-rendered, and before `active` says anything new. The ref is what
   * the release reads; the state is what the page draws from.
   */
  const idx = React.useRef<number | null>(null);

  const paint = React.useCallback((deg: number) => {
    root.current?.style.setProperty("--pick", hueAtAngle(deg));
    // the same colour as a bare triple, for the beam's alpha steps
    root.current?.style.setProperty("--pick-rgb", hueTripleAtAngle(deg));
    const i = nearestVibe(deg);
    idx.current = i;
    setActive(i);
  }, []);

  const clear = React.useCallback(() => {
    idx.current = null;
    setActive(null);
  }, []);

  /**
   * Wear one of the five, rather than the hue standing at an angle.
   *
   * The dial samples the orb's own conic, so the light it shows is the
   * one under the cursor even between two named colours. The track does
   * not: what it is going to hand over is one of five, and the orb is
   * about to BE that colour rather than merely point at it. A resolved
   * orb showing a blend nobody can actually take would be a promise the
   * handover then breaks.
   */
  const wear = React.useCallback((i: number) => {
    const base = VIBES[i].ramp.base;
    root.current?.style.setProperty("--pick", base);
    root.current?.style.setProperty("--pick-rgb", tripleOf(base));
    idx.current = i;
    setActive(i);
  }, []);

  /** Point at an angle: aim the beam there, and take the colour from it. */
  const point = React.useCallback(
    (deg: number) => {
      aim(deg);
      paint(deg);
    },
    [aim, paint],
  );

  /* ── wheel ────────────────────────────────────────────────────
        The orb does not move; the spectrum inside it does, under a mark
        fixed at the top. `--prism-spin` is added to the conic's start
        angle (see PRISM_CONIC), and the colour standing at the mark is
        the one hueAtAngle puts at 90 + spin - which falls out of the two
        conventions meeting: the mark is at twelve o'clock, and the
        gradient has been turned under it by exactly that much. */
  const spin = React.useRef(0);
  const turnTo = React.useCallback(
    (s: number) => {
      spin.current = s;
      root.current?.style.setProperty("--prism-spin", `${s.toFixed(2)}deg`);
      paint(90 + s);
    },
    [paint],
  );

  /* ── track ────────────────────────────────────────────────────
        The same spectrum unrolled into a bar. The thumb is kept as a
        fraction rather than a percentage so the rail can inset itself by
        a padding and still have its two ends land exactly on the outer
        colours. */
  const slideTo = React.useCallback(
    (t: number) => {
      root.current?.style.setProperty("--thumb", t.toFixed(4));
      // the thumb slides continuously; the colour it names does not
      wear(nearestVibe(angleForT(t)));
    },
    [wear],
  );

  const trackT = (e: React.PointerEvent) => {
    const node = track.current!;
    const r = node.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(node).getPropertyValue("--pad")) || 0;
    return Math.min(1, Math.max(0, (e.clientX - r.left - pad) / (r.width - pad * 2)));
  };

  /** Move to a named light, whichever mechanic is up. Used by the keyboard. */
  const goTo = React.useCallback(
    (i: number) => {
      const v = VIBES[i];
      if (mode === "wheel") turnTo(spinFor(v.angle, spin.current));
      else if (mode === "track") slideTo(tForAngle(v.angle));
      else point(v.angle);
    },
    [mode, point, slideTo, turnTo],
  );

  /* ── one animation at a time ──────────────────────────────────
        The demo sweep and the wheel's settle both drive the same values
        a finger does, so starting either cancels whatever was running -
        which is also how a finger interrupts the demo. */
  const raf = React.useRef(0);
  const halt = React.useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
  }, []);
  React.useEffect(() => halt, [halt]);

  const over = React.useCallback(
    (ms: number, f: (t: number) => void) => {
      halt();
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / ms);
        f(t);
        raf.current = t < 1 ? requestAnimationFrame(step) : 0;
      };
      raf.current = requestAnimationFrame(step);
    },
    [halt],
  );

  /* ── where the gate opens ─────────────────────────────────────
        The dial opens blank on arrival: nothing is chosen until a hand
        says so, and an orb holding every colour at once is the honest
        picture of that. The wheel and the track cannot - a mark and a
        thumb stand somewhere from the first frame, and standing nowhere
        would read as a fault - so they open on the light already worn,
        or on the default.

        A replay also takes the keyboard with it, because a button opened
        this one and the focus has to land somewhere. */
  React.useLayoutEffect(() => {
    const seed = current ? VIBES.findIndex((v) => v.id === current) : -1;
    const start = VIBES[seed >= 0 ? seed : VIBES.length - 1].angle;

    if (mode === "wheel") {
      aim(90); // the beam leaves the mark; only the colour in it changes
      turnTo(spinFor(start, 0));
    } else if (mode === "track") {
      slideTo(tForAngle(start));
    } else if (replay && seed >= 0) {
      point(start);
    } else {
      clear();
    }

    if (replay) (mode === "track" ? track.current : hit.current)?.focus({ preventScroll: true });
  }, [mode, current, replay, aim, turnTo, slideTo, point, clear]);

  /* ── the demo ─────────────────────────────────────────────────
        A timer, in a file that otherwise refuses them. The arrival's own
        timeline is CSS because losing it to a hydration cleanup would
        strand the gate half-drawn; losing this one costs a flourish and
        nothing else, so a timeout is allowed to own it. */
  const touched = React.useRef(false);
  React.useEffect(() => {
    if (!ATTRACT || mode === "track" || taken) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setTimeout(
      () => {
        if (touched.current || taken) return;
        if (mode === "wheel") {
          // out and back, so the gate is left facing where it started
          const from = spin.current;
          over(1700, (t) => turnTo(from - 216 * Math.sin(Math.PI * t)));
        } else {
          // one sweep of the beam through every colour, and then let go
          const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
          over(1400, (t) => {
            point(110 - 288 * ease(t));
            if (t === 1) clear();
          });
        }
      },
      replay ? 240 : T_WORDS + 260,
    );
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  /* Escape leaves the light as it was. Replay only - the first gate has
     nothing to go back to. */
  React.useEffect(() => {
    if (!replay || !onDismiss) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [replay, onDismiss]);

  /* ── the gesture ──────────────────────────────────────────────
        Capture is taken on the root, not on the control, so a finger
        that wanders off the orb - or off the screen - keeps steering,
        and the release is still heard wherever it happens. An angle from
        a centre is meaningful anywhere, so once you have pressed, the
        whole gate is the dial. */
  const drag = React.useRef<Drag | null>(null);

  const grab = (e: React.PointerEvent, kind: GateMode) => {
    touched.current = true;
    halt();
    root.current?.setPointerCapture(e.pointerId);
    drag.current = {
      id: e.pointerId,
      kind,
      x: e.clientX,
      y: e.clientY,
      moved: 0,
      spin: spin.current,
    };
  };

  const release = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (d && root.current?.hasPointerCapture(d.id)) root.current.releasePointerCapture(d.id);
    return d;
  };

  const onDown = (e: React.PointerEvent) => {
    if (!ready()) return;
    if ((e.target as HTMLElement).closest("button")) return;
    if (mode === "track") return; // the track owns its own gesture
    if (mode === "wheel") {
      grab(e, "wheel");
      return;
    }
    const p = at(e);
    if (p.dist < p.radius * DEAD) return;
    grab(e, "dial");
    point(p.deg);
  };

  const onTrackDown = (e: React.PointerEvent) => {
    if (!ready()) return;
    setEngaged(true);
    grab(e, "track");
    slideTo(trackT(e));
  };

  const onMove = (e: React.PointerEvent) => {
    if (!ready()) return;
    const d = drag.current;

    if (d) {
      d.moved = Math.max(d.moved, Math.hypot(e.clientX - d.x, e.clientY - d.y));
      if (d.kind === "wheel") turnTo(d.spin + (e.clientX - d.x) * SPIN_PER_PX);
      else if (d.kind === "track") slideTo(trackT(e));
      else {
        // holding the last angle beats blanking: dragging through the
        // dead centre mid-turn should not put the light out
        const p = at(e);
        if (p.dist >= p.radius * DEAD) point(p.deg);
      }
      return;
    }

    // Nothing pressed. This is the cursor previewing, which a finger
    // never gets to do - and only the dial has anything to preview.
    if (mode !== "dial") return;
    const p = at(e);
    if (p.dist < p.radius * DEAD) {
      clear();
      return;
    }
    point(p.deg);
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    d.moved = Math.max(d.moved, Math.hypot(e.clientX - d.x, e.clientY - d.y));
    release(e);
    if (!ready()) return;

    /* The wheel is the one mechanic where letting go is not deciding.
       Turning it is looking, and looking has to be repeatable - a single
       swipe that both moved and chose would make second thoughts
       impossible. So a turn only turns, and settles onto the nearest
       colour so the mark is never left standing between two; a tap takes
       whatever the mark is standing on. */
    if (d.kind === "wheel") {
      if (d.moved >= TAP_SLOP) {
        const from = spin.current;
        const to = spinFor(VIBES[nearestVibe(90 + from)].angle, from);
        if (Math.abs(to - from) > 0.05) {
          over(240, (t) => turnTo(from + (to - from) * (1 - (1 - t) ** 3)));
        }
        return;
      }
      // A tap takes what the mark is standing on - but only a tap on the
      // light itself. The whole gate turns the wheel, because a swipe
      // wants room; taking is the smaller, more deliberate target.
      const p = at(e);
      if (p.dist > p.radius) return;
    }

    commit();
  };

  /**
   * The browser took the gesture away - an edge swipe, a system back.
   * The drag is over, but the finger may well still be on the glass and
   * no further events are coming for it, so the preview is LEFT standing
   * rather than cleared: a colour held under a finger that is still
   * there reads as paused, and a blank orb reads as broken.
   */
  const onCancel = (e: React.PointerEvent) => {
    release(e);
  };

  function commit() {
    const i = idx.current;
    if (i === null) return;
    // land the thumb on the detent it is about to be remembered as
    if (mode === "track") {
      root.current?.style.setProperty("--thumb", tForAngle(VIBES[i].angle).toFixed(4));
    }
    take(VIBES[i]);
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (!ready()) return;
    const last = VIBES.length - 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      goTo(active === null ? 0 : (active + 1) % VIBES.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      goTo(active === null ? last : (active - 1 + VIBES.length) % VIBES.length);
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
   * current values, so the two can never disagree. It is held invisible
   * while the gate is up (see prism-gate.css), but still laid out - which
   * is what keeps it measurable.
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
    halt();
    root.current?.style.setProperty("--pick", vibe.ramp.base);
    root.current?.style.setProperty("--pick-rgb", tripleOf(vibe.ramp.base));
    // measure before the handover begins, while everything is still in place
    flyToSiteOrb();
    setTaken(vibe);
    onChoose(vibe);
  }

  /**
   * What the orb is wearing. Once a light has been taken it is that one and
   * stays that one: a late pointerleave must not be able to pull the colour
   * back out from under the orb on its way home.
   */
  const shown = taken ?? (active === null ? null : VIBES[active]);

  /** The one control the keyboard drives. It moves with the mechanic. */
  const slider = {
    tabIndex: 0,
    role: "slider" as const,
    "aria-label": "Choose your vibe - arrow keys move through the colors, Enter chooses",
    "aria-valuemin": 1,
    "aria-valuemax": VIBES.length,
    "aria-valuenow": (active ?? 0) + 1,
    "aria-valuetext": shown ? shown.name : "none selected",
    onKeyDown: onKey,
  };

  return (
    <div
      ref={root}
      className="pl-gate"
      data-mode={mode}
      data-trying={onMode ? "1" : "0"}
      data-picking={live && shown ? "1" : "0"}
      data-taken={taken ? "1" : "0"}
      data-replay={replay ? "1" : "0"}
      data-closing={closing ? "1" : "0"}
      onPointerMove={onMove}
      onPointerLeave={(e) => {
        /* Only a cursor can leave and still be there to come back, and
           only a cursor was ever previewing without pressing.

           A finger that "leaves" has lifted, and pointerup has already
           answered for that. Clearing here as well threw the preview
           away mid-drag: the browser cancels the pointer when a gesture
           strays near a screen edge, which drops `drag` and lets this
           fire while the finger is still down and still moving - the
           name and the beam going out under a hand that had not moved
           off anything. */
        if (e.pointerType !== "mouse") return;
        if (!taken && !drag.current && mode === "dial") clear();
      }}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onCancel}
    >
      {/* The promise. The only line on this screen that asks nothing of
          you - it is why the choosing is worth doing, said once, above
          the instruction that follows it. */}
      <p className="pl-gate__creed">
        Life is the most important game, and <span className="pl-gate__brand">Playlight</span> helps
        you win it.
      </p>

      <p className="pl-gate__lead">{replay ? "Choose another vibe" : "Choose your vibe"}</p>

      {/* A replay must not be a one-way door either - being able to take
          the choice back is the whole reason it exists. */}
      {replay && onDismiss ? (
        <button
          type="button"
          className="pl-gate__close"
          onClick={onDismiss}
          aria-label="Keep the vibe I have"
        >
          Keep this one
        </button>
      ) : null}

      <div ref={hit} className="pl-gate__hit" {...(mode === "track" ? {} : slider)}>
        {/* Above the orb: underneath, the orb's own faint outer layers
            composite over the beam and dull it right at the rim. The
            mask's inner hole is what keeps the white core clean.

            Not rendered at all for the track, which is the mechanic a
            phone gets. The beam is the single most expensive thing on
            this screen - a masked, blurred, rotating conic - and it is
            the half of the design a hand covers anyway. Where there is
            no cursor to carry it, it is not worth its cost, so the orb
            answers with a bloom instead (see prism-gate.css). */}
        {mode === "track" ? null : <div className="pl-gate__torch" aria-hidden />}
        <AppOrb
          size={FIELD}
          accent
          sparks={0}
          reducedMotion
          /* Resolved once a hand is on the bar: on a phone the orb IS
             the feedback, so it stops holding every colour and starts
             wearing the one being chosen. A cursor keeps the spectrum,
             because it has a beam to answer with instead. */
          mode={taken !== null || (mode === "track" && engaged) ? "solid" : "prism"}
          ramp={shown?.ramp}
          className="pl-gate__orb"
        />
        {/* The wheel's fixed mark: just off the rim at twelve o'clock,
            inside the beam that leaves from under it, and the only part
            of that mechanic which never moves. */}
        {mode === "wheel" ? <div className="pl-gate__mark" aria-hidden /> : null}
      </div>

      <div className="pl-gate__label">
        <span className="pl-gate__name">{shown ? shown.name : " "}</span>
      </div>

      {mode === "track" ? (
        <div ref={track} className="pl-gate__track" onPointerDown={onTrackDown} {...slider}>
          <div className="pl-gate__band" aria-hidden style={{ backgroundImage: PRISM_LINEAR }} />
          {VIBES.map((v) => (
            <span
              key={v.id}
              className="pl-gate__detent"
              aria-hidden
              style={{ left: `calc(var(--pad) + ${tForAngle(v.angle)} * (100% - 2 * var(--pad)))` }}
            />
          ))}
          <div className="pl-gate__thumb" aria-hidden />
        </div>
      ) : null}

      <p className="pl-gate__hint">{GATE_MODE_HINT[mode]}</p>

      {/* Only while the three are being tried against each other. */}
      {onMode ? (
        <div className="pl-gate__modes" role="group" aria-label="Try a different way to choose">
          {GATE_MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMode(m)}
              aria-pressed={m === mode}
              data-on={m === mode ? "1" : "0"}
            >
              {GATE_MODE_LABEL[m]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

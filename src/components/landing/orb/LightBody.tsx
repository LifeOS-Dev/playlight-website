import { useCallback, useEffect, useRef, useState } from "react";

import {
  BREATH_MS,
  FLOW_WRAP,
  GAZE_MAX,
  ORB_VITALITY_FLOOR,
  QUIRK_FIRST_MS,
  QUIRK_GAP_MS,
  SINE_IN_OUT,
  Track,
  between,
  gazeToward,
  glanceSpot,
  pickQuirk,
  postureFor,
  queueBlink,
  queueDoubleBlink,
  queueHop,
  queueLookAt,
  queueRipple,
  queueShiver,
  queueStir,
  queueStretch,
  type LightState,
} from "./lightCharacter";
import { lightCue, lookPoint } from "./lightCue";
import { hexToRgb } from "./lightProfile";
import { LIGHT_CANVAS, LIGHT_VERTEX_SRC, makeLightShader } from "./lightShader";
import { LightVectorBody } from "./LightVectorBody";
import { AMBER_RAMP, ORB_BOX, type AccentRamp } from "./ramp";

/**
 * Light's living body, on the web.
 *
 * The orb the app draws with Skia, drawn here with WebGL from the same
 * program (lightShader.ts) and the same character (lightCharacter.ts). It is
 * one object with two drawings of it:
 *
 *   1. The vector body renders first, on the server as well as the client,
 *      because it is plain gradients and needs neither GL nor a frame.
 *   2. The shader takes over once a context exists, cross-fading from it.
 *
 * They are the same picture (lightProfile.ts is the shader's own angular
 * mean), so that handover is the orb beginning to move rather than one orb
 * replacing another - and if step 2 never happens, nothing is missing except
 * the movement. No WebGL, a visitor who asked for less motion, an orb scrolled
 * off the screen: all of them simply stay at step 1.
 */

const DPR_CAP = 2;
/** The largest drawing buffer we will allocate, in device pixels. */
const BUFFER_CAP = 1600;
/** Grow the buffer only when the orb outgrows it by more than this. */
const GROW_SLACK = 1.15;

type GL = WebGLRenderingContext;

function compile(gl: GL, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // Left visible on purpose: a shader that fails to compile is a bug in the
    // port, not a capability the visitor lacks, and it should be noisy.
    console.warn("[LightBody] shader failed to compile:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function makeProgram(gl: GL): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, LIGHT_VERTEX_SRC);
  const fs = compile(gl, gl.FRAGMENT_SHADER, makeLightShader());
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[LightBody] program failed to link:", gl.getProgramInfoLog(prog));
    return null;
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return prog;
}

export type LightBodyProps = {
  /**
   * The layout box, in the orb's old 200-unit space, so this is a drop-in for
   * the stacked-gradient orb. The light overflows it by about 2.1x - see
   * LightVectorBody - so nothing above it may clip.
   */
  size?: number;
  /** False draws the body white: no colour has been picked yet. */
  accent?: boolean;
  /** 0..1, how alive the day is. Below the app's floor it is clamped up. */
  energy?: number;
  /** How many finished-task sparks orbit the body (0-6). */
  sparks?: number;
  ramp?: AccentRamp;
  /** Never start the shader: the vector body, held still. */
  reducedMotion?: boolean;
  /** Let the pointer pool light, send a ring, and pull the gaze. */
  interactive?: boolean;
  className?: string;
};

export function LightBody({
  size = ORB_BOX,
  accent = true,
  energy = 1,
  sparks = 0,
  ramp = AMBER_RAMP,
  reducedMotion = false,
  interactive = false,
  className = "",
}: LightBodyProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [live, setLive] = useState(false);

  /** Props the frame loop reads without wanting to restart for them. */
  const look = useRef({ accent, energy, sparks, ramp, interactive });
  look.current = { accent, energy, sparks, ramp, interactive };

  /** Honour the OS setting as well as the prop, and follow it if it changes. */
  const [systemStill, setSystemStill] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const still = reducedMotion || systemStill;

  /**
   * The canvas carries the WHOLE drawing, corona included, so it is the full
   * LIGHT_CANVAS in the orb's own units - about 2.1 times the layout box. It
   * overflows that box on every side and is centred on it by half this.
   */
  const canvasBox = (LIGHT_CANVAS * size) / ORB_BOX;

  const onPointer = useRef<((e: PointerEvent) => void) | null>(null);
  const onLeave = useRef<(() => void) | null>(null);
  const onDown = useRef<(() => void) | null>(null);
  const onUp = useRef<(() => void) | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    onPointer.current?.(e.nativeEvent);
  }, []);
  const handlePointerLeave = useCallback(() => onLeave.current?.(), []);
  const handlePointerDown = useCallback(() => onDown.current?.(), []);
  const handlePointerUp = useCallback(() => onUp.current?.(), []);

  useEffect(() => {
    if (still) return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const gl = (canvas.getContext("webgl", {
      alpha: true,
      // The shader writes premultiplied light, which is also what the
      // compositor wants: colour already multiplied by its own alpha.
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: true,
    }) || canvas.getContext("experimental-webgl")) as GL | null;
    if (!gl) return;

    const prog = makeProgram(gl);
    if (!prog) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(prog);

    const loc = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      res: loc("uRes"),
      flow: loc("uFlow"),
      gaze: loc("uGaze"),
      lid: loc("uLid"),
      energy: loc("uEnergy"),
      charge: loc("uCharge"),
      breath: loc("uBreath"),
      touch: loc("uTouch"),
      press: loc("uPress"),
      ripple: loc("uRipple"),
      heat: loc("uHeat"),
      cool: loc("uCool"),
      alert: loc("uAlert"),
      swirl: loc("uSwirl"),
      tense: loc("uTense"),
      rays: loc("uRays"),
      sparks: loc("uSparks"),
      scatter: loc("uScatter"),
      accent: loc("uAccent"),
      base: loc("uBase"),
      bright: loc("uBright"),
      hot: loc("uHot"),
      deep: loc("uDeep"),
    };

    // ---- character --------------------------------------------------------
    const state: LightState = "resting";
    const posture = postureFor(state);
    /**
     * The page's voice can ask the body to think (see lightCue.ts): the app's
     * own `thinking` posture, blended in and out rather than switched, so a
     * sentence being found reads as the currents quickening, not a cut.
     */
    const thinking = postureFor("thinking");
    let thinkNow = 0;

    const t0 = performance.now();
    const lid = new Track(posture.lid, t0);
    const gazeX = new Track(0, t0);
    const gazeY = new Track(0, t0);
    const squash = new Track(0, t0);
    const hop = new Track(0, t0);
    const shake = new Track(0, t0);
    const heat = new Track(0, t0);
    const scatter = new Track(0, t0);
    const ripple = new Track(1, t0);
    const press = new Track(0, t0);

    let flow = 0;
    let last = t0;
    let nextQuirk = t0 + between(QUIRK_FIRST_MS, Math.random());
    /** Pointer in body radii; only read while pressed or hovering. */
    let touch = { x: 0, y: 0 };
    let hovering = false;

    /**
     * How the page is travelling, read from the tokens the scroll already
     * writes: `--road-rush` is the road's pace, 0 standing still to 1 flat
     * out, and `--orb-i` is how much light the page is asking for.
     *
     * Read rather than passed, because the page has two drivers - the road
     * while its stage is pinned, the stop table afterwards - and they agreed
     * long ago to speak through these tokens. A second channel would be a
     * second thing to keep in step.
     *
     * Sampled at about 10Hz, not per frame: reading a custom property flushes
     * style, and the values are then eased toward, so what the orb does is
     * smooth even though what it reads is steppy.
     */
    /** Where the heart is actually looking, eased toward whatever leads it. */
    let gazeNow = { x: 0, y: 0 };
    let rush = 0;
    let rushTo = 0;
    let glow = 1;
    let glowTo = 1;
    const readDrive = () => {
      const cs = getComputedStyle(host);
      const r = parseFloat(cs.getPropertyValue("--road-rush"));
      const i = parseFloat(cs.getPropertyValue("--orb-i"));
      rushTo = Number.isFinite(r) ? Math.max(0, Math.min(1, r)) : 0;
      glowTo = Number.isFinite(i) ? i : 1;
    };
    readDrive();
    rush = rushTo;
    glow = glowTo;

    const runQuirk = (now: number) => {
      switch (pickQuirk(Math.random(), state)) {
        case "blink":
          queueBlink(lid, now);
          break;
        case "slowBlink":
          queueBlink(lid, now, true);
          break;
        case "doubleBlink":
          queueDoubleBlink(lid, now);
          break;
        case "glance": {
          // While a cursor is leading the heart, a glance would be the orb
          // looking away from the person watching it - so it blinks instead.
          if (cursorOn || leading) {
            queueBlink(lid, now);
            break;
          }
          const spot = glanceSpot(Math.random());
          queueLookAt(gazeX, gazeY, now, spot.x, spot.y, 1100);
          break;
        }
        case "stretch":
          queueStretch(squash, heat, now);
          break;
        case "shiver":
          queueShiver(shake, now);
          break;
        case "hop":
          queueHop(hop, squash, now, 9);
          break;
        case "stir":
          queueStir(scatter, now);
          break;
        default:
          break;
      }
    };

    // ---- the cursor --------------------------------------------------------
    /**
     * The heart looks at the cursor, wherever it is on the page.
     *
     * Not a hover: the orb is a fixed, `pointer-events: none` decoration, so
     * it never receives a pointer event at all and never could without taking
     * clicks away from the page under it. This listens on the window instead,
     * which is also what the gesture wants to be - the light noticing you
     * across the room, not a control lighting up when you touch it.
     *
     * `gazeToward` saturates, so a cursor at the far corner and a cursor just
     * off the orb pull it nearly the same distance. That is the whole trick:
     * the heart leans the RIGHT WAY long before it leans far, and it can
     * never be dragged out of its own body.
     *
     * Mouse and pen only. A finger is not a cursor - it is only ever on the
     * glass for a moment, and having the heart lunge at each tap and then
     * forget would read as a twitch rather than attention.
     */
    let cursorOn = false;
    let cursorX = 0;
    let cursorY = 0;
    /**
     * What the voice has asked it to look at, in viewport px - resolved with
     * the other sampled reads, since an element target moves as the page does.
     * It outranks the cursor: while Light is talking about something, it
     * looks at that, and the eye follows it there.
     */
    let leading = false;
    let leadX = 0;
    let leadY = 0;
    /** Where the orb is on screen, refreshed with the other sampled reads. */
    let centreX = 0;
    let centreY = 0;
    let perRadius = 1;

    const onMove = (e: PointerEvent) => {
      if (!look.current.interactive) return;
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      cursorOn = true;
      cursorX = e.clientX;
      cursorY = e.clientY;
    };
    /** Cursor gone from the window, or the tab lost: the heart comes back. */
    const onOut = (e?: PointerEvent) => {
      if (e && e.relatedTarget) return;
      cursorOn = false;
    };
    const onBlur = () => {
      cursorOn = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("blur", onBlur);

    // Press and ripple stay available for a caller that CAN receive events -
    // the orb answering a click where it is not a decoration. On the home
    // page nothing below ever fires, by design.
    onPointer.current = (e) => {
      if (!look.current.interactive) return;
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0) return;
      // One body radius is a fifth of the canvas, however large it is drawn.
      const per = r.width / 5;
      touch = {
        x: (e.clientX - (r.left + r.width / 2)) / per,
        y: (e.clientY - (r.top + r.height / 2)) / per,
      };
      hovering = true;
    };
    onLeave.current = () => {
      hovering = false;
      press.cut(performance.now()).to(0, 260);
    };
    onDown.current = () => {
      if (!look.current.interactive) return;
      const now = performance.now();
      press.cut(now).to(1, 140);
      queueRipple(ripple, now);
      queueBlink(lid, now, false, 60);
    };
    onUp.current = () => {
      press.cut(performance.now()).to(0, 320);
    };

    // ---- buffer sizing ----------------------------------------------------
    // The orb is CSS-scaled while the page scrolls, so the drawing buffer is
    // grown to the largest it has had to be and never shrunk: reallocating
    // mid-scroll costs more than the pixels saved, and drawing a big canvas
    // into a small box is only minification, which looks right.
    let buffer = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

    const sizeTo = (cssWidth: number) => {
      const want = Math.min(Math.ceil(cssWidth * dpr), BUFFER_CAP);
      if (want <= buffer * GROW_SLACK) return;
      buffer = want;
      canvas.width = buffer;
      canvas.height = buffer;
      gl.viewport(0, 0, buffer, buffer);
      gl.uniform2f(U.res, buffer, buffer);
    };

    /**
     * Where and how big the canvas actually lands on screen, transforms and
     * all - the drawing buffer, the orb's centre for the gaze, and what one
     * body radius is worth in screen pixels.
     *
     * A ResizeObserver would report the canvas's own layout box and miss
     * every scale above it, and the hero is scaled by the scroll on an
     * ancestor - so this has to be the rect. One read, three answers, taken
     * now and then rather than per frame.
     */
    const measure = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width > 0) {
        centreX = r.left + r.width / 2;
        centreY = r.top + r.height / 2;
        // The body is LIGHT_RADIUS of LIGHT_CANVAS: a fifth of the canvas.
        perRadius = r.width / 5;
      }
      sizeTo(r.width || size);
      const target = look.current.interactive && lightCue.look ? lookPoint(lightCue.look) : null;
      leading = target !== null;
      if (target) {
        leadX = target.x;
        leadY = target.y;
      }
    };
    measure();

    // ---- gating -----------------------------------------------------------
    // An orb nobody can see costs nothing: a scrolled-past hero and a hidden
    // tab both stop the loop rather than animating into the void.
    let onScreen = true;
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "120px" },
    );
    io.observe(host);

    let raf = 0;
    let stopped = false;
    let tick = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (stopped) return;
      if (!onScreen || document.hidden) {
        last = now;
        return;
      }

      // Both sampled at about 10Hz. The rect is needed this often because
      // the orb travels while the page scrolls and the gaze is measured from
      // where it actually is; the buffer side of it stays grow-only.
      if (tick % 6 === 0) {
        measure();
        readDrive();
      }
      tick += 1;

      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;

      // Ease toward what the page is doing. The road can jump its pace
      // between frames; the light is a body and may not.
      const chase = Math.min(1, dt * 5);
      rush += (rushTo - rush) * chase;
      glow += (glowTo - glow) * chase;

      const { accent: on, energy: e, sparks: sp, ramp: r } = look.current;

      /**
       * What travelling does to the body.
       *
       * The orb is the thing moving down the road, so the road's pace is its
       * pace: the currents inside it stream faster and wind harder around
       * the heart (`uSwirl`), and the silhouette firms up (`uTense` is what
       * rounds a drifting edge). Where the page asks for more light - an
       * answer landing, the closing line - that arrives as heat, which is
       * the shader's own word for a warmer aura and a fuller heart.
       *
       * Not `uScatter`, which was the first thing tried: it only throws the
       * finished-task sparks wider, and the site shows none, so it was an
       * effect that could never appear.
       *
       * All four are terms the shader already had for the app's own states.
       * Nothing new is invented here; the page is simply allowed to drive
       * what a thumb drives in the app.
       */
      // Thinking, eased: about a quarter of a second each way.
      const wantThink = look.current.interactive && lightCue.thinking ? 1 : 0;
      thinkNow += (wantThink - thinkNow) * Math.min(1, dt * 4.5);
      const pFlow = posture.flow + (thinking.flow - posture.flow) * thinkNow;
      const pSwirl = posture.swirl + (thinking.swirl - posture.swirl) * thinkNow;
      const pTense = posture.tense + (thinking.tense - posture.tense) * thinkNow;
      const pLean = posture.lean + (thinking.lean - posture.lean) * thinkNow;

      // A word landing: a warm swell that rises and falls in about half a
      // second, so speech is visible in the body as a soft pulse per word.
      const sinceWord = lightCue.word > 0 ? now - lightCue.word : Infinity;
      const spoken =
        look.current.interactive && sinceWord < 520 ? Math.sin((sinceWord / 520) * Math.PI) * 0.32 : 0;

      const bloom = Math.max(0, glow - 1.08);
      const heatNow = Math.min(1, heat.at(now) + bloom * 0.5 + spoken);
      const tenseNow = Math.min(1, pTense + rush * 0.42);
      const swirlNow = pSwirl + rush * 0.9;

      // The app's clock, plus the road: charge is a hold, which the site
      // has no equivalent of.
      flow += dt * pFlow * (1 + heatNow * 1.6 + rush * 1.5);
      if (flow > FLOW_WRAP) flow -= FLOW_WRAP;

      if (now >= nextQuirk) {
        runQuirk(now);
        nextQuirk = now + between(QUIRK_GAP_MS, Math.random());
      }

      // Breath: a ping-pong over the resting cycle, eased like a breath.
      const half = BREATH_MS[state] / 2;
      const phase = ((now - t0) % (half * 2)) / (half * 2);
      const tri = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const breath = SINE_IN_OUT(tri);

      const pressNow = press.at(now);
      const vitality = Math.max(ORB_VITALITY_FLOOR, Math.min(1, e));

      /**
       * Who the heart is following.
       *
       * Whatever the voice is talking about, while it talks about something;
       * otherwise the cursor while there is one, and the quirk tracks after
       * that - never two at once, or a glance and the cursor would add up and
       * throw the heart further than it can go. Either way the result is EASED rather than
       * set, so a cursor flung across the page turns the heart rather than
       * teleporting it, and losing the cursor lets it drift back instead of
       * snapping to the middle.
       */
      const want = leading
        ? gazeToward(leadX - centreX, leadY - centreY, perRadius)
        : cursorOn
          ? gazeToward(cursorX - centreX, cursorY - centreY, perRadius)
          : { x: gazeX.at(now), y: gazeY.at(now) };
      const turn = Math.min(1, dt * 5.5);
      gazeNow = {
        x: gazeNow.x + (want.x - gazeNow.x) * turn,
        y: gazeNow.y + (want.y - gazeNow.y) * turn,
      };

      gl.uniform1f(U.flow, flow);
      gl.uniform2f(U.gaze, gazeNow.x, gazeNow.y);
      gl.uniform1f(U.lid, lid.at(now));
      gl.uniform1f(U.energy, vitality);
      gl.uniform1f(U.charge, 0);
      gl.uniform1f(U.breath, breath);
      gl.uniform2f(
        U.touch,
        hovering || pressNow > 0 ? touch.x : 0,
        hovering || pressNow > 0 ? touch.y : 0,
      );
      gl.uniform1f(U.press, pressNow);
      gl.uniform1f(U.ripple, ripple.at(now));
      gl.uniform1f(U.heat, heatNow);
      gl.uniform1f(U.cool, 0);
      gl.uniform1f(U.alert, 0);
      gl.uniform1f(U.swirl, swirlNow);
      gl.uniform1f(U.tense, tenseNow);
      gl.uniform1f(U.rays, 0);
      gl.uniform1f(U.sparks, Math.max(0, Math.min(6, sp)));
      gl.uniform1f(U.scatter, scatter.at(now));
      gl.uniform1f(U.accent, on ? 1 : 0);
      gl.uniform3fv(U.base, hexToRgb(r.base));
      gl.uniform3fv(U.bright, hexToRgb(r.bright));
      gl.uniform3fv(U.hot, hexToRgb(r.hot));
      gl.uniform3fv(U.deep, hexToRgb(r.deep));

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // The body's own small movements: a hop, a stretch, a shiver. These are
      // transforms on the element, exactly as the app moves the view that
      // holds its canvas, so the shader never needs to know about them.
      const sq = squash.at(now);
      const hp = hop.at(now);
      const sk = shake.at(now);
      canvas.style.transform =
        `translate(${(sk * 1.5).toFixed(2)}px, ${(hp + pLean).toFixed(2)}px) ` +
        `scale(${(1 - sq).toFixed(4)}, ${(1 + sq).toFixed(4)})`;
    };

    raf = requestAnimationFrame(frame);
    // One frame is on screen before the cross-fade starts, so the shader is
    // never faded up over an empty canvas.
    const ready = window.setTimeout(() => setLive(true), 60);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(ready);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", onBlur);
      onPointer.current = null;
      onLeave.current = null;
      onDown.current = null;
      onUp.current = null;
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      setLive(false);
    };
  }, [still, size]);

  return (
    <div
      ref={hostRef}
      className={`light-body ${className}`.trim()}
      style={{ width: size, height: size, colorScheme: "only dark" }}
      data-live={live ? "" : undefined}
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
      onPointerDown={interactive ? handlePointerDown : undefined}
      onPointerUp={interactive ? handlePointerUp : undefined}
      aria-hidden
    >
      {/* Step 1: the same picture, with no GL and no frame. Also the SSR
          render, so the orb is there in the very first paint. */}
      <LightVectorBody
        size={size}
        accent={accent}
        energy={energy}
        ramp={ramp}
        className="light-body__vector"
      />
      {/* Step 2: the body starts to move. The canvas carries the whole
          drawing, corona included, so it is the full LIGHT_CANVAS in the
          orb's own units and overflows the layout box just as the light
          does. */}
      {still ? null : (
        <canvas
          ref={canvasRef}
          className="light-body__gl"
          style={{
            width: canvasBox,
            height: canvasBox,
            marginLeft: -canvasBox / 2,
            marginTop: -canvasBox / 2,
          }}
        />
      )}
    </div>
  );
}

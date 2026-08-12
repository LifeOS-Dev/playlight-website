import * as React from "react";

/** Where the orb should sit while a given section owns the viewport. */
export type OrbStop = {
  /** Horizontal position as a fraction of viewport width (0.5 = centre) */
  x?: number;
  /** Vertical position as a fraction of viewport height */
  y: number;
  /** Multiplier on the base orb size */
  size: number;
  /** 0 = dim night · 1 = resting · 1.4 = bloom */
  i: number;
  /** How present the perspective grid is behind everything */
  grid: number;
  /** Seconds for the floor grid to travel one tile - higher is slower */
  road: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Drives the whole page from one scroll listener.
 *
 * Each section registers an anchor element and the orb state it wants. On
 * scroll we find which pair of anchors the viewport centre falls between and
 * write the interpolated result to CSS custom properties on `root` - so the
 * orb, the grid and the lightfall all move without React re-rendering.
 */
export function useLightScroll(
  root: React.RefObject<HTMLElement | null>,
  anchors: Array<React.RefObject<HTMLElement | null>>,
  stops: OrbStop[],
) {
  React.useEffect(() => {
    const el = root.current;
    if (!el) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const vh = window.innerHeight;
      const focus = window.scrollY + vh * 0.5;

      // Anchor scroll positions: the centre of each section.
      const marks = anchors.map((a) => {
        const node = a.current;
        if (!node) return 0;
        const rect = node.getBoundingClientRect();
        return window.scrollY + rect.top + rect.height * 0.5;
      });

      // A final section shorter than the viewport has a centre the page can
      // never scroll to, which would strand the orb mid-interpolation. Pull
      // the last mark back to the furthest reachable focus point.
      const maxFocus = document.documentElement.scrollHeight - vh * 0.5;
      const last = marks.length - 1;
      marks[last] = Math.min(marks[last], maxFocus);

      // That clamp can leave the final pair almost touching, which would cram
      // a whole stop change into a few pixels of scroll and read as a snap.
      // Walk backwards guaranteeing every transition has room to breathe.
      const minGap = vh * 0.55;
      for (let n = last; n > 0; n -= 1) {
        if (marks[n] - marks[n - 1] < minGap) marks[n - 1] = marks[n] - minGap;
      }

      let idx = 0;
      while (idx < marks.length - 2 && focus > marks[idx + 1]) idx += 1;

      const span = marks[idx + 1] - marks[idx];
      const t = span > 0 ? clamp01((focus - marks[idx]) / span) : 0;
      // Ease so the orb settles inside a section rather than sliding constantly.
      const e = t * t * (3 - 2 * t);

      const a = stops[idx];
      const b = stops[idx + 1] ?? stops[idx];

      // The road owns the light while its stage is pinned. One writer at a
      // time - two systems setting --orb-* in the same frame is what made
      // this fragile before.
      if (el.hasAttribute("data-road")) return;

      const ax = a.x ?? 0.5;
      const bx = b.x ?? 0.5;
      el.style.setProperty("--orb-x", `${lerp(ax, bx, e) * 100}vw`);
      el.style.setProperty("--orb-y", `${lerp(a.y, b.y, e) * 100}vh`);
      el.style.setProperty("--orb-scale", `${lerp(a.size, b.size, e)}`);
      el.style.setProperty("--orb-i", `${lerp(a.i, b.i, e)}`);
      el.style.setProperty("--grid-o", `${lerp(a.grid, b.grid, e)}`);
      el.style.setProperty("--road-speed", `${lerp(a.road, b.road, e)}`);
    };

    apply();

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
    };
  }, [root, anchors, stops]);
}

/**
 * Progress of one element through a sticky scroll, 0 → 1.
 * Used by the problem→solution filmstrip to advance horizontally.
 */
export function useStickyProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) {
        setProgress(0);
        return;
      }
      setProgress(clamp01(-rect.top / travel));
    };

    apply();
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
    };
  }, [ref]);

  return progress;
}

/** Adds a class once the element has been seen, for one-shot reveals. */
export function useReveal<T extends HTMLElement>(threshold = 0.35) {
  const ref = React.useRef<T | null>(null);
  const [seen, setSeen] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [seen, threshold]);

  return [ref, seen] as const;
}

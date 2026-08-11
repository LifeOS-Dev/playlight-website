import * as React from "react";

/** One tile of the floor grid, in px — must match background-size in pl3.css. */
const TILE = 72;

/**
 * Keeps the floor moving, always.
 *
 * Position is integrated frame by frame from the current pace instead of
 * being handed to a CSS animation, because the pace changes constantly and
 * re-timing a running animation makes the whole floor jump. Both inputs are
 * read off the root's inline style — a CSSOM read that costs nothing, and
 * keeps the road's scroll handler as the only writer.
 */
function useFloorDrift(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  React.useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    const root = node?.closest(".pl3") as HTMLElement | null;
    const plane = node?.querySelector<HTMLElement>(".pl3-grid__plane");
    if (!root || !plane) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let y = 0;
    let last = performance.now();
    // Nothing to animate while the floor is off screen; a page's worth of
    // scrolling below the fold shouldn't keep a phone's GPU awake.
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      last = performance.now();
    });
    io.observe(plane);

    const tick = (now: number) => {
      if (!onScreen) {
        last = now;
        raf = requestAnimationFrame(tick);
        return;
      }
      // A backgrounded tab resumes with a huge delta; cap it or the floor
      // teleports the moment you come back.
      const dt = Math.min(64, now - last);
      last = now;

      const secPerTile = parseFloat(root.style.getPropertyValue("--road-speed")) || 2.2;
      const rush = parseFloat(root.style.getPropertyValue("--road-rush")) || 0;
      const speed = (TILE / secPerTile) * (1 + rush * 5.5);

      y = (y + (speed * dt) / 1000) % TILE;
      plane.style.setProperty("--grid-y", `${y.toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [ref, enabled]);
}

/**
 * The world the light sits in: a perspective floor receding to a horizon,
 * light streaming past while you travel, a vignette that closes the edges,
 * and film grain over everything.
 *
 * Fixed to the viewport and driven entirely by CSS custom properties that
 * `useLightScroll` and the road write, so scrolling never re-renders React.
 *
 * `still` keeps the same world without the travel, for pages where you have
 * come to read something rather than to be taken somewhere.
 */
export function LightField({ still = false }: { still?: boolean }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  useFloorDrift(ref, !still);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Clip and perspective must be separate — overflow on the
          perspective parent flattens rotateX into a flat graph. */}
      <div className="pl3-grid">
        <div className="pl3-grid__persp">
          <div className="pl3-grid__plane" />
        </div>
      </div>

      {/* horizon haze — where the floor meets the dark */}
      <div className="pl3-horizon" />

      {/* the orb warms whatever it is near */}
      <div className="pl3-lightfall" />

      {/* close the edges so the light is the only way out */}
      <div className="pl3-vignette" />

      {/* anti-plastic insurance */}
      <div className="pl3-grain" />
    </div>
  );
}

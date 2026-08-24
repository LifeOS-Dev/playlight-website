/**
 * The world the light sits in: a perspective floor receding to a horizon,
 * a vignette that closes the edges, and film grain over everything.
 *
 * Fixed to the viewport and driven entirely by CSS custom properties that
 * `useLightScroll` writes, so scrolling never re-renders React.
 */
export function LightField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* the floor */}
      <div className="pl2-grid">
        <div className="pl2-grid__plane" />
      </div>

      {/* horizon haze — where the floor meets the dark */}
      <div className="pl2-horizon" />

      {/* the orb warms whatever it is near */}
      <div className="pl2-lightfall" />

      {/* close the edges so the light is the only way out */}
      <div className="pl2-vignette" />

      {/* anti-plastic insurance */}
      <div className="pl2-grain" />
    </div>
  );
}

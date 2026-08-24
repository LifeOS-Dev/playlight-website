/**
 * Soft perspective life-grid under the orb.
 * Slow drift — atmosphere, not decoration overload.
 */
export function LifeGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-x-0 top-[28%] h-[55%] opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 35%, rgba(255,163,43,0.12), transparent 68%)",
        }}
      />

      <div className="v2a-grid-plane absolute inset-x-[-20%] bottom-[-8%] top-[38%]">
        <svg
          className="v2a-grid-drift h-full w-full"
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="v2a-grid-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(200,192,180,0)" />
              <stop offset="18%" stopColor="rgba(200,192,180,0.22)" />
              <stop offset="100%" stopColor="rgba(200,192,180,0.04)" />
            </linearGradient>
            <linearGradient id="v2a-grid-horiz" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(200,192,180,0)" />
              <stop offset="50%" stopColor="rgba(200,192,180,0.35)" />
              <stop offset="100%" stopColor="rgba(200,192,180,0)" />
            </linearGradient>
          </defs>

          {Array.from({ length: 17 }).map((_, i) => {
            const x = (i / 16) * 100;
            return (
              <line
                key={`v-${i}`}
                x1="50"
                y1="0"
                x2={x}
                y2="60"
                stroke="url(#v2a-grid-fade)"
                strokeWidth="0.12"
              />
            );
          })}

          {[8, 16, 26, 38, 52].map((y) => (
            <line
              key={`h-${y}`}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="url(#v2a-grid-horiz)"
              strokeWidth="0.15"
              opacity={0.35 + y / 120}
            />
          ))}
        </svg>
      </div>

      <div
        className="absolute bottom-0 left-1/2 h-[28%] w-[70%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255,163,43,0.14), transparent 70%)",
          filter: "blur(24px)",
        }}
      />
    </div>
  );
}

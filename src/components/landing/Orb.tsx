interface OrbProps {
  size?: number;
  className?: string;
}

/**
 * PlayLight orb — a soft, boundary-less ball of light.
 * Inspired by Claude's mark + a luminous sphere.
 */
export function Orb({ size = 140, className = "" }: OrbProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-label="PlayLight"
    >
      {/* periodic surge bloom — intense glow every ~7s */}
      <div
        className="absolute inset-[-140%] rounded-full animate-orb-surge"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.95 0.15 75 / 0.7), oklch(0.88 0.13 70 / 0.2) 40%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* far ambient bloom — no edges, just warmth */}
      <div
        className="absolute inset-[-90%] rounded-full animate-orb-breathe"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.88 0.13 70 / 0.45), oklch(0.88 0.13 70 / 0.12) 35%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      {/* outer halo, slightly off-axis for organic shape */}
      <div
        className="absolute inset-[-40%] rounded-full animate-orb-swirl"
        style={{
          background:
            "radial-gradient(circle at 55% 45%, oklch(0.9 0.12 72 / 0.55), transparent 60%)",
          filter: "blur(24px)",
        }}
      />
      {/* mid glow, opposite offset — gives cloud-like irregularity */}
      <div
        className="absolute inset-[-15%] rounded-full animate-orb-swirl-reverse"
        style={{
          background:
            "radial-gradient(circle at 42% 58%, oklch(0.94 0.1 78 / 0.7), transparent 65%)",
          filter: "blur(14px)",
        }}
      />
      {/* warm core — soft, no hard rounded-full disc */}
      <div
        className="absolute inset-0 rounded-full animate-orb-pulse"
        style={{
          background:
            "radial-gradient(circle at 45% 42%, oklch(1 0.02 90 / 0.98) 0%, oklch(0.95 0.1 78 / 0.9) 25%, oklch(0.82 0.15 60 / 0.6) 55%, oklch(0.7 0.16 50 / 0.2) 78%, transparent 92%)",
          filter: "blur(8px)",
        }}
      />
      {/* bright nucleus */}
      <div
        className="absolute inset-0 rounded-full animate-orb-nucleus"
        style={{
          background:
            "radial-gradient(circle at 42% 38%, oklch(1 0.03 88 / 0.95) 0%, transparent 35%)",
          filter: "blur(2px)",
        }}
      />
      {/* specular highlight */}
      <div
        className="absolute rounded-full animate-orb-shine"
        style={{
          top: "18%",
          left: "26%",
          width: "32%",
          height: "22%",
          background:
            "radial-gradient(ellipse at center, oklch(1 0 0 / 0.75), transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}
import { LightBody } from "@/components/landing/orb/LightBody";

interface OrbProps {
  size?: number;
  className?: string;
  /** Kept for call-site compat - maps loosely to accent strength. */
  intensity?: number;
  /** Kept for call-site compat - night dims; others stay lit. */
  mood?: "rest" | "focus" | "think" | "night" | "bloom";
}

/**
 * Shared marketing orb - the same body the app draws.
 *
 * `mood` and `intensity` predate the living body and are kept because callers
 * still pass them: night dims and decolours, everything else stays lit. The
 * app expresses those as postures the shader knows about, and if this orb ever
 * needs them properly they should come from `postureFor` rather than from
 * opacity on a wrapper.
 */
export function Orb({ size = 140, className = "", intensity = 1, mood = "rest" }: OrbProps) {
  const accent = mood !== "night" && intensity > 0.35;
  return (
    <div
      className={className}
      style={{
        opacity: mood === "night" ? 0.55 : Math.min(1, 0.45 + intensity * 0.55),
      }}
      aria-label="Playlight"
    >
      <LightBody size={size} accent={accent} sparks={0} />
    </div>
  );
}

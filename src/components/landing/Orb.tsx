import { AppOrb } from "@/components/landing/orb/AppOrb";

interface OrbProps {
  size?: number;
  className?: string;
  /** Kept for call-site compat - maps loosely to accent strength. */
  intensity?: number;
  /** Kept for call-site compat - night dims; others stay lit. */
  mood?: "rest" | "focus" | "think" | "night" | "bloom";
}

/**
 * Shared marketing orb - same object as the Playlight app.
 * White essence never tints; amber lives outside as ring / aura / corona.
 */
export function Orb({
  size = 140,
  className = "",
  intensity = 1,
  mood = "rest",
}: OrbProps) {
  const accent = mood !== "night" && intensity > 0.35;
  return (
    <div
      className={className}
      style={{
        opacity: mood === "night" ? 0.55 : Math.min(1, 0.45 + intensity * 0.55),
      }}
      aria-label="Playlight"
    >
      <AppOrb size={size} accent={accent} sparks={0} />
    </div>
  );
}

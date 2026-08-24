import { AppOrb } from "@/components/landing/orb/AppOrb";

/**
 * Fixed traveling light for the /v2 archive — same app orb DNA as homepage.
 */
export function LightOrb() {
  return (
    <div className="pl2-orb" aria-hidden="true">
      <div className="pl2-orb__inner">
        <AppOrb size={260} accent sparks={0} />
      </div>
    </div>
  );
}

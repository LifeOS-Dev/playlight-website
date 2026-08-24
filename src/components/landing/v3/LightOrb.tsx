import { AppOrb } from "@/components/landing/orb/AppOrb";
import type { AccentRamp } from "@/components/landing/orb/ramp";
import { OrbSpeech } from "./OrbSpeech";

/**
 * The light - fixed to the viewport, driven by --orb-* scroll tokens.
 * Visual DNA matches the in-app ShowcaseOrb (white essence + amber field).
 * Speech sits beside the scaled shell so the words never swell with the orb.
 */
export function LightOrb({ ramp }: { ramp?: AccentRamp }) {
  return (
    <>
      <div className="pl3-orb" aria-hidden="true">
        <div className="pl3-orb__inner">
          {/* AppOrb is 200px; .pl3-orb__app scales it to --orb-base */}
          <div className="pl3-orb__app">
            <AppOrb size={200} accent sparks={0} ramp={ramp} />
          </div>
        </div>
      </div>
      <OrbSpeech />
    </>
  );
}

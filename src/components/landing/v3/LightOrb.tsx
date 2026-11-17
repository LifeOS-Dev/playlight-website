import { LightBody } from "@/components/landing/orb/LightBody";
import type { AccentRamp } from "@/components/landing/orb/ramp";
import { OrbSpeech } from "./OrbSpeech";

/**
 * The light - fixed to the viewport, driven by --orb-* scroll tokens.
 *
 * The same body the app draws: one shader, slow currents, a drifting edge, a
 * white heart that looks around and blinks (see orb/lightShader.ts). It is the
 * one orb on the site that is worth a GL context, so it is the one that gets
 * the pointer too - the light pools under the cursor and the heart follows it,
 * exactly as it answers a thumb in the app.
 *
 * Speech sits beside the scaled shell so the words never swell with the orb.
 */
export function LightOrb({ ramp }: { ramp?: AccentRamp }) {
  return (
    <>
      <div className="pl3-orb" aria-hidden="true">
        <div className="pl3-orb__inner">
          {/* The body is 200 units; .pl3-orb__app scales it to --orb-base */}
          <div className="pl3-orb__app">
            <LightBody size={200} accent sparks={0} ramp={ramp} interactive />
          </div>
        </div>
      </div>
      <OrbSpeech />
    </>
  );
}

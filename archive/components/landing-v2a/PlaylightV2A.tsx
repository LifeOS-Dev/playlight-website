import { useCallback, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Orb } from "@/components/landing/Orb";
import { V2AHero } from "./V2AHero";
import { CoreFourSequence } from "./CoreFourSequence";
import { V2AFaq, V2AFooter } from "./V2AFaq";
import type { CoreFace } from "./coreFour";

type OrbState = {
  mood: "rest" | "focus" | "think" | "night" | "bloom";
  intensity: number;
  mode: "hero" | "companion" | "quiet";
};

/**
 * Grok's original v2 design — restored for side-by-side comparison at /v2-a.
 * Visual-first: hero composition → Core Four problem→solution → FAQ.
 */
export function PlaylightV2A() {
  const [orb, setOrb] = useState<OrbState>({
    mood: "rest",
    intensity: 1.15,
    mode: "hero",
  });

  const onActiveFace = useCallback((face: CoreFace | null, reveal: number) => {
    if (!face) {
      setOrb((o) => ({ ...o, mode: "quiet", mood: "rest", intensity: 0.85 }));
      return;
    }
    setOrb({
      mode: "companion",
      mood: face.mood,
      intensity: face.intensity * (0.85 + reveal * 0.25),
    });
  }, []);

  return (
    <div className="v2a-page relative min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#C8C0B4]/70 transition-colors hover:text-[#F2EEE9]"
          >
            ← live site
          </Link>
          <Link
            to="/v2"
            className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#C8C0B4]/70 transition-colors hover:text-[#F2EEE9]"
          >
            Claude v2 →
          </Link>
        </div>
        <span className="rounded-full border border-[#FFA32B]/35 bg-[#FFA32B]/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-[#FFA32B]">
          grok · v2-a
        </span>
      </header>

      <div
        className="pointer-events-none fixed inset-x-0 top-[10%] z-[5] flex justify-center transition-opacity duration-700 md:top-[8%]"
        style={{
          opacity: orb.mode === "companion" ? 0.95 : 0,
        }}
        aria-hidden
      >
        <div
          className="transition-transform duration-700"
          style={{
            transform: `scale(${orb.mode === "companion" ? 0.72 : 0.5})`,
          }}
        >
          <Orb size={120} intensity={orb.intensity} mood={orb.mood} />
        </div>
      </div>

      <main className="relative z-10">
        <div
          className="transition-opacity duration-500"
          style={{ opacity: orb.mode === "companion" ? 0.35 : 1 }}
        >
          <V2AHero orbIntensity={1.15} orbMood="rest" />
        </div>

        <CoreFourSequence onActiveFace={onActiveFace} />

        <V2ACtaStrip />
        <V2AFaq />
        <V2AFooter />
      </main>
    </div>
  );
}

function V2ACtaStrip() {
  return (
    <section className="relative px-6 py-20 text-center md:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(255,163,43,0.08), transparent 70%)",
        }}
        aria-hidden
      />
      <p className="relative font-display text-[clamp(1.5rem,4vw,2.25rem)] font-light tracking-tight text-[#F2EEE9]">
        See your life. Know what matters now.
      </p>
      <p className="relative mx-auto mt-4 max-w-md font-body text-sm text-[#C8C0B4]">
        Without another exhausting productivity system.
      </p>
      <a
        href="#"
        className="relative mt-8 inline-flex items-center justify-center rounded-full bg-[#F2EEE9] px-7 py-3 font-body text-sm font-medium text-[#0E0C0A] transition-transform hover:-translate-y-0.5"
      >
        Get Playlight
      </a>
    </section>
  );
}

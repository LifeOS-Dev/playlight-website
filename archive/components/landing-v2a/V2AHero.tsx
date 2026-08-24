import { Apple, Play } from "lucide-react";
import { Orb } from "@/components/landing/Orb";
import { LifeGrid } from "./LifeGrid";
import { LifeMotifs } from "./LifeMotifs";

type Props = {
  orbIntensity?: number;
  orbMood?: "rest" | "focus" | "think" | "night" | "bloom";
};

/**
 * Endel-adjacent hero: brand + one line + CTAs + dominant orb/grid composition.
 */
export function V2AHero({ orbIntensity = 1.15, orbMood = "rest" }: Props) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24">
      <LifeGrid />
      <LifeMotifs />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="v2a-hero-orb mb-8 md:mb-10">
          <Orb size={148} intensity={orbIntensity} mood={orbMood} />
        </div>

        <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-light leading-none tracking-tight text-[#F2EEE9]">
          play<span className="text-[#FFA32B]">light</span>
        </h1>

        <p className="mt-5 max-w-sm text-balance font-body text-[15px] leading-relaxed text-[#C8C0B4] md:text-base">
          Visualize and navigate your life.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#"
            className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] px-5 py-3 text-[#F2EEE9] backdrop-blur-sm transition-[border-color,transform,background] hover:-translate-y-0.5 hover:border-[#FFA32B]/50 hover:bg-white/[0.07]"
          >
            <Apple className="h-5 w-5" />
            <span className="text-left leading-tight">
              <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-[#C8C0B4]">
                Download on the
              </span>
              <span className="block text-sm font-medium">App Store</span>
            </span>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] px-5 py-3 text-[#F2EEE9] backdrop-blur-sm transition-[border-color,transform,background] hover:-translate-y-0.5 hover:border-[#FFA32B]/50 hover:bg-white/[0.07]"
          >
            <Play className="h-5 w-5 fill-current" />
            <span className="text-left leading-tight">
              <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-[#C8C0B4]">
                Get it on
              </span>
              <span className="block text-sm font-medium">Google Play</span>
            </span>
          </a>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-[#C8C0B4]/70"
        aria-hidden
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.32em]">scroll</span>
        <span className="v2a-scroll-cue block h-9 w-px bg-gradient-to-b from-[#FFA32B]/80 to-transparent" />
      </div>
    </section>
  );
}

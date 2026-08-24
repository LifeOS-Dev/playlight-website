import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import { LightField } from "@/components/landing/v3/LightField";
import { LightOrb } from "@/components/landing/v3/LightOrb";
import { RoadJourney } from "@/components/landing/v3/RoadJourney";
import { Faq } from "@/components/landing/v3/Faq";
import { LookInside } from "@/components/landing/v3/LookInside";
import { SiteHeader } from "@/components/landing/v3/SiteHeader";
import { V3Footer } from "@/components/landing/v3/V3Footer";
import { GetPlaylightPanel } from "@/components/landing/v3/TryToday";
import { useLightScroll, type OrbStop } from "@/components/landing/v3/useLightScroll";
import { PrismGate, gateCloseMs, gateExitMs } from "@/components/landing/v3/PrismGate";
import {
  DEFAULT_GATE_MODE,
  defaultModeFor,
  readGateMode,
  writeGateMode,
  type GateMode,
} from "@/components/landing/v3/gateMode";
import { applyVibe, defaultVibe, readVibe, writeVibe } from "@/components/landing/v3/vibe";
import { vibeById, type Vibe } from "@/components/landing/orb/ramp";
import { pageMeta } from "@/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({
      title: "Playlight - your personalized OS for life",
      description: "Your personalized OS to help you understand, organize, and play life.",
    }),
  }),
  component: HomePage,
});

/**
 * Stops for everything after the road. The road drives the light itself while
 * its stage is pinned; these pick it up once it releases, starting from where
 * the journey left it so the handover is invisible.
 */
const STOPS: OrbStop[] = [
  // Matches the pose the journey ends on, so the handover is invisible.
  { y: 0.66, size: 0.92, i: 1.45, grid: 0.34, road: 7 }, // leaving the road
  // Just under the fold: the frames stand in its glow, and no caption
  // has to be read through it.
  { y: 1.08, size: 0.72, i: 0.8, grid: 0.26, road: 8 }, // look inside
  // Off to the side while you read: centred, even small and dim, it sat
  // right on top of the questions.
  { x: 0.87, y: 0.3, size: 0.34, i: 0.55, grid: 0.16, road: 9 }, // faq
  { y: 0.84, size: 0.46, i: 1.1, grid: 0.3, road: 7.5 }, // footer - settles, blooms
];

function HomePage() {
  const root = React.useRef<HTMLDivElement | null>(null);
  const road = React.useRef<HTMLElement | null>(null);
  const look = React.useRef<HTMLElement | null>(null);
  const faq = React.useRef<HTMLElement | null>(null);
  const footer = React.useRef<HTMLElement | null>(null);

  const anchors = React.useMemo(() => [road, look, faq, footer], []);

  useLightScroll(root, anchors, STOPS);

  /**
   * The gate has two lives.
   *
   * "arrival" is the one everybody meets, and it runs once ever: it
   * renders on the server too, but its first stage is fully transparent -
   * so a returning visitor whose choice we already know never sees it
   * flash before the effect below dismisses it.
   *
   * "replay" is the same gate reopened from the dot in the header. The
   * choice is remembered forever, but it was a one-way door until this
   * existed: pick a light in the two seconds the gate is up and you wore
   * it until you cleared site data. Remembering and being able to change
   * your mind are not in tension - you just need both.
   */
  const [gate, setGate] = React.useState<"arrival" | "replay" | null>("arrival");

  /**
   * Which beat the gate is on, because the page has to move with it: the
   * site's own orb is held dark under an open gate and lit again on the
   * way out, and prism-gate.css times that off this. "leaving" is a light
   * being handed over; "closing" is a replay walked away from.
   */
  const [phase, setPhase] = React.useState<"open" | "leaving" | "closing">("open");

  const [vibe, setVibe] = React.useState<Vibe>(defaultVibe);

  /**
   * Which way of choosing is up, while three of them are being tried
   * against each other on a real phone. `null` outside that - the site
   * ships one mechanic and never asks. See gateMode.ts.
   */
  const [trying, setTrying] = React.useState<GateMode | null>(null);

  /**
   * Which mechanic is up. Settled after mount, never during render: it
   * depends on the device, and the server has no device. Until then it
   * is the desktop one, which is what the arrival's first second looks
   * like on any of them - a white orb blooming, no controls yet - so
   * the correction lands long before anything of it is on screen.
   */
  const [mode, setMode] = React.useState<GateMode>(DEFAULT_GATE_MODE);

  React.useEffect(() => {
    const test = readGateMode();
    if (test.testing) setTrying(test.mode);
    setMode(test.testing ? test.mode : defaultModeFor());

    const saved = readVibe();
    if (saved) {
      const v = vibeById(saved);
      setVibe(v);
      applyVibe(root.current, v);
      // ...but a mechanic under test has to be meetable more than once,
      // and a remembered choice would let it be met exactly one time.
      if (!test.testing) setGate(null);
    } else {
      applyVibe(root.current, defaultVibe());
    }
  }, []);

  /** Held, so a gate left early cannot fire its exit into a later one. */
  const exit = React.useRef(0);
  React.useEffect(() => () => window.clearTimeout(exit.current), []);

  const close = React.useCallback((after: number) => {
    window.clearTimeout(exit.current);
    exit.current = window.setTimeout(() => {
      setGate(null);
      setPhase("open");
    }, after);
  }, []);

  const choose = React.useCallback(
    (chosen: Vibe) => {
      setVibe(chosen);
      applyVibe(root.current, chosen);
      writeVibe(chosen.id);
      // the gate stays mounted for the whole handover - PrismGate owns its length
      setPhase("leaving");
      close(gateExitMs());
    },
    [close],
  );

  const reopen = React.useCallback(() => {
    window.clearTimeout(exit.current);
    setPhase("open");
    setGate("replay");
  }, []);

  /** Left without choosing: no handover, just the black lifting. */
  const keep = React.useCallback(() => {
    setPhase("closing");
    close(gateCloseMs());
  }, [close]);

  return (
    <div
      ref={root}
      className="pl3"
      /* The site's light waits in the dark under an open gate and is lit
         again on the way out, so there are never two orbs on screen. A
         gate being walked away from is not a handover, so it gets
         neither state - the black simply lifts off what was always
         underneath it. */
      data-gate={gate && phase !== "closing" ? (phase === "leaving" ? "leaving" : "on") : undefined}
    >
      {gate ? (
        <PrismGate
          onChoose={choose}
          replay={gate === "replay"}
          current={vibe.id}
          onDismiss={keep}
          closing={phase === "closing"}
          mode={mode}
          onMode={
            trying
              ? (m) => {
                  writeGateMode(m);
                  setTrying(m);
                  setMode(m);
                }
              : undefined
          }
        />
      ) : null}
      <LightField />
      <LightOrb ramp={vibe.ramp} />

      <a className="pl3-skiplink" href="#faq">
        Skip to questions
      </a>

      <SiteHeader vibe={vibe} onChangeVibe={reopen} />

      <main className="pl3-main">
        <div ref={road as React.RefObject<HTMLDivElement>}>
          <RoadJourney />
        </div>

        <section ref={look} id="look">
          <LookInside />
        </section>

        <section ref={faq} id="faq" className="pl3-faq-anchor">
          <Faq />
        </section>
      </main>

      <section ref={footer} className="pl3-footer-anchor">
        <V3Footer />
      </section>

      <GetPlaylightPanel />
    </div>
  );
}

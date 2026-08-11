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
import { pageMeta } from "@/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({
      title: "Playlight — your personalized OS for life",
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
  { y: 0.7, size: 0.92, i: 1.45, grid: 0.34, road: 7 }, // leaving the road
  // Just under the fold: the frames stand in its glow, and no caption
  // has to be read through it.
  { y: 1.08, size: 0.72, i: 0.8, grid: 0.26, road: 8 }, // look inside
  // Off to the side while you read: centred, even small and dim, it sat
  // right on top of the questions.
  { x: 0.87, y: 0.3, size: 0.34, i: 0.55, grid: 0.16, road: 9 }, // faq
  { y: 0.84, size: 0.46, i: 1.1, grid: 0.3, road: 7.5 }, // footer — settles, blooms
];

function HomePage() {
  const root = React.useRef<HTMLDivElement | null>(null);
  const road = React.useRef<HTMLElement | null>(null);
  const look = React.useRef<HTMLElement | null>(null);
  const faq = React.useRef<HTMLElement | null>(null);
  const footer = React.useRef<HTMLElement | null>(null);

  const anchors = React.useMemo(() => [road, look, faq, footer], []);

  useLightScroll(root, anchors, STOPS);

  return (
    <div ref={root} className="pl3">
      <LightField />
      <LightOrb />

      <a className="pl3-skiplink" href="#faq">
        Skip to questions
      </a>

      <SiteHeader />

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

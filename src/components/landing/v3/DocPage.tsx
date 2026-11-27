import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LightField } from "./LightField";
import { SiteHeader } from "./SiteHeader";
import { V3Footer } from "./V3Footer";
import { applyVibe, readVibe } from "./vibe";
import { vibeById } from "@/components/landing/orb/ramp";

/**
 * The shell for everything that is words: support, privacy, deletion.
 *
 * These pages were the old cream-paper theme with their own nav, so following
 * a footer link felt like landing on a different company's site. They now sit
 * in the same night, with the same header and footer - the floor holds still,
 * because you came here to read.
 */
export function DocPage({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  const root = React.useRef<HTMLDivElement>(null);

  // The home page publishes the chosen light onto .pl3. These pages are
  // their own root, so the mark — PLAY, and the air around its orb —
  // would otherwise fall back to amber no matter what was chosen.
  React.useEffect(() => {
    applyVibe(root.current, vibeById(readVibe()));
  }, []);

  return (
    <div ref={root} className="pl3 pl3-doc">
      <LightField still />
      <SiteHeader />

      <main className="pl3-doc__inner">
        <Link to="/" className="pl3-doc__back">
          <ArrowLeft aria-hidden />
          Back
        </Link>
        {eyebrow ? <p className="pl3-doc__eyebrow">{eyebrow}</p> : null}
        <h1 className="pl3-doc__title">{title}</h1>
        {lead ? <div className="pl3-doc__lead">{lead}</div> : null}
        {children}
      </main>

      <V3Footer />
    </div>
  );
}

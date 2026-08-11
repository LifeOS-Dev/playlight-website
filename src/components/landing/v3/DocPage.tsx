import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LightField } from "./LightField";
import { SiteHeader } from "./SiteHeader";
import { V3Footer } from "./V3Footer";
import { GetPlaylightPanel } from "./TryToday";

/**
 * The shell for everything that is words: support, privacy, deletion.
 *
 * These pages were the old cream-paper theme with their own nav, so following
 * a footer link felt like landing on a different company's site. They now sit
 * in the same night, with the same header and footer — the floor holds still,
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
  return (
    <div className="pl3 pl3-doc">
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
      <GetPlaylightPanel />
    </div>
  );
}

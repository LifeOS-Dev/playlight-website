import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/landing/SiteNav";
import { Hero } from "@/components/landing/Hero";
import { Manifesto } from "@/components/landing/Manifesto";
import { Architecture } from "@/components/landing/Architecture";
import { FinalHook } from "@/components/landing/FinalHook";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "PlayLight — more information" },
      {
        name: "description",
        content:
          "Learn more about PlayLight: a holistic system that blends life design with daily execution.",
      },
      { property: "og:title", content: "PlayLight — more information" },
      {
        property: "og:description",
        content: "A holistic system that blends life design with daily execution.",
      },
    ],
  }),
  component: DetailsPage,
});

function DetailsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute left-6 top-6 z-20 md:left-10 md:top-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
      </div>
      <SiteNav />
      <main>
        <Hero />
        <Manifesto />
        <Architecture />
        <FinalHook />
      </main>
      <SiteFooter />
    </div>
  );
}
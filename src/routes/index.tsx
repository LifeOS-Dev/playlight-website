import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Orb } from "@/components/landing/Orb";
import { SpotlightBackground } from "@/components/landing/SpotlightBackground";
import { Apple, Play, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlayLight — a tool to visualize and navigate your life" },
      {
        name: "description",
        content: "PlayLight is a tool to visualize and navigate your life.",
      },
      { property: "og:title", content: "PlayLight" },
      {
        property: "og:description",
        content: "A tool to visualize and navigate your life.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      <SpotlightBackground />

      {/* center content */}
      <main className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <Orb size={160} />

        <h1 className="mt-10 text-5xl font-light tracking-tight text-foreground md:text-7xl">
          play<span className="text-accent">light</span>
        </h1>

        <p className="mt-5 max-w-md text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          A tool to visualize and navigate your life.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#"
            className="inline-flex items-center gap-3 rounded-full bg-foreground px-5 py-3 text-background transition-transform hover:-translate-y-0.5"
          >
            <Apple className="h-6 w-6" />
            <span className="text-left leading-tight">
              <span className="block font-mono text-[9px] uppercase tracking-[0.25em] opacity-70">
                Download on the
              </span>
              <span className="block text-sm font-medium">App Store</span>
            </span>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-3 rounded-full bg-foreground px-5 py-3 text-background transition-transform hover:-translate-y-0.5"
          >
            <Play className="h-6 w-6 fill-current" />
            <span className="text-left leading-tight">
              <span className="block font-mono text-[9px] uppercase tracking-[0.25em] opacity-70">
                Get it on
              </span>
              <span className="block text-sm font-medium">Google Play</span>
            </span>
          </a>
        </div>

        <Link
          to="/details"
          className="group mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          More information
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <div className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <Link to="/privacy" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
          <Link to="/support" className="transition-colors hover:text-foreground">
            Support
          </Link>
        </div>
      </main>
    </div>
  );
}

import { SectionLabel } from "./SectionLabel";
import { BlueprintPlaceholder } from "./BlueprintPlaceholder";

const pillars = [
  {
    num: "i",
    title: "Why",
    sub: "Life Design Methodology",
    body: "Frameworks to think clearly about how you spend your finite days — before you fill them with tasks.",
    modules: false,
  },
  {
    num: "ii",
    title: "How",
    sub: "Daily Management Tools",
    body: "Five modules under one hood. One operating system for the whole life.",
    modules: true,
  },
  {
    num: "iii",
    title: "Balance",
    sub: "Holistic Tracking",
    body: "A continuous HUD that reflects where your attention actually goes, so balance is something you see, not guess.",
    modules: false,
  },
];

const modules = [
  { name: "Work", desc: "Deep work, projects, schedule.", color: "var(--module-work)", glyph: "◆" },
  { name: "Health", desc: "Wellness, performance, bio.", color: "var(--module-health)", glyph: "✦" },
  { name: "Wealth", desc: "Liquidity, transactions, goals.", color: "var(--module-wealth)", glyph: "❖" },
  { name: "Mind", desc: "Habits, mood, mindfulness.", color: "var(--module-mind)", glyph: "◯" },
  { name: "Community", desc: "Relationships, shared goals.", color: "var(--module-community)", glyph: "❀" },
];

export function Architecture() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col items-center text-center">
          <SectionLabel number="03" title="architecture" />
          <h2 className="mt-8 max-w-3xl text-balance text-3xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
            A personal operating system,
            <span className="italic text-muted-foreground"> drawn before it's built.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            {pillars.map((p) => (
              <div key={p.title} className="border-t border-border pt-8">
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {p.num}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-4">
                      <h3 className="text-2xl font-light text-foreground md:text-3xl">
                        {p.title}
                      </h3>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        — {p.sub}
                      </p>
                    </div>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>

                    {p.modules && (
                      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
                        {modules.map((m) => (
                          <li
                            key={m.name}
                            className="group relative overflow-hidden rounded-lg border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                            style={{ borderTopColor: m.color, borderTopWidth: "3px" }}
                          >
                            <div
                              className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-[0.06]"
                              style={{ backgroundColor: m.color }}
                            />
                            <div className="relative flex items-center gap-2">
                              <span
                                className="text-lg leading-none"
                                style={{ color: m.color }}
                                aria-hidden
                              >
                                {m.glyph}
                              </span>
                              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                                {m.name}
                              </span>
                            </div>
                            <div className="relative mt-2 text-sm leading-snug text-foreground">
                              {m.desc}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-12">
              <BlueprintPlaceholder />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
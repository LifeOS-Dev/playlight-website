import { SectionLabel } from "./SectionLabel";

export function Manifesto() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-24 text-center md:px-10 md:py-32">
        <SectionLabel number="02" title="manifesto" />
        <p className="mt-12 text-balance text-2xl font-light leading-snug text-foreground md:text-4xl">
          The market is full of robotic task managers that treat humans like machines.
          <span className="block mt-4 italic text-muted-foreground">
            We don't think life fits inside a checkbox.
          </span>
          <span className="mt-4 block">
            Playlight is a flexible canvas for living — not just working.
          </span>
        </p>
        {/* gentle wave divider */}
        <svg
          aria-hidden
          className="mt-16 h-6 w-40 text-accent/60"
          viewBox="0 0 160 24"
          fill="none"
        >
          <path
            d="M2 12 Q 20 2, 40 12 T 80 12 T 120 12 T 158 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
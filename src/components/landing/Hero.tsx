import { EmailCapture } from "./EmailCapture";
import { LogoMark } from "./Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* warm sun glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-10%] h-[80%]"
        style={{ background: "var(--sun-glow)" }}
      />
      {/* dotted grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse at 50% 35%, black 30%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-20 pb-28 text-center md:px-10 md:pt-28 md:pb-40">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border bg-background/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
          <LogoMark size={14} />
          cognitive infrastructure
        </div>

        <h1 className="max-w-4xl text-balance text-5xl font-light leading-[1.02] tracking-tight text-foreground md:text-7xl lg:text-[5.5rem]">
          Design your life.
          <br />
          <span className="italic text-muted-foreground">
            Don't just manage it.
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          A holistic system that blends life design with daily execution —
          built to make you feel <em className="not-italic text-foreground">lighter</em>, not busier.
        </p>

        <div className="mt-12 w-full max-w-lg">
          <EmailCapture id="hero-email" buttonLabel="Join the Blueprint" centered />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            early access · no spam · one quiet email
          </p>
        </div>

        {/* tagline strip */}
        <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.4em] text-muted-foreground/80">
          for you · and the game of life
        </p>
      </div>
    </section>
  );
}
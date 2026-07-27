import { SectionLabel } from "./SectionLabel";
import { EmailCapture } from "./EmailCapture";

export function FinalHook() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-40%] h-[80%]"
        style={{ background: "var(--sun-glow)" }}
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center md:px-10 md:py-32">
        <SectionLabel number="04" title="build in public" />
        <h2 className="mt-8 text-balance text-3xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
          Help shape the final product.
        </h2>
        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          We're building Playlight in public with our early adopters.
          Drop your email for weekly behind-the-scenes blueprints —
          and a quiet hand on the wheel.
        </p>
        <div className="mt-10 w-full max-w-lg">
          <EmailCapture id="footer-email" buttonLabel="Become a Builder" centered />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            weekly · one email · unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
}
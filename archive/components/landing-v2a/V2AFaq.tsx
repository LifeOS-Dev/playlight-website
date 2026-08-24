import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@tanstack/react-router";
import { V2A_FAQS } from "./coreFour";

export function V2AFaq() {
  return (
    <section className="relative mx-auto w-full max-w-2xl px-6 py-24 md:py-32">
      <h2 className="text-center font-display text-3xl font-light tracking-tight text-[#F2EEE9] md:text-4xl">
        FAQ
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center font-body text-sm text-[#C8C0B4]/80">
        Short answers. Copy can be refined later.
      </p>

      <Accordion type="single" collapsible className="mt-12">
        {V2A_FAQS.map((item) => (
          <AccordionItem
            key={item.q}
            value={item.q}
            className="border-white/10"
          >
            <AccordionTrigger className="font-body text-[15px] text-[#F2EEE9] hover:no-underline hover:text-[#FFA32B] data-[state=open]:text-[#FFA32B]">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="font-body text-sm leading-relaxed text-[#C8C0B4]">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function V2AFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <p className="font-display text-lg font-light text-[#F2EEE9]">
            play<span className="text-[#FFA32B]">light</span>
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#C8C0B4]/55">
            Light Technologies · 2026
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#C8C0B4]/70">
          <Link to="/" className="transition-colors hover:text-[#F2EEE9]">
            Home
          </Link>
          <Link to="/v2" className="transition-colors hover:text-[#F2EEE9]">
            Claude v2
          </Link>
          <Link to="/about" className="transition-colors hover:text-[#F2EEE9]">
            About
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-[#F2EEE9]">
            Privacy
          </Link>
          <Link to="/support" className="transition-colors hover:text-[#F2EEE9]">
            Support
          </Link>
        </nav>
      </div>

      <p className="mx-auto mt-10 max-w-lg text-center font-body text-sm text-[#C8C0B4]/60">
        Come into the light — not for more noise. For a calmer next step.
      </p>
    </footer>
  );
}

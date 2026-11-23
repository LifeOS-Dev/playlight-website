import { lightCue, lightLook } from "@/components/landing/orb/lightCue";
import { FAQS } from "./faces";

/**
 * Native details/summary - keyboard and screen-reader correct without a
 * component library, and it degrades to plain readable text with no JS.
 *
 * The answers are the light's, in the first person (faces.ts), and it sits
 * beside them: open one and its heart turns to the answer it is giving.
 */
export function Faq() {
  return (
    <section className="pl3-faq" aria-labelledby="pl3-faq-title">
      <div className="pl3-faq__inner">
        <h2 id="pl3-faq-title" className="pl3-faq__title">
          Before you ask
        </h2>

        <div className="pl3-faq__list">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="pl3-faq__item"
              onToggle={(e) => {
                const el = e.currentTarget;
                if (el.open) lightLook("faq", el);
                else if (lightCue.look === el) lightLook("faq", null);
              }}
            >
              <summary className="pl3-faq__q">
                <span>{item.q}</span>
                <span className="pl3-faq__mark" aria-hidden="true" />
              </summary>
              <div className="pl3-faq__a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

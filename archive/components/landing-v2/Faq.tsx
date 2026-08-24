import { FAQS } from "./faces";

/**
 * Native details/summary — keyboard and screen-reader correct without a
 * component library, and it degrades to plain readable text with no JS.
 */
export function Faq() {
  return (
    <section className="pl2-faq" aria-labelledby="pl2-faq-title">
      <div className="pl2-faq__inner">
        <h2 id="pl2-faq-title" className="pl2-faq__title">
          Before you ask
        </h2>

        <div className="pl2-faq__list">
          {FAQS.map((item) => (
            <details key={item.q} className="pl2-faq__item">
              <summary className="pl2-faq__q">
                <span>{item.q}</span>
                <span className="pl2-faq__mark" aria-hidden="true" />
              </summary>
              <div className="pl2-faq__a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

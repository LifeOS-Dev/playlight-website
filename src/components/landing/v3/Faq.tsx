import { FAQS } from "./faces";

/**
 * Native details/summary - keyboard and screen-reader correct without a
 * component library, and it degrades to plain readable text with no JS.
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
            <details key={item.q} className="pl3-faq__item">
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

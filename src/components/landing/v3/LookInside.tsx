import "./look.css";

/**
 * What it actually looks like - early captures from the app, framed in the
 * same warm night as the rest of the page. Accents are amber to match the light.
 */

const PANELS = [
  {
    id: "now",
    src: "/look/now.webp",
    fallback: "/look/now.png",
    alt: "Playlight home: one current focus, a play control, and the light on the floor.",
    title: "Open it for ten seconds",
    body: "One lit thing, and everything else kept quiet behind it. You leave with a next move, not a backlog.",
  },
  {
    id: "whole",
    src: "/look/whole.webp",
    fallback: "/look/whole.png",
    alt: "Playlight life surface: active arc and five pillars scored side by side.",
    title: "The whole life on one surface",
    body: "Work, health, money, people - held together, so a trade-off shows up before it turns into damage.",
  },
  {
    id: "trail",
    src: "/look/trail.webp",
    fallback: "/look/trail.png",
    alt: "Playlight Game Plan: goals, habits consistency, and systems at a glance.",
    title: "Your own evidence, on request",
    body: "What you did, what it cost, what it moved. Every insight can be asked why, and it answers with your history.",
  },
] as const;

export function LookInside() {
  return (
    <section className="pl3-look" aria-labelledby="pl3-look-title">
      <header className="pl3-look__head">
        <p className="pl3-look__eyebrow">A look inside</p>
        <h2 id="pl3-look-title" className="pl3-look__title">
          One surface, three ways in.
        </h2>
        <p className="pl3-look__note">
          Early captures from the app - still in build.
        </p>
      </header>

      <div className="pl3-look__row">
        {PANELS.map((panel) => (
          <figure key={panel.id} className="pl3-look__panel">
            <div className="pl3-look__frame">
              <picture>
                <source srcSet={panel.src} type="image/webp" />
                <img
                  className="pl3-look__shot"
                  src={panel.fallback}
                  alt={panel.alt}
                  width={390}
                  height={844}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <figcaption>
              <h3 className="pl3-look__caption">{panel.title}</h3>
              <p className="pl3-look__body">{panel.body}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

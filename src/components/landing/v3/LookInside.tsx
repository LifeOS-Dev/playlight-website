import "./look.css";

/**
 * What it actually looks like.
 *
 * The page argued for four things and never showed one of them. These are
 * drawings rather than screenshots — said plainly on the page, because a
 * mockup passed off as a product is the fastest way to lose someone — and
 * they are drawn in the same wireframe language as the road's motifs so the
 * section belongs to the same world. Swap each <Screen> for an <img> when
 * the real captures exist; the frames and copy stay as they are.
 */

const VB = "0 0 200 340";

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={VB} className="pl3-look__art" aria-hidden="true">
      {/* the light, always at the top of the screen */}
      <circle cx="100" cy="34" r="13" fill="url(#pl3-look-orb)" />
      <circle cx="100" cy="34" r="4.5" fill="currentColor" opacity="0.9" />
      {children}
    </svg>
  );
}

/** One clear now: a single lit card, the rest deliberately quieter. */
function NowScreen() {
  return (
    <Screen>
      <rect x="22" y="74" width="156" height="58" rx="6" {...line} strokeWidth={1.5} />
      <circle cx="42" cy="103" r="7" {...line} strokeWidth={1.5} />
      <path {...line} strokeWidth={1.5} d="M60 96h84M60 110h48" />

      <rect x="22" y="146" width="156" height="30" rx="5" {...line} opacity={0.3} />
      <path {...line} d="M38 161h60" opacity={0.3} />
      <rect x="22" y="186" width="156" height="30" rx="5" {...line} opacity={0.18} />
      <path {...line} d="M38 201h74" opacity={0.18} />

      <rect x="22" y="240" width="156" height="1" {...line} opacity={0.2} />
      <path {...line} d="M22 262h44M22 278h72" opacity={0.28} />
      <rect x="140" y="252" width="38" height="34" rx="5" {...line} opacity={0.3} />
    </Screen>
  );
}

/** Eight pillars on one surface, each carrying a different load. */
const PILLARS = [
  [0.82, 1],
  [0.46, 0.5],
  [0.68, 0.5],
  [0.24, 0.5],
  [0.9, 0.5],
  [0.55, 0.5],
  [0.36, 0.5],
  [0.7, 0.5],
];

function WholeScreen() {
  return (
    <Screen>
      {PILLARS.map(([fill, weight], n) => {
        const x = 22 + (n % 2) * 82;
        const y = 74 + Math.floor(n / 2) * 56;
        return (
          <g key={n} opacity={0.35 + weight * 0.55}>
            <rect x={x} y={y} width={74} height={44} rx={5} {...line} />
            <path {...line} d={`M${x + 12} ${y + 16}h30`} opacity={0.7} />
            <rect x={x + 12} y={y + 27} width={50} height={4} rx={2} {...line} opacity={0.4} />
            <rect
              x={x + 12}
              y={y + 27}
              width={50 * fill}
              height={4}
              rx={2}
              fill="currentColor"
              opacity={0.75}
            />
          </g>
        );
      })}
      {/* the one that is slipping, flagged before it costs anything */}
      <circle cx="92" cy="190" r="9" {...line} strokeWidth={1.4} fill="rgba(9,8,13,0.94)" />
      <path {...line} strokeWidth={1.4} d="M92 186v4" />
      <circle cx="92" cy="193.5" r="0.9" fill="currentColor" />
    </Screen>
  );
}

/** Your own evidence, and a why you can ask for. */
function TrailScreen() {
  return (
    <Screen>
      <path {...line} d="M28 82v150h148" opacity={0.28} />
      {[0, 1, 2].map((n) => (
        <path key={n} {...line} d={`M28 ${210 - n * 44}h148`} opacity={0.1} />
      ))}
      <path
        {...line}
        strokeWidth={1.6}
        d="M32 222C62 220 78 200 98 186s32-32 44-46 20-20 30-24"
      />
      {[
        [32, 222],
        [98, 186],
        [142, 140],
        [172, 116],
      ].map(([cx, cy], n) => (
        <circle key={n} cx={cx} cy={cy} r={n === 3 ? 4.5 : 3} fill="currentColor" />
      ))}

      <rect x="34" y="256" width="132" height="46" rx="6" {...line} strokeWidth={1.4} />
      <path {...line} strokeWidth={1.4} d="M48 272h72M48 286h44" opacity={0.85} />
      <path {...line} d="M150 268l6 6-6 6" opacity={0.6} />
    </Screen>
  );
}

const PANELS = [
  {
    id: "now",
    art: <NowScreen />,
    title: "Open it for ten seconds",
    body: "One lit thing, and everything else kept quiet behind it. You leave with a next move, not a backlog.",
  },
  {
    id: "whole",
    art: <WholeScreen />,
    title: "The whole life on one surface",
    body: "Work, health, money, people — held together, so a trade-off shows up before it turns into damage.",
  },
  {
    id: "trail",
    art: <TrailScreen />,
    title: "Your own evidence, on request",
    body: "What you did, what it cost, what it moved. Every insight can be asked why, and it answers with your history.",
  },
];

export function LookInside() {
  return (
    <section className="pl3-look" aria-labelledby="pl3-look-title">
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <radialGradient id="pl3-look-orb">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.85" />
            <stop offset="55%" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <header className="pl3-look__head">
        <p className="pl3-look__eyebrow">A look inside</p>
        <h2 id="pl3-look-title" className="pl3-look__title">
          One surface, three ways in.
        </h2>
        <p className="pl3-look__note">
          Drawings, not screenshots — Playlight is still in build.
        </p>
      </header>

      <div className="pl3-look__row">
        {PANELS.map((panel) => (
          <figure key={panel.id} className="pl3-look__panel">
            <div className="pl3-look__frame">{panel.art}</div>
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

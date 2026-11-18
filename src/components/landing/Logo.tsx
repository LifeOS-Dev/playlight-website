import { useId, type CSSProperties } from "react";

/**
 * The playlight wordmark, drawn rather than typeset.
 *
 * "light" is five monoline strokes with round ends, leaning 9 degrees.
 * The dot of the i is the orb: a white core, glowing in the player's
 * colour. "play" is drawn small in that same colour and sits on the orb's
 * centre line, so the dot and the word read together - a light that's on.
 *
 * Light is the same for everyone; play is each player's own. So the
 * letters take the page's white (--filament, which carries a trace of the
 * chosen light so it sits in the same air as the copy around it) and play
 * plus the glow take the chosen light itself (--ember). Outside a .pl3
 * page they fall back to pure white and the house amber. --logo-ink and
 * --logo-accent override either.
 *
 * Three forms, one drawing:
 * - "lockup": play nested beside the orb. 160px wide and up.
 * - "inline": play leading on one line, at half the x-height of light, so
 *   it still reads at nav-bar sizes.
 * - "compact": light and the orb alone. Below 160px, where play would be
 *   too small to read, the orb's colour carries it.
 *
 * The masters are public/brand/*.svg. Units: baseline 1000, x-height 540,
 * ascender 220, descender 1230; the skew is applied about the baseline.
 */

const LIGHT = [
  "M100 250V970", // l
  "M352 573V970", // i
  "M569 770A202 202 0 1 0 973 770A202 202 0 1 0 569 770", // g bowl
  "M973 573V1000A202 202 0 0 1 581.2 1069.1", // g stem and tail
  "M1225 250V970", // h stem
  "M1225 770A202 202 0 0 1 1629 770V970", // h arch
  "M1911 416V970", // t stem
  "M1801 576H2021", // t bar
];

/* play, nested: x-height 120, centred on the orb (y 360) */
const PLAY_NEST = [
  "M12 -108V48",
  "M12 -60A48 48 0 1 0 108 -60A48 48 0 1 0 12 -60",
  "M188 -192V-12",
  "M262 -60A48 48 0 1 0 358 -60A48 48 0 1 0 262 -60",
  "M358 -108V-12",
  "M426 -108L478.3 -12",
  "M530 -108L446 48",
];

/* play, inline: drawn at the same 120 x-height, scaled 1.9 onto light's baseline */
const PLAY_INLINE = [
  "M10.5 -109.5V49.5",
  "M10.5 -60A49.5 49.5 0 1 0 109.5 -60A49.5 49.5 0 1 0 10.5 -60",
  "M186.6 -193.5V-10.5",
  "M257.6 -60A49.5 49.5 0 1 0 356.6 -60A49.5 49.5 0 1 0 257.6 -60",
  "M356.6 -109.5V-10.5",
  "M421.7 -109.5L474 -10.5",
  "M525.7 -109.5L441.7 49.5",
];

const BOX = {
  lockup: "40 178 2108.2 1084",
  inline: "-1126.9 178 3275 1084",
  compact: "40 178 2108.2 1084",
} as const;

export type WordmarkVariant = keyof typeof BOX;

const INK = "var(--logo-ink, var(--filament, #ffffff))";
const ACCENT = "var(--logo-accent, var(--ember, #ffa32b))";

type WordmarkProps = {
  variant?: WordmarkVariant;
  className?: string;
  style?: CSSProperties;
  /** Accessible name. The drawing is one image; this is what it says. */
  label?: string;
};

export function Wordmark({
  variant = "lockup",
  className,
  style,
  label = "playlight",
}: WordmarkProps) {
  // One gradient per instance: the header, hero and footer can all be on
  // the page at once, and a shared id would let one restyle the others.
  const halo = `pl-halo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const stroke = (color: string, width: number) => ({
    fill: "none",
    strokeWidth: width,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { stroke: color },
  });

  return (
    <svg
      viewBox={BOX[variant]}
      className={className}
      style={style}
      role="img"
      aria-label={label}
      overflow="visible"
    >
      <defs>
        <radialGradient id={halo}>
          <stop offset="0" style={{ stopColor: ACCENT, stopOpacity: 0.7 }} />
          <stop offset="0.32" style={{ stopColor: ACCENT, stopOpacity: 0.3 }} />
          <stop offset="1" style={{ stopColor: ACCENT, stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <g transform="translate(0 1000) skewX(-9) translate(0 -1000)">
        <g {...stroke(INK, 72)}>
          {LIGHT.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <circle cx={352} cy={360} r={176.8} fill={`url(#${halo})`} />
        <circle cx={352} cy={360} r={52} fill="#ffffff" />
        {variant === "lockup" ? (
          <g transform="translate(488 420)" {...stroke(ACCENT, 24)}>
            {PLAY_NEST.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        ) : null}
        {variant === "inline" ? (
          <g transform="translate(-1084.8 1000) scale(1.9)" {...stroke(ACCENT, 21.1)}>
            {PLAY_INLINE.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        ) : null}
      </g>
    </svg>
  );
}

/**
 * The older chrome (SiteNav, SiteFooter) asks for a logo by height. Kept so
 * those still compile; both now draw the inline wordmark, or the compact
 * one when the word is not wanted.
 */
export function Logo({
  size = 28,
  showWordmark = true,
  className = "",
}: {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <Wordmark
      variant={showWordmark ? "inline" : "compact"}
      className={className}
      style={{ height: size, width: "auto", display: "block" }}
    />
  );
}

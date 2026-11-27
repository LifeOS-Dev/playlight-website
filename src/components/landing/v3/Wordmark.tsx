import * as React from "react";

/**
 * The playlight mark.
 *
 * "light" is set in a crisp 10-degree oblique geometric sans, with the
 * living orb replacing the i's dot and italic "PLAY" nestled in the
 * pocket between the l and h ascenders — matching the brand wordmark.
 *
 * "light" inherits currentColor (paper-white, or dimmed in the footer),
 * while PLAY and the halo around the orb's white core wear the visitor's
 * chosen light (--ember / --v-bright / --v-hot / --v-deep).
 */

type Size = "hero" | "nav" | "footer";

export function Wordmark({
  size = "nav",
  decorative = false,
}: {
  size?: Size;
  decorative?: boolean;
}) {
  const uid = React.useId().replace(/:/g, "");
  const haloId = `pl-mark-halo-${uid}`;
  const coreId = `pl-mark-core-${uid}`;

  return (
    <span className={`pl-mark pl-mark--${size}`}>
      <svg
        className="pl-mark__svg"
        viewBox="86 48 638 364"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : "Playlight"}
        aria-hidden={decorative ? true : undefined}
      >
        {decorative ? null : <title>Playlight</title>}
        <defs>
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "var(--v-hot, #fff588)", stopOpacity: 1 }} />
            <stop
              offset="28%"
              style={{ stopColor: "var(--ember-bright, #ffc95c)", stopOpacity: 0.95 }}
            />
            <stop offset="48%" style={{ stopColor: "var(--ember)", stopOpacity: 0.68 }} />
            <stop offset="72%" style={{ stopColor: "var(--v-deep, #d97a06)", stopOpacity: 0.26 }} />
            <stop offset="100%" style={{ stopColor: "var(--v-deep, #d97a06)", stopOpacity: 0 }} />
          </radialGradient>

          <radialGradient id={coreId} cx="42%" cy="38%" r="58%">
            <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
            <stop offset="62%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
            <stop offset="82%" style={{ stopColor: "var(--v-hot, #fff588)", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "var(--ember)", stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Wordmark glyphs: upright geometry slanted 10deg around the baseline */}
        <g transform="translate(0 326) skewX(-10) translate(0 -326)">
          <g className="pl-mark__light">
            {/* l */}
            <path d="M99 64H125V326H99Z" />
            {/* i stem (dot replaced by the orb below) */}
            <path d="M182 172H208V326H182Z" />
            {/* g */}
            <path
              fillRule="evenodd"
              d="M382 204C368 180 348 169 325 169C280 169 251.5 202 251.5 249C251.5 296 280 329 325 329C348 329 368 318 382 294V322C382 359 359 381 325 381C299 381 283 367 280.5 340H254.5C257 379 283 404 325 404C375 404 408 370 408 322V172H382V204ZM382 249C382 284 357 305 326 305C296 305 277.5 282 277.5 249C277.5 216 296 193 326 193C357 193 382 214 382 249Z"
            />
            {/* h */}
            <path d="M458 64H484V197C496 177 513 169 532 169C564 169 583 190 583 226V326H557.5V228C557.5 205 544 193 526 193C502 193 484 210 484 236V326H458V64Z" />
            {/* t */}
            <path d="M637 118H663V172H688V196H663V326H637V196H612V172H637V118Z" />
          </g>

          {/* PLAY — wears the visitor's chosen color */}
          <g className="pl-mark__play pl3-play">
            {/* P */}
            <path
              fillRule="evenodd"
              d="M256 78H273C281 78 285 83 285 91C285 99 281 104 273 104H262V122H256V78ZM262 84V98H272C277 98 279 95.5 279 91C279 86.5 277 84 272 84H262Z"
            />
            {/* L */}
            <path d="M300 78H306V116H324V122H300V78Z" />
            {/* A */}
            <path
              fillRule="evenodd"
              d="M350 78H358L374 122H367L362.5 110.5H345.5L341 122H334L350 78ZM347.5 104.5H360.5L354 85.5L347.5 104.5Z"
            />
            {/* Y */}
            <path d="M385 78H392L402 98L412 78H419L405 104V122H399V104L385 78Z" />
          </g>
        </g>

        {/* The orb replacing the i's dot — true circle at skewed i-stem axis */}
        <g className="pl-mark__orb">
          <circle className="pl-mark__halo" cx="234.6" cy="100" r="48" fill={`url(#${haloId})`} />
          <circle className="pl-mark__core" cx="234.6" cy="100" r="16" fill={`url(#${coreId})`} />
        </g>
      </svg>
    </span>
  );
}

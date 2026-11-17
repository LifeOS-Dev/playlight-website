/**
 * Light's body: one living surface, drawn by one shader.
 *
 * The web port of the app's src/components/orb/lightShader.ts. That one is
 * SkSL, compiled by Skia; this is the same program in GLSL ES, compiled by the
 * browser. The body of `main` below is a line-for-line transliteration - the
 * only differences are the ones the two languages force:
 *
 *   - `floatN` -> `vecN`, `halfN` -> `vecN`.
 *   - SkSL hands `main` the local coordinate; GL gives `gl_FragCoord`, whose
 *     origin is the BOTTOM left, so y is flipped back on entry. The picture is
 *     not vertically symmetric (the gaze, the lid, the tilted spark orbits),
 *     so leaving it flipped would quietly mirror the orb.
 *   - SkSL returns a colour; GL assigns `gl_FragColor`.
 *
 * Nothing else is re-tuned. If a number here stops matching the app's shader,
 * the two orbs stop being one orb - and lightProfile.ts, which is the angular
 * mean of THIS program, silently stops matching either.
 *
 * What it draws, from the outside in:
 *
 *   CORONA + AURA  the accent dissolving into the page. No rim anywhere: the
 *                  body is a gaussian, not a disc, because a defined edge is
 *                  exactly what made the old orb read as a ball with a border.
 *   EDGE           the silhouette's radius drifts with slow noise around the
 *                  circle, so it never settles into one. `uTense` rounds it
 *                  (focus, a hold); a livelier day loosens it.
 *   CURRENTS       two layers of domain-warped noise, the second pushed by the
 *                  first, moving at `uFlow`. Brighter filaments, never darker
 *                  patches: dark mottling turns a light into a planet.
 *   HEART          the white core. `uGaze` moves it inside the body and the
 *                  currents shift less than it does, which is what gives the
 *                  body depth. `uLid` closes over it top and bottom: a blink.
 *   SPARKS         one per finished task, on tilted orbits. Each passes in
 *                  front of the body and then behind it, where the body hides
 *                  it. Six at most; unrolled with a constant bound because a
 *                  runtime-bounded loop is the kind of thing one driver accepts
 *                  and another does not - and WebGL 1 forbids it outright.
 *   TOUCH          light pooling under the pointer, a ring leaving it on a
 *                  click, and arcs drawn inward while a hold fills.
 *
 * Coordinates are in body radii with the origin at the canvas centre. The body
 * radius is a fixed share of the canvas (`LIGHT_RADIUS / LIGHT_CANVAS`); size
 * and position are transforms on the element that holds the canvas, so the
 * shader never needs to know how big the orb is today.
 *
 * Output is premultiplied light over transparent: colour, with alpha equal to
 * its brightest channel. Over a dark page that composites as light being added
 * to it. It is NOT correct over a light page, which is why the light theme
 * keeps the vector body (see LightVectorBody).
 */

/** Canvas side, in CSS pixels. Wide enough for the corona and a stray spark. */
export const LIGHT_CANVAS = 420;
/** Body radius inside that canvas. Matches the old essence (168 / 2). */
export const LIGHT_RADIUS = 84;
/** The most sparks the body carries. */
export const LIGHT_MAX_SPARKS = 6;

/** Two triangles over the clip box. The fragment program does all the work. */
export const LIGHT_VERTEX_SRC = `
attribute vec2 aPos;
void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export function makeLightShader(): string {
  return `
precision highp float;

uniform vec2 uRes;
/** Seconds of current, already scaled by state. Wraps, see useLightCharacter. */
uniform float uFlow;
uniform vec2 uGaze;
uniform float uLid;
/** 0..1 how alive the day is: size is elsewhere, this is colour and looseness. */
uniform float uEnergy;
uniform float uCharge;
uniform float uBreath;
/** Pointer position in body radii, and how hard it is pressed. */
uniform vec2 uTouch;
uniform float uPress;
/** 0..1 age of the ring a click sends out. 1 means none. */
uniform float uRipple;
uniform float uHeat;
uniform float uCool;
uniform float uAlert;
uniform float uSwirl;
uniform float uTense;
uniform float uRays;
uniform float uSparks;
uniform float uScatter;
/** 0 draws the body white (no colour picked yet), 1 in the accent. */
uniform float uAccent;
uniform vec3 uBase;
uniform vec3 uBright;
uniform vec3 uHot;
uniform vec3 uDeep;

float sq(float x) { return x * x; }
float fall(float a, float b, float x) { return 1.0 - smoothstep(a, b, x); }

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
        v += a * vnoise(p);
        p = p * 2.03 + vec2(17.1, 9.2);
        a *= 0.5;
    }
    return v;
}

void main() {
    // GL's origin is the bottom left; the app's shader is handed a top-left
    // coordinate. Flip y so the gaze, the lid and the spark tilts match.
    vec2 xy = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);

    float R = uRes.x * ${(LIGHT_RADIUS / LIGHT_CANVAS).toFixed(4)};
    vec2 p = (xy - uRes * 0.5) / R;

    vec3 cBase = mix(vec3(0.93, 0.94, 0.97), uBase, uAccent);
    vec3 cBright = mix(vec3(0.97, 0.98, 1.0), uBright, uAccent);
    vec3 cHot = mix(vec3(1.0, 1.0, 1.0), uHot, uAccent);
    vec3 cDeep = mix(vec3(0.72, 0.75, 0.83), uDeep, uAccent);

    // A press dents the body toward the pointer.
    vec2 dv = p - uTouch;
    float dd = length(dv);
    p += normalize(dv + vec2(0.0001, 0.0001)) * uPress * 0.11 * exp(-dd * dd * 3.0);

    float r = length(p);
    float ang = atan(p.y, p.x);
    vec2 dir = p / max(r, 0.0001);

    // The silhouette: a radius that drifts around the circle.
    float lobes = fbm(dir * 1.15 + vec2(uFlow * 0.10, -uFlow * 0.07) + 3.1);
    float wob = mix(0.07, 0.16, uEnergy) * (1.0 - 0.75 * uTense);
    float rn = r / (1.0 + (lobes - 0.5) * 2.0 * wob);

    float lit = mix(0.62, 1.0, uEnergy);
    float aura = exp(-sq(max(rn - 0.30, 0.0) / 0.58));
    float corona = exp(-rn * 1.35);
    float bodyMask = exp(-sq(rn / 0.78));

    vec3 orbL = vec3(0.0);
    float wh = 0.0;

    if (rn < 1.7) {
        vec2 q = p * 1.25 - uGaze * 0.6;
        float sw = (uSwirl + uCharge * 2.2) * fall(0.0, 1.2, r) + uFlow * 0.03;
        float cs = cos(sw);
        float sn = sin(sw);
        q = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y);
        float f1 = fbm(q + vec2(uFlow * 0.13, -uFlow * 0.10));
        float f2 = fbm(q * 1.55 + vec2(5.2, 1.3) + (f1 - 0.5) * 2.2
                       + vec2(-uFlow * 0.19, uFlow * 0.15));
        float veins = smoothstep(0.42, 0.78, f2);
        vec3 body = mix(cBase, cBright, veins * 0.7);
        body = mix(body, cDeep, smoothstep(0.55, 1.15, rn) * 0.55);
        float z = sqrt(max(1.0 - min(rn * rn, 1.0), 0.0));
        orbL += body * bodyMask * (0.62 + 0.26 * f1 + 0.30 * veins * veins) * lit * (0.86 + 0.2 * z);
    }

    // The heart. The lid closes over it from above and below.
    vec2 hp = p - uGaze;
    hp.y /= max(1.0 - uLid, 0.07);
    hp.x /= (1.0 + uLid * 0.12);
    float hr = length(hp);
    float hR = 0.27 + 0.03 * uBreath + 0.10 * uCharge + 0.07 * uHeat;
    float lidDim = 1.0 - 0.58 * uLid;
    wh += exp(-sq(hr / hR)) * 1.25 * lidDim;
    orbL += cHot * exp(-sq(hr / (hR * 2.0))) * 0.5 * lidDim;

    // Light pooling under the pointer, and the ring a click sends across the body.
    float pool = exp(-sq(length(p - uTouch) / 0.42)) * uPress * fall(0.6, 1.6, rn);
    orbL += cHot * pool * 0.7;
    wh += pool * 0.3;
    float ripple = exp(-sq((length(p - uTouch) - uRipple * 1.9) / 0.075)) * (1.0 - uRipple);
    orbL += cBright * ripple * 0.6 * fall(0.5, 2.3, rn);

    // A hold: broken arcs of light travelling inward.
    float band = smoothstep(1.02, 1.3, r) * fall(1.7, 2.4, r);
    float cph = r * 2.4 + uFlow * 0.9;
    float ridge = pow(0.5 + 0.5 * cos(cph * 6.28318), 3.5);
    float broken = smoothstep(0.36, 0.62, vnoise(dir * 2.4 + floor(cph + 0.5) * vec2(7.3, 3.1)));
    orbL += cBase * ridge * broken * band * uCharge * 0.5;

    // Every protocol done: slow rays.
    float ray = pow(0.5 + 0.5 * sin(ang * 5.0 + uFlow * 0.22 + lobes * 4.0), 2.0)
              * exp(-max(rn - 0.8, 0.0) * 1.6) * smoothstep(0.7, 1.1, rn);
    orbL += cBright * ray * 0.13 * uRays;

    // Sparks, one per finished task.
    for (int i = 0; i < ${LIGHT_MAX_SPARKS}; i++) {
        float fi = float(i);
        float amt = clamp(uSparks - fi, 0.0, 1.0);
        float sa = uFlow * (0.30 + 0.09 * fi) + fi * 2.399;
        float orad = 1.24 + 0.11 * mod(fi * 1.7, 3.0) + uScatter * (0.35 + 0.12 * fi);
        float tilt = 0.34 + 0.12 * mod(fi, 3.0);
        float oa = fi * 1.1;
        vec2 o = vec2(cos(sa) * orad, sin(sa) * orad * tilt);
        o = vec2(cos(oa) * o.x - sin(oa) * o.y, sin(oa) * o.x + cos(oa) * o.y);
        float zz = sin(sa);
        float sz = 0.036 + 0.016 * zz;
        float dl = length(p - o);
        float occ = mix(1.0 - bodyMask * 0.92, 1.0, step(0.0, zz));
        float sk = (0.65 + 0.35 * zz) * occ * amt;
        orbL += (cHot * exp(-sq(dl / sz)) + cBase * exp(-sq(dl / (sz * 3.2))) * 0.3) * sk;
        wh += exp(-sq(dl / (sz * 0.7))) * 0.8 * sk;
    }

    orbL += mix(cBase, cBright, 0.25 * uHeat) * aura * 0.42 * lit * (1.0 + 0.35 * uHeat + 0.3 * uCharge);
    orbL += cBase * corona * 0.20 * lit * (1.0 + 0.6 * uHeat + 0.8 * uCharge);

    // A failure cools it; an overdue task reddens it.
    float grey = dot(orbL, vec3(0.3, 0.55, 0.15));
    orbL = mix(orbL, vec3(grey) * vec3(0.62, 0.66, 0.74), uCool);
    orbL = mix(orbL, orbL * vec3(1.2, 0.42, 0.38) + vec3(0.22, 0.01, 0.01) * bodyMask, uAlert * 0.7);
    wh *= (1.0 - 0.45 * uCool);

    // Compress brightness without shifting hue: scale by the brightest channel
    // rather than mapping each channel on its own, which drags amber to yellow.
    float lm = max(max(orbL.r, orbL.g), orbL.b);
    vec3 L = orbL * ((1.0 - exp(-lm * 1.35)) / max(lm, 0.0001));
    L = mix(L, vec3(1.0), 1.0 - exp(-wh * 1.7));

    // Fade to nothing before the canvas edge, so the canvas is never a square.
    L *= fall(2.0, 2.45, r);

    float alpha = clamp(max(max(L.r, L.g), L.b), 0.0, 1.0);
    gl_FragColor = vec4(L, alpha);
}
`;
}

export default makeLightShader;

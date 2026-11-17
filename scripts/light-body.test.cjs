// Run with: npm test   (node --test, Node 22+)
//
// The orb's body, checked without a browser.
//
// lightProfile.ts is not a drawing someone tuned by eye - it is the angular
// mean of lightShader.ts, written out as gradient stops. That makes the two
// files one thing in two forms, and nothing in the type system or the build
// notices when only one of them changes. The site would simply start showing
// a still body that is no longer the moving body it hands over to, and the
// cross-fade would become a visible jump.
//
// So: compile the real shader, render it, average it around the circle, and
// compare that to what the profile claims. The app does exactly this to its
// own copies (scripts/light-character.test.cjs in los_client) - the numbers,
// the palettes and the tolerances below are that test's, so the two repos are
// held to one standard.
//
// The shader here is GLSL, because it runs in WebGL; Skia compiles SkSL. The
// two differ only in the four mechanical ways lightShader.ts documents at the
// top, so `toSkSL` below undoes exactly those four and nothing else. That
// keeps the thing under test the REAL shader source: change a number in the
// GLSL and it changes in what Skia renders.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const ORB = "src/components/landing/orb";

/** Load a .ts module in CommonJS, transpiled in memory. */
const cache = new Map();
function loadTs(filename) {
  filename = path.resolve(root, filename);
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = new Module(filename, module);
  cache.set(filename, mod);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod);
  mod.require = (id) =>
    id.startsWith(".")
      ? loadTs(path.resolve(path.dirname(filename), id.replace(/\.js$/, "") + ".ts"))
      : original(id);
  mod._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    }).outputText,
    filename,
  );
  return mod.exports;
}

const shader = loadTs(`${ORB}/lightShader.ts`);
const profile = loadTs(`${ORB}/lightProfile.ts`);

/**
 * The GLSL program as SkSL, by undoing the four differences lightShader.ts
 * names - and only those. Anything else that stops this compiling is a real
 * divergence and should fail loudly rather than be patched here.
 */
function toSkSL(glsl) {
  const steps = [
    // 1. GL needs a declared precision; SkSL has none.
    [/^precision\s+highp\s+float;\s*$/m, ""],
    // 2. SkSL is given the local coordinate, top-left origin, so the entry
    //    point takes it and the y-flip GL needs is not wanted.
    [
      /void main\(\)\s*\{[\s\S]*?vec2 xy = vec2\(gl_FragCoord\.x, uRes\.y - gl_FragCoord\.y\);/,
      "half4 main(float2 xy) {",
    ],
    // 3. SkSL returns its colour.
    [/gl_FragColor = vec4\(L, alpha\);/, "return half4(half3(L), half(alpha));"],
  ];
  let out = glsl;
  for (const [pattern, replacement] of steps) {
    assert.match(out, pattern, `the GLSL no longer contains ${pattern} - see toSkSL`);
    out = out.replace(pattern, replacement);
  }
  // 4. vecN -> floatN, everywhere.
  return out.replace(/\bvec([234])\b/g, "float$1");
}

test("the shader and the profile agree on the numbers they share", () => {
  const glsl = shader.makeLightShader();
  // Each pair is a term that exists in both files. If one side is edited and
  // the other is not, this fails before the slow render test even starts, and
  // says which term moved.
  const shared = [
    ["aura falloff", /exp\(-sq\(max\(rn - 0\.30, 0\.0\) \/ 0\.58\)\)/, /Math\.max\(r - 0\.3, 0\) \/ 0\.58/],
    ["corona falloff", /exp\(-rn \* 1\.35\)/, /Math\.exp\(-r \* 1\.35\)/],
    ["body mask", /exp\(-sq\(rn \/ 0\.78\)\)/, /Math\.exp\(-sq\(r \/ 0\.78\)\)/],
    ["vitality floor", /mix\(0\.62, 1\.0, uEnergy\)/, /mix\(0\.62, 1, energy\)/],
    ["aura weight", /aura \* 0\.42 \* lit/, /aura \* 0\.42 \* lit/],
    ["corona weight", /corona \* 0\.20 \* lit/, /corona \* 0\.2 \* lit/],
    ["deep blend", /smoothstep\(0\.55, 1\.15, rn\) \* 0\.55/, /smoothstep\(0\.55, 1\.15, r\) \* 0\.55/],
    ["brightness compression", /1\.0 - exp\(-lm \* 1\.35\)/, /1 - Math\.exp\(-peak \* 1\.35\)/],
    ["edge fade", /fall\(2\.0, 2\.45, r\)/, /smoothstep\(2\.0, 2\.45, r\)/],
    ["heart coverage", /exp\(-sq\(hr \/ hR\)\) \* 1\.25/, /1\.7 \* 1\.25/],
  ];
  const source = fs.readFileSync(path.join(root, ORB, "lightProfile.ts"), "utf8");
  for (const [name, inShader, inProfile] of shared) {
    assert.match(glsl, inShader, `${name}: not found in lightShader.ts`);
    assert.match(source, inProfile, `${name}: not found in lightProfile.ts`);
  }
});

test("the profile's stops are a dissolve, with no edge anywhere", () => {
  const palette = {
    base: profile.hexToRgb("#FFA32B"),
    bright: profile.hexToRgb("#FFC95C"),
    hot: profile.hexToRgb("#FFF588"),
    deep: profile.hexToRgb("#D97A06"),
  };
  const body = profile.lightBodyStops(palette, 1);
  const heart = profile.lightHeartStops();

  for (const [name, stops] of [
    ["body", body],
    ["heart", heart],
  ]) {
    assert.equal(stops[0].offset, 0, `${name}: must start at the centre`);
    assert.equal(stops[stops.length - 1].offset, 1, `${name}: must reach the rim`);
    assert.equal(stops[stops.length - 1].opacity, 0, `${name}: must end at nothing, or it has an edge`);
    for (let i = 1; i < stops.length; i++) {
      assert(stops[i].offset > stops[i - 1].offset, `${name}: stop ${i} goes backwards`);
      assert(
        stops[i].opacity <= stops[i - 1].opacity + 1e-9,
        `${name}: stop ${i} brightens outward - the light must only fall away`,
      );
      assert(
        stops[i].opacity >= 0 && stops[i].opacity <= 1,
        `${name}: stop ${i} has an impossible opacity`,
      );
    }
  }
});

/** CanvasKit, loaded once. Null when it is not installed. */
let canvasKit;
function loadCanvasKit() {
  if (canvasKit !== undefined) return canvasKit;
  try {
    const dir = path.dirname(require.resolve("canvaskit-wasm/bin/full/canvaskit.js"));
    const init = require("canvaskit-wasm/bin/full/canvaskit.js");
    canvasKit = init({ locateFile: (file) => path.join(dir, file) });
  } catch {
    canvasKit = null;
  }
  return canvasKit;
}

function compile(ck) {
  let message = "";
  const effect = ck.RuntimeEffect.Make(toSkSL(shader.makeLightShader()), (error) => {
    message = error;
  });
  assert(effect, `the light shader failed to compile:\n${message}`);
  return effect;
}

test("the shader compiles, and declares exactly the uniforms the body sends", async (t) => {
  const pending = loadCanvasKit();
  if (!pending) {
    t.skip("canvaskit-wasm is not installed");
    return;
  }
  const effect = compile(await pending);

  const declared = [];
  for (let i = 0; i < effect.getUniformCount(); i++) declared.push(effect.getUniformName(i));

  // What LightBody actually sets, read out of its source: a uniform the
  // shader declares and nobody sets is dead, and one set but not declared is
  // a silent no-op that would never show up in the browser either.
  const body = fs.readFileSync(path.join(root, ORB, "LightBody.tsx"), "utf8");
  // `\s*` after the paren: a long enough call gets wrapped by the formatter,
  // and a uniform must not fall out of this check because of where a line
  // happened to break.
  const sent = new Set([...body.matchAll(/gl\.uniform[0-9][a-z]*\(\s*U\.(\w+)/g)].map((m) => m[1]));
  const mapped = new Set(
    [...body.matchAll(/(\w+):\s*loc\("(\w+)"\)/g)]
      .filter((m) => sent.has(m[1]))
      .map((m) => m[2]),
  );
  assert.deepEqual([...mapped].sort(), [...declared].sort());
});

test("the still body is the same picture as the shader at rest", async (t) => {
  const pending = loadCanvasKit();
  if (!pending) {
    t.skip("canvaskit-wasm is not installed");
    return;
  }
  const ck = await pending;
  const effect = compile(ck);

  const uniforms = [];
  for (let i = 0; i < effect.getUniformCount(); i++) {
    uniforms.push([effect.getUniformName(i), effect.getUniform(i)]);
  }
  const pack = (values) => {
    const out = new Float32Array(effect.getUniformFloatCount());
    for (const [name, info] of uniforms) {
      const value = Array.isArray(values[name]) ? values[name] : [values[name]];
      value.forEach((v, k) => {
        out[info.slot + k] = v;
      });
    }
    return out;
  };

  const size = shader.LIGHT_CANVAS;
  const step = 0.05;
  const bins = Math.round(2.45 / step);

  // The shader, averaged around the circle and over several moments of flow:
  // premultiplied colour and alpha per radius. Several moments because the
  // noise is what the profile's three MEAN_* constants stand in for, and one
  // instant of it is not its mean.
  const measure = (palette, energy) => {
    const sum = Array.from({ length: bins }, () => [0, 0, 0, 0, 0]);
    for (const flow of [3.1, 23.4, 77.2, 130.5]) {
      const surface = ck.MakeSurface(size, size);
      const canvas = surface.getCanvas();
      canvas.clear(ck.Color(0, 0, 0, 0));
      const paint = new ck.Paint();
      const made = effect.makeShader(
        pack({
          uRes: [size, size],
          uFlow: flow,
          uGaze: [0, 0],
          uLid: 0,
          uEnergy: energy,
          uCharge: 0,
          uBreath: 0.5,
          uTouch: [0, 0],
          uPress: 0,
          uRipple: 1,
          uHeat: 0,
          uCool: 0,
          uAlert: 0,
          uSwirl: 0,
          uTense: 0,
          uRays: 0,
          uSparks: 0,
          uScatter: 0,
          uAccent: 1,
          uBase: palette.base,
          uBright: palette.bright,
          uHot: palette.hot,
          uDeep: palette.deep,
        }),
      );
      paint.setShader(made);
      canvas.drawRect(ck.XYWHRect(0, 0, size, size), paint);
      const pixels = canvas.readPixels(0, 0, {
        width: size,
        height: size,
        colorType: ck.ColorType.RGBA_8888,
        alphaType: ck.AlphaType.Premul,
        colorSpace: ck.ColorSpace.SRGB,
      });
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const r = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) / shader.LIGHT_RADIUS;
          const bin = Math.round(r / step);
          if (bin >= bins) continue;
          const at = (y * size + x) * 4;
          for (let c = 0; c < 4; c++) sum[bin][c] += pixels[at + c] / 255;
          sum[bin][4] += 1;
        }
      }
      paint.delete();
      made.delete();
      surface.delete();
    }
    return sum.map((row) => row.slice(0, 4).map((v) => v / Math.max(1, row[4])));
  };

  // The still body: the body gradient with the white heart laid over it,
  // which is how the two layers composite on screen.
  const twin = (palette, energy, r) => {
    const body = profile.lightBodyAt(palette, energy, r);
    const heart = profile.lightHeartAt(r);
    return body.map((v) => v + (1 - v) * heart);
  };

  const palettes = {
    amber: ["#FFA32B", "#FFC95C", "#FFF588", "#D97A06"],
    azure: ["#4C8DFF", "#86B4FF", "#CFE2FF", "#2A5FD0"],
  };
  // The quiet state is the one that has to be exact: it is what a visitor
  // sees before the shader arrives, and what every reduced-motion visitor
  // sees for good. A fuller day is allowed a little more.
  //
  // These limits are TIGHTER than the app's (0.012 / 0.03), and deliberately.
  // The app's were set against Skia rendering its own SkSL; measured here,
  // with the GLSL translated back, the clean numbers came out at 0.0053 and
  // 0.0147 - so the app's limits left room for a real change to hide in. The
  // proof: moving the body's `0.86 + 0.2 * z` to `0.25 * z` took the quiet
  // case from 0.0053 to 0.0097, which the app's 0.012 would have let through
  // and these do not.
  //
  // If this ever fails by a hair on a different Skia or a different machine,
  // raise the number and say what you measured - do not delete the case.
  const cases = [
    ["amber", 0.25, 0.009],
    ["azure", 0.25, 0.009],
    ["amber", 1, 0.024],
  ];
  for (const [name, energy, tolerance] of cases) {
    const [base, bright, hot, deep] = palettes[name].map(profile.hexToRgb);
    const palette = { base, bright, hot, deep };
    const real = measure(palette, energy);
    let worst = 0;
    for (let bin = 0; bin < bins; bin++) {
      const drawn = twin(palette, energy, bin * step);
      for (let c = 0; c < 4; c++) worst = Math.max(worst, Math.abs(drawn[c] - real[bin][c]));
    }
    // Printed on a pass as well as a failure: the headroom is the whole
    // signal here. A case that normally sits at a third of its limit and
    // starts sitting at nine tenths of it has drifted, and knowing that
    // before it crosses the line is the point.
    t.diagnostic(
      `${name} at energy ${energy}: worst ${worst.toFixed(4)} of ${tolerance} ` +
        `(${((worst / tolerance) * 100).toFixed(0)}% of budget)`,
    );
    assert(
      worst <= tolerance,
      `${name} at energy ${energy}: the still body is off by ${worst.toFixed(4)} (limit ${tolerance}). ` +
        "lightProfile.ts mirrors lightShader.ts and one of them changed without the other.",
    );
  }
});

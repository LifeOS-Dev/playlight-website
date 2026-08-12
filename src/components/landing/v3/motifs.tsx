import type { MotifKey } from "./faces";

/**
 * Paired visuals for each face: the problem drawn cold in wireframe, the
 * answer drawn in light. These carry the argument - the copy only names it.
 * All coordinates are fixed (no randomness) so server and client agree.
 *
 * Drawn to read at a glance: few shapes, high contrast, no labels in the
 * picture. If you have to read the SVG, the motif has failed.
 */

const VB = "0 0 240 150";

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Plate({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden="true">
      {children}
    </svg>
  );
}

/* ── 1. Invisible life ────────────────────────────────────────
   A life with no shape, then a lifespan you can actually read. */

function TrajectoryProblem() {
  return (
    <Plate>
      {/* a bar that doesn't hold anything */}
      <path {...line} d="M18 118h204" opacity={0.22} />
      {/* motion without trajectory - busy, flat, nowhere */}
      <path
        {...line}
        d="M16 86 28 74 40 92 54 70 68 88 82 66 96 90 110 72 124 94 138 68 152 86 166 64 180 92 194 70 210 84 226 76"
        opacity={0.55}
      />
      {/* ticks that never landed on the bar */}
      {[36, 88, 142, 198].map((x) => (
        <circle key={x} cx={x} cy={48} r={3} {...line} opacity={0.35} />
      ))}
    </Plate>
  );
}

function TrajectorySolution() {
  return (
    <Plate>
      {/* the lifespan */}
      <path {...line} d="M20 118h200" opacity={0.3} />
      <path {...line} strokeWidth={3.2} d="M20 118h84" />
      {/* you are here */}
      <path {...line} strokeWidth={1.4} d="M104 108v20" />
      <circle cx="104" cy="118" r="5" fill="currentColor" />
      {/* an arc of a project, rising from now */}
      <path {...line} strokeWidth={1.6} d="M104 118C128 118 138 72 168 52s44-14 52-14" />
      {/* goals along the arc */}
      {[
        [140, 78],
        [168, 52],
        [220, 38],
      ].map(([cx, cy], n) => (
        <circle key={n} cx={cx} cy={cy} r={n === 2 ? 4.5 : 3} fill="currentColor" />
      ))}
      {/* quieter projects still on the bar */}
      <circle cx="48" cy="118" r="2.5" fill="currentColor" opacity={0.45} />
      <circle cx="76" cy="118" r="2.5" fill="currentColor" opacity={0.45} />
      <circle cx="156" cy="118" r="2.5" {...line} opacity={0.4} />
      <circle cx="196" cy="118" r="2.5" {...line} opacity={0.28} />
    </Plate>
  );
}

/* ── 2. Broken balance ──────────────────────────────────────── */

const COLLAPSED = [
  [26, 96],
  [66, 8],
  [106, 6],
  [146, 84],
  [186, 9],
];

function BalanceProblem() {
  return (
    <Plate>
      <path {...line} d="M12 128h216" opacity={0.35} />
      {COLLAPSED.map(([x, h], n) => (
        <rect key={n} x={x} y={128 - h} width={28} height={h} rx={2} {...line} opacity={0.6} />
      ))}
      <path {...line} d="M12 46h216" strokeDasharray="3 5" opacity={0.3} />
    </Plate>
  );
}

const BALANCED = [
  [26, 74],
  [66, 82],
  [106, 68],
  [146, 40],
  [186, 78],
];

function BalanceSolution() {
  return (
    <Plate>
      <path {...line} d="M12 128h216" opacity={0.35} />
      <path {...line} d="M12 54h216" strokeDasharray="3 5" opacity={0.45} />
      {BALANCED.map(([x, h], n) => (
        <rect
          key={n}
          x={x}
          y={128 - h}
          width={28}
          height={h}
          rx={2}
          {...line}
          strokeWidth={n === 3 ? 1.4 : 1}
          opacity={n === 3 ? 1 : 0.7}
        />
      ))}
      {/* early warning on the one that is slipping, before it breaks */}
      <circle cx="160" cy="108" r="15" {...line} strokeWidth={1.4} opacity={0.9} />
      <path {...line} strokeWidth={1.4} d="M160 102v7" />
      <circle cx="160" cy="113.5" r="1" fill="currentColor" />
    </Plate>
  );
}

/* ── 3. What matters now ──────────────────────────────────────
   Twenty things, none of them louder than the others. */

const FOG_TILES = [
  [14, 18, 46, 12, -7],
  [70, 10, 38, 12, 4],
  [118, 22, 52, 12, -3],
  [178, 14, 44, 12, 8],
  [8, 42, 40, 12, 5],
  [58, 38, 56, 12, -5],
  [124, 48, 34, 12, 9],
  [166, 40, 60, 12, -2],
  [20, 66, 58, 12, -6],
  [88, 70, 42, 12, 3],
  [140, 64, 48, 12, -8],
  [194, 72, 32, 12, 6],
  [10, 92, 50, 12, 7],
  [70, 96, 36, 12, -4],
  [116, 88, 62, 12, 2],
  [186, 94, 40, 12, -9],
  [30, 116, 44, 12, -3],
  [84, 120, 54, 12, 6],
  [148, 114, 38, 12, -6],
  [194, 118, 30, 12, 4],
];

function FogProblem() {
  return (
    <Plate>
      {FOG_TILES.map(([x, y, w, h, r], n) => (
        <rect
          key={n}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={2}
          {...line}
          opacity={0.55}
          transform={`rotate(${r} ${x + w / 2} ${y + h / 2})`}
        />
      ))}
    </Plate>
  );
}

function FogSolution() {
  return (
    <Plate>
      <rect x="20" y="30" width="200" height="42" rx="4" {...line} strokeWidth={1.4} />
      <circle cx="40" cy="51" r="6" {...line} strokeWidth={1.4} />
      <path {...line} strokeWidth={1.4} d="M56 45h108M56 58h64" opacity={0.85} />
      <rect x="20" y="84" width="200" height="20" rx="3" {...line} opacity={0.32} />
      <path {...line} d="M34 94h72" opacity={0.32} />
      <rect x="20" y="110" width="200" height="20" rx="3" {...line} opacity={0.18} />
      <path {...line} d="M34 120h94" opacity={0.18} />
    </Plate>
  );
}

/* ── 4. Scattered life ────────────────────────────────────────
   Same pieces. First they don't talk. Then they share a centre. */

const APPS: Array<[number, number, number]> = [
  [18, 22, -12],
  [158, 16, 8],
  [28, 88, 6],
  [170, 78, -9],
  [96, 48, 4],
];

function ScatterProblem() {
  return (
    <Plate>
      {APPS.map(([x, y, r], n) => (
        <g key={n} transform={`rotate(${r} ${x + 26} ${y + 18})`} opacity={0.55}>
          <rect x={x} y={y} width={52} height={36} rx={4} {...line} />
          <path {...line} d={`M${x + 10} ${y + 14}h24M${x + 10} ${y + 24}h14`} />
        </g>
      ))}
    </Plate>
  );
}

function ScatterSolution() {
  const nodes: Array<[number, number]> = [
    [120, 22],
    [196, 62],
    [168, 128],
    [72, 128],
    [44, 62],
  ];
  return (
    <Plate>
      {nodes.map(([x, y], n) => (
        <g key={n}>
          <path {...line} d={`M120 78L${x} ${y}`} opacity={0.28} />
          <circle cx={x} cy={y} r={11} {...line} strokeWidth={1.2} />
        </g>
      ))}
      <circle cx="120" cy="78" r="16" {...line} strokeWidth={1.5} />
      <circle cx="120" cy="78" r="5" fill="currentColor" />
    </Plate>
  );
}

/* ── 5. Heavy tools ───────────────────────────────────────────
   A wall of text, then one visual step with room to breathe. */

const WALL = [
  [16, 18, 208],
  [16, 32, 176],
  [16, 46, 198],
  [16, 60, 142],
  [16, 74, 188],
  [16, 88, 160],
  [16, 102, 204],
  [16, 116, 128],
  [16, 130, 172],
];

function LoadProblem() {
  return (
    <Plate>
      {WALL.map(([x, y, w], n) => (
        <path key={n} {...line} d={`M${x} ${y}h${w}`} opacity={0.42 + (n % 3) * 0.08} />
      ))}
    </Plate>
  );
}

function LoadSolution() {
  return (
    <Plate>
      <rect x="48" y="22" width="144" height="88" rx="8" {...line} strokeWidth={1.5} />
      <circle cx="120" cy="58" r="14" {...line} strokeWidth={1.5} />
      <path {...line} strokeWidth={1.4} d="M78 88h84" />
      <rect x="48" y="122" width="144" height="16" rx="4" {...line} opacity={0.28} />
    </Plate>
  );
}

/* ── 6. Walking alone ─────────────────────────────────────────
   One figure on an empty road, then two lights sharing it. */

function CompanionProblem() {
  const dashes = [128, 108, 90, 74, 60, 48];
  return (
    <Plate>
      <path {...line} d="M16 138h208" opacity={0.22} />
      <path {...line} d="M44 138 108 30" opacity={0.45} />
      <path {...line} d="M196 138 132 30" opacity={0.45} />
      <path {...line} d="M108 30h24" opacity={0.3} />
      {dashes.map((y, i) => (
        <path key={y} {...line} d={`M120 ${y}v-7`} opacity={0.18 + i * 0.03} />
      ))}
      <circle cx="120" cy="120" r="6.5" {...line} strokeWidth={1.4} />
    </Plate>
  );
}

function CompanionSolution() {
  const dashes = [128, 108, 90, 74, 60, 48];
  return (
    <Plate>
      <path {...line} d="M16 138h208" opacity={0.28} />
      <path {...line} d="M44 138 108 30" opacity={0.5} />
      <path {...line} d="M196 138 132 30" opacity={0.5} />
      <path {...line} d="M108 30h24" opacity={0.35} />
      {dashes.map((y) => (
        <path key={y} {...line} d={`M120 ${y}v-7`} opacity={0.22} />
      ))}
      <path {...line} strokeWidth={1.4} d="M104 114C112 100 124 84 138 70" opacity={0.7} />
      <circle cx="100" cy="118" r="7" {...line} strokeWidth={1.5} />
      <circle cx="140" cy="66" r="8" fill="currentColor" />
      <circle cx="140" cy="66" r="16" {...line} opacity={0.4} />
    </Plate>
  );
}

const PAIRS: Record<MotifKey, { problem: React.ReactNode; solution: React.ReactNode }> = {
  trajectory: { problem: <TrajectoryProblem />, solution: <TrajectorySolution /> },
  balance: { problem: <BalanceProblem />, solution: <BalanceSolution /> },
  fog: { problem: <FogProblem />, solution: <FogSolution /> },
  scatter: { problem: <ScatterProblem />, solution: <ScatterSolution /> },
  load: { problem: <LoadProblem />, solution: <LoadSolution /> },
  companion: { problem: <CompanionProblem />, solution: <CompanionSolution /> },
};

export function Motif({ kind, side }: { kind: MotifKey; side: "problem" | "solution" }) {
  return <>{PAIRS[kind][side]}</>;
}

import type { MotifKey } from "./faces";

/**
 * Paired visuals for each face: the problem drawn cold in wireframe, the
 * answer drawn in light. These carry the argument — the copy only names it.
 * All coordinates are fixed (no randomness) so server and client agree.
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

/* ── Problem side ─────────────────────────────────────────────
   Everything the same weight, because that is the problem.      */

// Fog of Now — twenty things, none of them louder than the others.
const FOG_TILES = [
  [14, 18, 46, 12, -7], [70, 10, 38, 12, 4], [118, 22, 52, 12, -3],
  [178, 14, 44, 12, 8], [8, 42, 40, 12, 5], [58, 38, 56, 12, -5],
  [124, 48, 34, 12, 9], [166, 40, 60, 12, -2], [20, 66, 58, 12, -6],
  [88, 70, 42, 12, 3], [140, 64, 48, 12, -8], [194, 72, 32, 12, 6],
  [10, 92, 50, 12, 7], [70, 96, 36, 12, -4], [116, 88, 62, 12, 2],
  [186, 94, 40, 12, -9], [30, 116, 44, 12, -3], [84, 120, 54, 12, 6],
  [148, 114, 38, 12, -6], [194, 118, 30, 12, 4],
];

/* ── Motif pairs ───────────────────────────────────────────── */

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
      {/* the one thing */}
      <rect x="20" y="30" width="200" height="42" rx="4" {...line} strokeWidth={1.4} />
      <circle cx="40" cy="51" r="6" {...line} strokeWidth={1.4} />
      <path {...line} strokeWidth={1.4} d="M56 45h108M56 58h64" opacity={0.85} />
      {/* the two after it, deliberately quieter */}
      <rect x="20" y="84" width="200" height="20" rx="3" {...line} opacity={0.32} />
      <path {...line} d="M34 94h72" opacity={0.32} />
      <rect x="20" y="110" width="200" height="20" rx="3" {...line} opacity={0.18} />
      <path {...line} d="M34 120h94" opacity={0.18} />
    </Plate>
  );
}

// Invisible Life — motion without shape.
const FLAT = "M12 78 20 74 28 82 36 72 44 80 52 75 60 83 68 71 76 79 84 74 92 82 100 73 108 81 116 76 124 84 132 72 140 80 148 75 156 83 164 74 172 79 180 77 188 82 196 73 204 80 212 76 220 79 228 78";

function TrajectoryProblem() {
  return (
    <Plate>
      <path {...line} d="M12 20v112h216" opacity={0.28} />
      <path {...line} d={FLAT} opacity={0.6} />
    </Plate>
  );
}

const RISE = "M20 118C56 116 74 100 96 88s34-24 58-38 44-20 66-24";

function TrajectorySolution() {
  return (
    <Plate>
      <path {...line} d="M20 20v110h200" opacity={0.28} />
      {[0, 1, 2, 3].map((n) => (
        <path key={n} {...line} d={`M20 ${112 - n * 28}h200`} opacity={0.1} />
      ))}
      <path {...line} strokeWidth={1.6} d={RISE} />
      {[
        [20, 118], [96, 88], [154, 50], [220, 26],
      ].map(([cx, cy], n) => (
        <circle key={n} cx={cx} cy={cy} r={n === 3 ? 4.5 : 3} fill="currentColor" />
      ))}
    </Plate>
  );
}

// Broken Balance — two pillars carrying everything, three on the floor.
const COLLAPSED = [
  [26, 96], [66, 8], [106, 6], [146, 84], [186, 9],
];

function BalanceProblem() {
  return (
    <Plate>
      <path {...line} d="M12 128h216" opacity={0.35} />
      {COLLAPSED.map(([x, h], n) => (
        <rect key={n} x={x} y={128 - h} width={28} height={h} rx={2} {...line} opacity={0.6} />
      ))}
      {/* the line they were all meant to hold */}
      <path {...line} d="M12 46h216" strokeDasharray="3 5" opacity={0.3} />
    </Plate>
  );
}

const BALANCED = [
  [26, 74], [66, 82], [106, 68], [146, 40], [186, 78],
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

// Forgotten Lessons — the same decision, three times, each fainter.
function MemoryProblem() {
  return (
    <Plate>
      {[0, 1, 2].map((n) => (
        <g key={n} opacity={0.65 - n * 0.18}>
          <rect x={18 + n * 74} y={44} width={58} height={40} rx={3} {...line} />
          <path {...line} d={`M${30 + n * 74} 58h34M${30 + n * 74} 70h20`} />
        </g>
      ))}
      {/* the loop back to the start */}
      <path
        {...line}
        d="M196 96c0 22-40 26-88 26s-88-6-88-26"
        strokeDasharray="3 5"
        opacity={0.4}
      />
      <path {...line} d="M20 96l-5 8M20 96l5 8" opacity={0.4} />
    </Plate>
  );
}

function MemorySolution() {
  return (
    <Plate>
      {/* what you did then, dim */}
      <rect x="18" y="88" width="70" height="40" rx="3" {...line} opacity={0.35} />
      <path {...line} d="M30 102h44M30 114h26" opacity={0.35} />
      {/* it comes back up, lit, at the moment you need it */}
      <rect x="132" y="20" width="90" height="52" rx="4" {...line} strokeWidth={1.4} />
      <path {...line} strokeWidth={1.4} d="M146 38h58M146 52h34" />
      <path
        {...line}
        strokeWidth={1.2}
        d="M88 104c30 0 20-46 44-52"
        strokeDasharray="2.5 4"
      />
      <path {...line} strokeWidth={1.2} d="M132 52l-8 1.5M132 52l-5.5 6" />
    </Plate>
  );
}

const PAIRS: Record<MotifKey, { problem: React.ReactNode; solution: React.ReactNode }> = {
  fog: { problem: <FogProblem />, solution: <FogSolution /> },
  trajectory: { problem: <TrajectoryProblem />, solution: <TrajectorySolution /> },
  balance: { problem: <BalanceProblem />, solution: <BalanceSolution /> },
  memory: { problem: <MemoryProblem />, solution: <MemorySolution /> },
};

export function Motif({ kind, side }: { kind: MotifKey; side: "problem" | "solution" }) {
  return <>{PAIRS[kind][side]}</>;
}

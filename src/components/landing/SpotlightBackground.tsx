import {
  Target,
  Repeat,
  HeartPulse,
  Coins,
  Users,
  TriangleAlert,
  Puzzle,
  BookOpen,
  Wrench,
  Clock,
  Hourglass,
  TrendingUp,
  Briefcase,
  NotebookPen,
  Fingerprint,
  Ghost,
} from "lucide-react";

// 16 concepts arranged on a clean 6-column × 4-row grid (architectural
// structure, like a blueprint). The center cells are intentionally left
// empty for the orb + headline + CTAs.
const COLS = 6;
const ROWS = 4;

// row, col positions (0-indexed). Center 2×2 block (rows 1-2, cols 2-3) is empty.
const icons = [
  { Icon: Target,        label: "goals",     row: 0, col: 0 },
  { Icon: Repeat,        label: "habits",    row: 0, col: 1 },
  { Icon: HeartPulse,    label: "health",    row: 0, col: 2 },
  { Icon: Coins,         label: "wealth",    row: 0, col: 3 },
  { Icon: Users,         label: "community", row: 0, col: 4 },
  { Icon: TriangleAlert, label: "failures",  row: 0, col: 5 },
  { Icon: Puzzle,        label: "problems",  row: 1, col: 0 },
  { Icon: BookOpen,      label: "learning",  row: 1, col: 1 },
  { Icon: Wrench,        label: "skills",    row: 1, col: 4 },
  { Icon: Clock,         label: "time",      row: 1, col: 5 },
  { Icon: Hourglass,     label: "age",       row: 2, col: 0 },
  { Icon: TrendingUp,    label: "life arc",  row: 2, col: 1 },
  { Icon: Briefcase,     label: "work",      row: 2, col: 4 },
  { Icon: NotebookPen,   label: "notes",     row: 2, col: 5 },
  { Icon: Fingerprint,   label: "identity",  row: 3, col: 2 },
  { Icon: Ghost,         label: "fears",     row: 3, col: 3 },
];

/**
 * A wall of life-icons, faintly etched into the background.
 * A narrow, slightly angled warm light sweeps strictly left → right on a loop
 * (CC Light Sweep style), revealing each icon as it passes underneath.
 */
export function SpotlightBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* subtle grid lines — architectural structure of the wall */}
      <GridLines />

      {/* periodic surge — all icons briefly light up in sync with the orb */}
      <div className="absolute inset-0 animate-icons-surge">
        <IconLayer colored />
      </div>

      {/* revealed layer — same icons, brighter, masked by a narrow band */}
      <div
        className="absolute inset-0 animate-spotlight-sweep"
        style={{
          WebkitMaskImage:
            "linear-gradient(100deg, transparent 40%, black 48%, black 52%, transparent 60%)",
          maskImage:
            "linear-gradient(100deg, transparent 40%, black 48%, black 52%, transparent 60%)",
          WebkitMaskSize: "300% 100%",
          maskSize: "300% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        <IconLayer colored />
      </div>

      {/* the warm light itself — same mask so it traces the band */}
      <div
        className="absolute inset-0 animate-spotlight-sweep"
        style={{
          background:
            "linear-gradient(100deg, transparent 42%, oklch(0.92 0.1 75 / 0.22) 50%, transparent 58%)",
          WebkitMaskImage:
            "linear-gradient(100deg, transparent 40%, black 50%, transparent 60%)",
          maskImage:
            "linear-gradient(100deg, transparent 40%, black 50%, transparent 60%)",
          WebkitMaskSize: "300% 100%",
          maskSize: "300% 100%",
        }}
      />
    </div>
  );
}

function IconLayer({ colored = false }: { colored?: boolean }) {
  return (
    <div
      className="absolute inset-0 grid p-[6%]"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {icons.map(({ Icon, label, row, col }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center gap-1.5"
          style={{
            gridColumn: col + 1,
            gridRow: row + 1,
            color: colored ? "var(--accent)" : "var(--foreground)",
          }}
        >
          <Icon className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1.25} />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function GridLines() {
  const cols = Array.from({ length: COLS - 1 }, (_, i) => ((i + 1) / COLS) * 100);
  const rows = Array.from({ length: ROWS - 1 }, (_, i) => ((i + 1) / ROWS) * 100);
  return (
    <div className="absolute inset-[6%] opacity-[0.06]">
      {cols.map((left) => (
        <div
          key={`c-${left}`}
          className="absolute top-0 bottom-0 w-px bg-foreground"
          style={{ left: `${left}%` }}
        />
      ))}
      {rows.map((top) => (
        <div
          key={`r-${top}`}
          className="absolute left-0 right-0 h-px bg-foreground"
          style={{ top: `${top}%` }}
        />
      ))}
    </div>
  );
}
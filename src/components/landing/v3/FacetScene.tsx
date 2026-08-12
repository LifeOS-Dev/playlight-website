import type { FacetId } from "./faces";
import "./facet-scene.css";

/**
 * Mini animated scenes inside each journey card.
 * Instrument diagrams that move - not icon stickers.
 */
export function FacetScene({ id, active }: { id: FacetId; active: boolean }) {
  return (
    <div className="pl3-scene" data-id={id} data-active={active || undefined} aria-hidden>
      {id === "wealth" && <WealthScene />}
      {id === "health" && <HealthScene />}
      {id === "work" && <WorkScene />}
      {id === "people" && <PeopleScene />}
      {id === "habits" && <HabitsScene />}
      {id === "mind" && <MindScene />}
      {id === "time" && <TimeScene />}
      {id === "notes" && <NotesScene />}
    </div>
  );
}

function WealthScene() {
  const bars = [0.35, 0.55, 0.42, 0.78, 0.62, 0.9];
  return (
    <svg viewBox="0 0 160 88" className="pl3-scene__svg">
      <defs>
        <linearGradient id="pl3-wealth-fill" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path
        className="pl3-scene__axis"
        d="M12 76h136"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      {bars.map((h, i) => (
        <rect
          key={i}
          className={`pl3-scene__bar${i === bars.length - 1 ? " pl3-scene__bar--peak" : ""}`}
          x={20 + i * 22}
          y={76 - h * 58}
          width="12"
          height={h * 58}
          rx="2"
          style={{ ["--bar-i" as string]: i }}
        />
      ))}
      <path
        className="pl3-scene__wealth-area"
        d="M26 58 C48 52, 70 62, 92 40 S130 28, 148 18 V76 H26 Z"
        fill="url(#pl3-wealth-fill)"
      />
      <path
        className="pl3-scene__trend"
        d="M26 58 C48 52, 70 62, 92 40 S130 28, 148 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle className="pl3-scene__dot" cx="148" cy="18" r="3.5" />
      <text className="pl3-scene__caption" x="148" y="12" textAnchor="end">
        ↑
      </text>
    </svg>
  );
}

function HealthScene() {
  return (
    <svg viewBox="0 0 160 88" className="pl3-scene__svg">
      <path
        className="pl3-scene__pulse"
        d="M8 48 H36 L46 28 L58 64 L70 20 L82 56 L94 44 H152"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="pl3-scene__dot pl3-scene__dot--pulse" cx="70" cy="20" r="3" />
    </svg>
  );
}

function WorkScene() {
  return (
    <svg viewBox="0 0 160 88" className="pl3-scene__svg">
      <rect
        className="pl3-scene__block pl3-scene__block--a"
        x="18"
        y="22"
        width="70"
        height="22"
        rx="3"
      />
      <rect
        className="pl3-scene__block pl3-scene__block--b"
        x="48"
        y="48"
        width="90"
        height="22"
        rx="3"
      />
      <path className="pl3-scene__link" d="M53 44v4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function PeopleScene() {
  return (
    <svg viewBox="0 0 160 88" className="pl3-scene__svg">
      <path
        className="pl3-scene__link"
        d="M48 44 L80 32 L112 44 L80 58 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle className="pl3-scene__node" cx="48" cy="44" r="8" />
      <circle className="pl3-scene__node pl3-scene__node--b" cx="112" cy="44" r="8" />
      <circle className="pl3-scene__node pl3-scene__node--c" cx="80" cy="32" r="6.5" />
      <circle className="pl3-scene__node pl3-scene__node--d" cx="80" cy="58" r="6.5" />
    </svg>
  );
}

function HabitsScene() {
  return (
    <svg viewBox="0 0 160 88" className="pl3-scene__svg">
      <circle
        className="pl3-scene__ring-track"
        cx="80"
        cy="44"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.2"
      />
      <circle
        className="pl3-scene__ring"
        cx="80"
        cy="44"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="176"
        transform="rotate(-90 80 44)"
      />
      <circle className="pl3-scene__dot" cx="80" cy="16" r="3.5" />
    </svg>
  );
}

function MindScene() {
  return (
    <svg viewBox="0 0 160 88" className="pl3-scene__svg">
      <circle className="pl3-scene__dot" cx="80" cy="44" r="4" />
      <path
        className="pl3-scene__arc pl3-scene__arc--a"
        d="M80 44 A22 22 0 0 1 102 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        className="pl3-scene__arc pl3-scene__arc--b"
        d="M80 44 A34 34 0 0 0 46 72"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.7"
      />
      <path
        className="pl3-scene__arc pl3-scene__arc--c"
        d="M80 44 A28 28 0 0 1 52 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />
    </svg>
  );
}

function TimeScene() {
  return (
    <svg viewBox="0 0 160 88" className="pl3-scene__svg">
      <circle
        cx="80"
        cy="44"
        r="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        className="pl3-scene__wedge"
        d="M80 44 L80 14 A30 30 0 0 1 106 58 Z"
        fill="currentColor"
      />
      <circle className="pl3-scene__dot" cx="80" cy="44" r="3" />
    </svg>
  );
}

function NotesScene() {
  return (
    <svg viewBox="0 0 160 88" className="pl3-scene__svg">
      <path className="pl3-scene__line pl3-scene__line--a" d="M28 28h104" />
      <path className="pl3-scene__line pl3-scene__line--b" d="M28 44h72" />
      <path className="pl3-scene__line pl3-scene__line--c" d="M28 60h92" />
    </svg>
  );
}

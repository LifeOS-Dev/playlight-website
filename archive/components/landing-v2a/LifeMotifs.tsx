/**
 * Quiet life motifs flanking the orb — health, work, wealth, people, mind, time.
 * Asymmetric composition, not orbital rings.
 */
export function LifeMotifs({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    >
      <svg
        className="v2a-motif-drift absolute left-[4%] top-[22%] hidden h-[52%] w-[22%] max-w-[220px] opacity-70 md:block lg:left-[8%]"
        viewBox="0 0 160 320"
        fill="none"
      >
        <g className="v2a-motif-a" opacity="0.75">
          <path
            d="M12 78 C28 78, 34 48, 48 48 C62 48, 66 92, 80 92 C94 92, 100 62, 118 62"
            stroke="rgba(140,190,160,0.7)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="48" cy="48" r="2.2" fill="rgba(140,190,160,0.85)" />
        </g>

        <g className="v2a-motif-b" opacity="0.55">
          <path
            d="M30 150 A34 34 0 0 1 98 150"
            stroke="rgba(180,160,210,0.55)"
            strokeWidth="1.1"
          />
          <path
            d="M42 150 A22 22 0 0 1 86 150"
            stroke="rgba(180,160,210,0.4)"
            strokeWidth="1"
          />
          <circle cx="64" cy="138" r="3" fill="rgba(255,163,43,0.45)" />
        </g>

        <g className="v2a-motif-c" opacity="0.6">
          <path
            d="M24 250 L24 230 L48 230 L48 210 L72 210 L72 188 L96 188 L96 168"
            stroke="rgba(220,180,90,0.55)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="96" cy="168" r="2.4" fill="rgba(220,180,90,0.8)" />
        </g>
      </svg>

      <svg
        className="v2a-motif-drift-rev absolute right-[4%] top-[24%] hidden h-[52%] w-[22%] max-w-[220px] opacity-70 md:block lg:right-[8%]"
        viewBox="0 0 160 320"
        fill="none"
      >
        <g className="v2a-motif-b" opacity="0.65">
          <path
            d="M80 42 L108 70 L80 98 L52 70 Z"
            stroke="rgba(130,160,210,0.65)"
            strokeWidth="1.2"
          />
          <circle cx="80" cy="70" r="3.5" fill="rgba(255,163,43,0.5)" />
        </g>

        <g className="v2a-motif-a" opacity="0.6">
          <circle cx="48" cy="160" r="5" stroke="rgba(210,140,140,0.65)" strokeWidth="1.1" />
          <circle cx="112" cy="148" r="4" stroke="rgba(210,140,140,0.55)" strokeWidth="1.1" />
          <circle cx="90" cy="198" r="4.5" stroke="rgba(210,140,140,0.55)" strokeWidth="1.1" />
          <path
            d="M52 164 L86 192 M52 158 L108 150 M108 152 L94 194"
            stroke="rgba(210,140,140,0.35)"
            strokeWidth="0.9"
          />
        </g>

        <g className="v2a-motif-c" opacity="0.55">
          <circle
            cx="80"
            cy="260"
            r="28"
            stroke="rgba(200,192,180,0.35)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <path
            d="M80 260 L80 242 M80 260 L96 268"
            stroke="rgba(255,163,43,0.55)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div className="absolute inset-x-0 top-[36%] flex justify-between px-3 md:hidden">
        <span className="h-8 w-8 rounded-full border border-white/10 opacity-40" />
        <span className="h-8 w-8 rounded-full border border-white/10 opacity-40" />
      </div>
    </div>
  );
}

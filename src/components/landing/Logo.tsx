interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 28, showWordmark = true, className = "" }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showWordmark && (
        <span className="font-mono text-base tracking-tight text-foreground">
          play<span className="text-accent">light</span>
        </span>
      )}
    </div>
  );
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Playlight"
      className="text-foreground"
    >
      {/* rays */}
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
        <line x1="16" y1="2" x2="16" y2="5.5" />
        <line x1="16" y1="26.5" x2="16" y2="30" />
        <line x1="2" y1="16" x2="5.5" y2="16" />
        <line x1="26.5" y1="16" x2="30" y2="16" />
        <line x1="6" y1="6" x2="8.5" y2="8.5" />
        <line x1="23.5" y1="23.5" x2="26" y2="26" />
        <line x1="26" y1="6" x2="23.5" y2="8.5" />
        <line x1="6" y1="26" x2="8.5" y2="23.5" />
      </g>
      {/* sun core */}
      <circle cx="16" cy="16" r="6.5" fill="var(--accent)" />
      <circle cx="16" cy="16" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
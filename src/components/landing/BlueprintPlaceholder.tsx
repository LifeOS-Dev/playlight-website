const moduleColors = [
  { label: "work", color: "var(--module-work)", w: 80 },
  { label: "health", color: "var(--module-health)", w: 60 },
  { label: "wealth", color: "var(--module-wealth)", w: 45 },
  { label: "mind", color: "var(--module-mind)", w: 70 },
  { label: "comm.", color: "var(--module-community)", w: 30 },
];

const lineRows = [
  { w: "20%", l: "deep work", color: "var(--module-work)" },
  { w: "40%", l: "meeting", color: "var(--module-work)" },
  { w: "70%", l: "training", color: "var(--module-health)" },
  { w: "55%", l: "writing", color: "var(--module-mind)" },
];

export function BlueprintPlaceholder() {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-background p-6 shadow-sm">
      <CornerTicks />
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <span>fig · 01 — the line</span>
        <span>v0.0.1</span>
      </div>

      <div className="mt-6 grid grid-cols-5 gap-2">
        {moduleColors.map((m) => (
          <div key={m.label} className="rounded border border-border/80 bg-background p-2">
            <div className="h-1 w-full rounded-full bg-border" />
            <div
              className="mt-1 h-1 rounded-full"
              style={{ width: `${m.w}%`, backgroundColor: m.color }}
            />
            <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded border border-border/80 bg-secondary/30 p-4">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>the line · today</span>
          <span>14:32</span>
        </div>
        <div className="mt-4 space-y-2">
          {lineRows.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-16 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                {row.l}
              </span>
              <div className="relative h-2 flex-1 rounded-full bg-background">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: row.w, backgroundColor: row.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-6 h-20 w-full opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        — placeholder · real ui coming soon —
      </p>
    </div>
  );
}

function CornerTicks() {
  const tick = "absolute h-3 w-3 border-foreground/60";
  return (
    <>
      <span className={`${tick} top-0 left-0 border-t border-l`} />
      <span className={`${tick} top-0 right-0 border-t border-r`} />
      <span className={`${tick} bottom-0 left-0 border-b border-l`} />
      <span className={`${tick} bottom-0 right-0 border-b border-r`} />
    </>
  );
}
export function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      <span>{number}</span>
      <span className="h-px w-8 bg-border" />
      <span>{title}</span>
    </div>
  );
}
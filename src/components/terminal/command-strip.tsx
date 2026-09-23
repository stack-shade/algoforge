import { Terminal } from "lucide-react";

export function CommandStrip({
  command,
  hint = "press / to search",
}: {
  command: string;
  hint?: string;
}) {
  return (
    <div className="command-strip flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border/80 bg-card/80 px-4 py-3 shadow-sm backdrop-blur">
      <Terminal className="h-4 w-4 text-primary" />
      <span className="font-mono text-xs text-muted-foreground">$</span>
      <code className="font-mono text-sm font-medium text-foreground">{command}</code>
      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {hint}
      </span>
    </div>
  );
}

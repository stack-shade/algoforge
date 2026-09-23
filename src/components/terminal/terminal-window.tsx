import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TerminalWindow({
  title = "algoforge — zsh",
  children,
  className,
  status = "ready",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  status?: string;
}) {
  return (
    <div
      className={cn(
        "terminal-window overflow-hidden rounded-2xl border border-border/80 bg-[color-mix(in_oklab,var(--code-bg)_94%,black)] text-slate-100 shadow-2xl",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="terminal-dot bg-red-400/80" />
          <span className="terminal-dot bg-amber-300/80" />
          <span className="terminal-dot bg-emerald-400/80" />
          <span className="ml-2 hidden text-[11px] font-medium tracking-wide text-slate-400 sm:inline">
            {title}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">
          {status}
        </span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Braces, Command, Search } from "lucide-react";
import { TerminalWindow } from "@/components/terminal/terminal-window";
import { CommandStrip } from "@/components/terminal/command-strip";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

export function TerminalHero({
  problemCount,
  patternCount,
  topicCount,
  languageCount,
}: {
  problemCount: number;
  patternCount: number;
  topicCount: number;
  languageCount: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/80">
      <div className="terminal-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,var(--terminal-glow),transparent_62%)]" />

      <div className="container relative py-10 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 terminal-pulse" />
                local-first learning
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                no account required
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl text-balance font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-7xl">
              Your coding interview
              <span className="text-primary"> command center.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {siteConfig.description} Learn in patterns, follow roadmaps, search fast, and keep your practice loop tight.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/roadmaps/dsa-fundamentals">
                  Start with a roadmap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Open search
                  <kbd className="ml-2 hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                    /
                  </kbd>
                </Link>
              </Button>
            </div>

            <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["problems", problemCount],
                ["patterns", patternCount],
                ["topics", topicCount],
                ["languages", languageCount],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-card/80 p-4 backdrop-blur">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <TerminalWindow title="algoforge — interview.sh" status="online">
              <div className="space-y-5 p-5 sm:p-6">
                <div className="space-y-2 font-mono text-sm">
                  <p className="text-slate-500">~/algoforge</p>
                  <p className="text-slate-200">
                    <span className="text-emerald-400">$</span> forge status
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-xs leading-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">mode</span>
                    <span className="text-emerald-300">pattern-first</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">focus</span>
                    <span className="text-slate-100">interview prep</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">search</span>
                    <span className="text-sky-300">instant</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">progress</span>
                    <span className="text-amber-300">local storage</span>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/practice"
                    className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-emerald-300/30 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-emerald-300">forge run</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-100">Open practice loop</p>
                  </Link>
                  <Link
                    href="/patterns"
                    className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-sky-300/30 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-sky-300">forge learn</span>
                      <Braces className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-100">Study reusable patterns</p>
                  </Link>
                </div>

                <CommandStrip command="search --global "two pointers"" hint="cmd+k / /" />

                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <Command className="h-3.5 w-3.5" />
                  <span>Tip: treat each problem as a pattern-recognition exercise.</span>
                </div>
              </div>
            </TerminalWindow>
          </div>
        </div>
      </div>
    </section>
  );
}

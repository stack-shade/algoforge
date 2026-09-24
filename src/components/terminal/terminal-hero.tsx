import Link from "next/link";
import { ArrowRight, Braces, Compass, Search, Sparkles, Target } from "lucide-react";
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
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[color-mix(in_oklab,var(--cute-purple)_18%,transparent)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[color-mix(in_oklab,var(--cute-pink)_16%,transparent)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_7%,transparent)_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="container relative py-10 sm:py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                pattern-first study lab
              </span>
              <span className="rounded-full border border-border bg-card/70 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                free · local progress
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl text-balance font-heading text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Stop grinding random problems.
              <span className="block bg-gradient-to-r from-primary via-[var(--cute-purple)] to-[var(--cute-pink)] bg-clip-text text-transparent">
                Start recognizing patterns.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {siteConfig.description} Follow a route, spot the technique, solve a focused set, and come back for review.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/roadmaps/dsa-fundamentals">
                  <Compass className="mr-2 h-4 w-4" />
                  Start a roadmap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/problems">
                  <Target className="mr-2 h-4 w-4" />
                  Pick a problem
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                ["Fast search", Search],
                ["Pattern learning", Braces],
                ["Progress stays local", Sparkles],
              ].map(([label, Icon]) => {
                const FeatureIcon = Icon as typeof Search;
                return (
                  <span key={label as string} className="cute-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <FeatureIcon className="h-3.5 w-3.5 text-primary" />
                    {label as string}
                  </span>
                );
              })}
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["problems", problemCount],
                ["patterns", patternCount],
                ["topics", topicCount],
                ["languages", languageCount],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className="cute-card rounded-2xl border border-border bg-card/75 p-4 backdrop-blur"
                  style={{ transform: index % 2 === 0 ? "rotate(-0.4deg)" : "rotate(0.4deg)" }}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-black tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-3 top-10 z-10 hidden rotate-[-6deg] rounded-2xl border border-border bg-card px-3 py-2 text-[9px] font-mono font-bold uppercase tracking-[0.12em] text-muted-foreground shadow-lg sm:block">
              <span className="text-primary">♥</span> tiny wins count
            </div>

            <div className="absolute -right-2 bottom-8 z-10 hidden rotate-[5deg] rounded-2xl border border-border bg-card px-3 py-2 text-[9px] font-mono font-bold uppercase tracking-[0.12em] text-muted-foreground shadow-lg sm:block">
              <span className="text-[var(--cute-pink)]">✦</span> solve with intent
            </div>

            <div className="cute-card relative overflow-hidden rounded-[2rem] border border-border bg-card/80 p-4 backdrop-blur-xl sm:p-5">
              <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">today's study card</p>
                    <p className="mt-1 text-lg font-black tracking-tight">Sliding Window</p>
                  </div>
                  <span className="rounded-full bg-primary/12 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                    pattern
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
                    <Braces className="h-3.5 w-3.5" />
                    recognize the signal
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6">
                    “Contiguous range + moving constraint + linear scan”
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Ask: can I expand and shrink one window instead of recomputing every range?
                  </p>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {[
                    ["01", "Spot", "contiguous"],
                    ["02", "Solve", "two pointers"],
                    ["03", "Review", "O(n)"],
                  ].map(([n, title, body]) => (
                    <div key={n} className="rounded-2xl border border-border bg-card p-3">
                      <div className="font-mono text-[8px] text-muted-foreground">{n}</div>
                      <div className="mt-1 text-xs font-black">{title}</div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">{body}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-background/60 px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/12 text-primary">
                      <Target className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold">Next up</p>
                      <p className="text-[10px] text-muted-foreground">3 focused problems</p>
                    </div>
                  </div>
                  <Link href="/patterns/sliding-window" className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">
                    Open <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-[9px] text-muted-foreground">
                  #pattern-first
                </span>
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-[9px] text-muted-foreground">
                  #interview-ready
                </span>
                <span className="ml-auto text-[9px] font-mono text-muted-foreground">no account required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

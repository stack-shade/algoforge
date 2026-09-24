import Link from "next/link";
import { ArrowRight, BookOpen, Layers3, Route, Search, Target } from "lucide-react";
import { getManifest, getProblemsIndex, getTopicsIndex, getRoadmapsIndex } from "@/lib/data/problems";
import { DifficultyBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TerminalHero } from "@/components/terminal/terminal-hero";


export default function HomePage() {
  const manifest = getManifest();
  const problems = getProblemsIndex().slice(0, 6);
  const topics = getTopicsIndex().slice(0, 6);
  const roadmaps = getRoadmapsIndex().slice(0, 4);

  return (
    <div className="site-shell">
      <TerminalHero
        problemCount={manifest?.problemCount ?? 0}
        patternCount={manifest?.patternCount ?? 0}
        topicCount={manifest?.topicCount ?? 0}
        languageCount={manifest?.languages.length ?? 0}
      />

      <section className="container py-14 md:py-18">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-primary">Choose your mode</p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Start with an outcome, not a menu.</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Every path below is designed to get you from concept → practice → recall without making you build your own curriculum first.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              href: "/roadmaps/dsa-fundamentals",
              icon: Route,
              title: "Follow a roadmap",
              desc: "A progressive route from arrays and hashing to trees, graphs, and dynamic programming.",
            },
            {
              href: "/patterns",
              icon: Layers3,
              title: "Learn by pattern",
              desc: "Understand reusable techniques such as two pointers, sliding window, BFS, DFS, and DP.",
            },
            {
              href: "/search",
              icon: Search,
              title: "Find one thing",
              desc: "Search problems, topics, companies, patterns, and guides from one focused workspace.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group">
                <Card className="h-full transition-colors hover:border-primary/30">
                  <CardHeader>
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="mt-1">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{item.desc}</p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                      Explore
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="container py-14 md:py-18">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Structured learning</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Roadmaps with a real sequence</h2>
            </div>
            <Link href="/roadmaps" className="hidden items-center text-sm font-medium text-primary sm:flex">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {roadmaps.map((roadmap) => (
              <Link key={roadmap.slug} href={`/roadmaps/${roadmap.slug}`} className="group">
                <Card className="h-full transition-colors hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{roadmap.name}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">
                          {roadmap.description}
                        </p>
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {roadmap.steps.length} learning steps
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">Practice</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">A small set to get moving</h2>
              </div>
              <Link href="/problems" className="hidden items-center text-sm font-medium text-primary sm:flex">
                All problems
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {problems.map((problem) => (
                <Link
                  key={problem.slug}
                  href={`/problems/${problem.slug}`}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      <span className="mr-2 font-mono text-xs text-muted-foreground">#{problem.number}</span>
                      {problem.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {problem.topics.slice(0, 2).map((t) => t.replace(/-/g, " ")).join(" · ")}
                    </p>
                  </div>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-primary">Popular destinations</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Go deeper without losing context</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ["/blind-75", "Blind 75", "A compact interview-focused set."],
                ["/grind-169", "Grind 169", "More breadth when you need it."],
                ["/companies", "Company prep", "Explore questions by hiring context."],
                ["/topics", "Topic library", `${topics.length} featured topics to explore.`],
                ["/dashboard", "Your progress", "Keep bookmarks, streaks, notes, and review queue in your browser."],
              ].map(([href, title, desc]) => (
                <Link key={href} href={href} className="group cute-card rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-14">
          <div className="cute-card rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <BookOpen className="h-4 w-4" />
                  Keep the loop small
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Learn → solve → review → repeat.</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  AlgoForge stores your lightweight study state locally, so the core learning experience stays fast and works without an account.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  Open progress
                  <Target className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

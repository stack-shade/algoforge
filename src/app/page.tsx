import Link from "next/link";
import { getManifest, getProblemsIndex, getTopicsIndex, getRoadmapsIndex } from "@/lib/data/problems";
import { DifficultyBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const manifest = getManifest();
  const problems = getProblemsIndex().slice(0, 8);
  const topics = getTopicsIndex().slice(0, 8);
  const roadmaps = getRoadmapsIndex();

  return (
    <div>
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">
            Interview mastery platform
          </p>
          <h1 className="max-w-3xl text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Master coding interviews with patterns, not random grinds.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            AlgoForge is a free, SEO-first learning system: original explanations, multi-language
            solutions, Blind 75, Grind 169, company tracks, and roadmaps built for search and study.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/problems">Browse problems</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/blind-75">Start Blind 75</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/search">Search</Link>
            </Button>
          </div>
          {manifest && (
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
              {[
                ["Problems", manifest.problemCount],
                ["Topics", manifest.topicCount],
                ["Patterns", manifest.patternCount],
                ["Landings", manifest.landingCount],
              ].map(([label, value]) => (
                <Card key={label}>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container py-14 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Featured problems</h2>
          <p className="mt-1 text-sm text-muted-foreground mb-4">
            Jump into high-signal interview classics.
          </p>
          <div className="space-y-2">
            {problems.map((p) => (
              <Link
                key={p.slug}
                href={`/problems/${p.slug}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 hover:border-primary/40"
              >
                <span className="font-medium">
                  <span className="text-muted-foreground tabular-nums mr-2">#{p.number}</span>
                  {p.title}
                </span>
                <DifficultyBadge difficulty={p.difficulty} />
              </Link>
            ))}
          </div>
          {problems.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Run <code className="bg-muted px-1 rounded">npm run pipeline</code> to generate data.
            </p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Study paths</h2>
          <p className="mt-1 text-sm text-muted-foreground mb-4">
            Structured roadmaps and topic explorers.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {roadmaps.map((r) => (
              <Link
                key={r.slug}
                href={`/roadmaps/${r.slug}`}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/40"
              >
                <p className="font-semibold">{r.name}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.description}</p>
              </Link>
            ))}
            {topics.map((t) => (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/40"
              >
                <p className="font-semibold">{t.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.problemCount} problems</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="container py-14">
          <h2 className="text-2xl font-bold">Collections that convert practice into offers</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              {
                href: "/blind-75",
                title: "Blind 75",
                desc: "The highest-ROI 75 problems for interviews.",
              },
              {
                href: "/grind-169",
                title: "Grind 169",
                desc: "Expanded set beyond Blind 75 for depth.",
              },
              {
                href: "/neetcode-alternatives",
                title: "NeetCode alternatives",
                desc: "Free pattern curriculum without the paywall.",
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50"
              >
                <h3 className="text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Difficulty } from "@/lib/schema/types";

type PracticeProblem = {
  slug: string;
  title: string;
  number: number;
  difficulty: Difficulty;
  estimatedMinutes: number;
};

function dayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function pickDaily(problems: PracticeProblem[]): PracticeProblem | undefined {
  if (!problems.length) return undefined;
  let hash = 2166136261;
  for (const char of dayKey()) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return problems[Math.abs(hash) % problems.length];
}

function pickRandom(problems: PracticeProblem[]): PracticeProblem | undefined {
  if (!problems.length) return undefined;
  return problems[Math.floor(Math.random() * problems.length)];
}

export function PracticeClient() {
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [random, setRandom] = useState<PracticeProblem>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const url = new URL("practice-index.json", window.location.href);
    fetch(url.toString(), { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("Practice data could not be loaded.");
        return response.json() as Promise<PracticeProblem[]>;
      })
      .then((data) => {
        setProblems(data);
        setRandom(pickRandom(data));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Practice data could not be loaded.");
      });
  }, []);

  const daily = useMemo(() => pickDaily(problems), [problems]);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!problems.length) {
    return <p className="text-sm text-muted-foreground">Loading practice library…</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Today</p>
        <h2 className="mt-2 font-bold text-lg">Daily challenge</h2>
        <p className="mt-2 text-sm text-muted-foreground">The challenge stays stable for your local calendar day.</p>
        {daily && (
          <div className="mt-4">
            <p className="font-medium">{daily.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">#{daily.number} · {daily.difficulty} · ~{daily.estimatedMinutes} min</p>
            <Button asChild size="sm" className="mt-4">
              <Link href={`/problems/${daily.slug}`}>Start challenge</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Random</p>
        <h2 className="mt-2 font-bold text-lg">Random problem</h2>
        <p className="mt-2 text-sm text-muted-foreground">Draw another problem whenever you want a fresh drill.</p>
        {random && (
          <div className="mt-4">
            <p className="font-medium">{random.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">#{random.number} · {random.difficulty} · ~{random.estimatedMinutes} min</p>
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm"><Link href={`/problems/${random.slug}`}>Solve</Link></Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setRandom(pickRandom(problems))}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Another
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Focus</p>
        <h2 className="mt-2 font-bold text-lg">Timed solving</h2>
        <p className="mt-2 text-sm text-muted-foreground">Open any problem and use its built-in timer to practice under a realistic time target.</p>
        <Button asChild size="sm" variant="outline" className="mt-4">
          <Link href="/blind-75"><Timer className="mr-1.5 h-3.5 w-3.5" /> Start Blind 75</Link>
        </Button>
      </section>
    </div>
  );
}

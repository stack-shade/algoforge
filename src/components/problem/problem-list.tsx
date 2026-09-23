import Link from "next/link";
import { DifficultyBadge } from "@/components/ui/badge";
import type { ProblemIndexEntry } from "@/lib/schema/types";

export function ProblemList({
  problems,
  emptyMessage = "No problems found.",
}: {
  problems: ProblemIndexEntry[];
  emptyMessage?: string;
}) {
  if (problems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] border-b border-border bg-muted/30 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid-cols-[4rem_minmax(0,1fr)_7rem_14rem]">
        <span>#</span>
        <span>Problem</span>
        <span className="hidden sm:block">Difficulty</span>
        <span className="hidden sm:block">Topics</span>
      </div>

      <ul className="divide-y divide-border">
        {problems.map((problem) => (
          <li key={problem.slug}>
            <Link
              href={`/problems/${problem.slug}`}
              className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/35 focus-visible:bg-muted/35 focus-visible:outline-none sm:grid-cols-[4rem_minmax(0,1fr)_7rem_14rem]"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground">{problem.number}</span>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{problem.title}</p>
                  <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground sm:inline">
                    {problem.estimatedMinutes} min
                  </span>
                </div>
                <p className="mt-1 truncate text-xs capitalize text-muted-foreground sm:hidden">
                  {problem.topics.slice(0, 2).map((t) => t.replace(/-/g, " ")).join(" · ")}
                </p>
              </div>

              <div className="shrink-0">
                <DifficultyBadge difficulty={problem.difficulty} />
              </div>

              <p className="hidden truncate text-xs capitalize text-muted-foreground sm:block">
                {problem.topics.slice(0, 3).map((t) => t.replace(/-/g, " ")).join(" · ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

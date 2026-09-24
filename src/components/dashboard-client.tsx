"use client";

import { useState } from "react";
import Link from "next/link";
import { getUserStore, type UserState } from "@/lib/user/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DashboardClient() {
  const [state] = useState<UserState | null>(() => typeof window === "undefined" ? null : getUserStore().getState());

  if (!state) {
    return <p className="text-sm text-muted-foreground">Loading local progress…</p>;
  }

  const progresses = Object.values(state.progress);
  const solved = progresses.filter((p) => p.status === "solved").length;
  const attempted = progresses.filter((p) => p.status === "attempted").length;
  const review = progresses.filter((p) => p.status === "review").length;
  const totalTime = progresses.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const noted = progresses.filter((p) => (p.notes || "").trim().length > 0).length;
  const tagged = progresses.filter((p) => (p.customTags || []).length > 0).length;
  const reminders = Object.entries(state.reminders || {});

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Streak</p>
            <p className="mt-1 text-3xl font-bold">{state.streak.current} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Solved</p>
            <p className="mt-1 text-3xl font-bold">{solved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Attempted</p>
            <p className="mt-1 text-3xl font-bold">{attempted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Needs Review</p>
            <p className="mt-1 text-3xl font-bold">{review}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Time Spent</p>
            <p className="mt-1 text-3xl font-bold">{formatTime(totalTime)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">With Notes</p>
            <p className="mt-1 text-3xl font-bold">{noted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Tagged</p>
            <p className="mt-1 text-3xl font-bold">{tagged}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Bookmarks</p>
            <p className="mt-1 text-3xl font-bold">{state.bookmarks.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Study Queue ({state.studyQueue.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {state.studyQueue.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add problems from any solution page to build a queue.
              </p>
            ) : (
              <ul className="space-y-2">
                {state.studyQueue.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/problems/${slug}`}
                      className="text-primary hover:underline"
                    >
                      {formatSlug(slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Reminders ({reminders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Set a reminder on any problem to review it later.
              </p>
            ) : (
              <ul className="space-y-2">
                {reminders.map(([slug, date]) => (
                  <li key={slug} className="flex items-center justify-between text-sm">
                    <Link href={`/problems/${slug}`} className="text-primary hover:underline">
                      {slug}
                    </Link>
                    <span className="text-muted-foreground">
                      {new Date(date).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-3">Bookmarks ({state.bookmarks.length})</h2>
        {state.bookmarks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Bookmark problems from any solution page.{" "}
            <Link href="/problems" className="text-primary hover:underline">
              Browse problems
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {state.bookmarks.map((slug) => (
              <li key={slug}>
                <Link href={`/problems/${slug}`} className="text-primary hover:underline">
                  {slug}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

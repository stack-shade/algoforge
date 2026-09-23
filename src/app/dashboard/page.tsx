import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { DashboardClient } from "@/components/dashboard-client";

export const metadata: Metadata = buildMetadata(
  {
    title: "Progress Dashboard | AlgoForge",
    description: "Local progress, bookmarks, streaks, notes, review queue, and confidence tracking.",
    keywords: ["leetcode progress", "study streak", "coding practice dashboard"],
    canonicalPath: "/dashboard",
  },
  {
    robots: {
      index: false,
      follow: true,
    },
  },
);

export default function DashboardPage() {
  return (
    <div className="container py-10 md:py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Progress", path: "/dashboard" }]} />
      <header className="mt-5 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Your workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Progress</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Your learning state is stored in this browser. Bookmarks, streaks, notes, timers, and review reminders stay lightweight and local.
        </p>
      </header>
      <div className="mt-8">
        <DashboardClient />
      </div>
    </div>
  );
}

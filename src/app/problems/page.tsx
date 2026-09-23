import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { getProblemsIndex, PROBLEMS_PAGE_SIZE } from "@/lib/data/problems";
import { ProblemList } from "@/components/problem/problem-list";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";\nimport { ProblemPagination } from "@/components/problem/problem-pagination";

export const metadata: Metadata = buildMetadata({
  title: "LeetCode Problems — Solutions, Patterns & Complexity | AlgoForge",
  description:
    "Browse 3,000+ coding interview problems with original explanations, multi-language solutions, pattern tags, companies, and complexity notes. Problems are split into fast, crawlable pages for easier study.",
  keywords: ["leetcode problems", "coding interview problems", "dsa problems", "algorithm solutions"],
  canonicalPath: "/problems",
});

export default function ProblemsPage() {
  const problems = getProblemsIndex();

  return (
    <div className="container py-10 md:py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Problems", path: "/problems" }]} />

      <header className="mt-5 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Practice library</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Problems</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {problems.length.toLocaleString()} problems, organized for learning instead of endless scrolling.
          Open any problem to study the pattern, solution, visualization, and review checklist.
        </p>
      </header>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-primary/40">
          <Search className="h-3.5 w-3.5" />
          Search the library
        </Link>
        {[
          ["/topics", "Browse topics"],
          ["/patterns", "Browse patterns"],
          ["/companies", "Browse companies"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground">
            {label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ProblemList problems={problems} />
      </div>
    </div>
  );
}

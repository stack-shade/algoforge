import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PROBLEMS_PAGE_SIZE } from "@/lib/data/problems";

export function ProblemPagination({
  currentPage,
  totalItems,
}: {
  currentPage: number;
  totalItems: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PROBLEMS_PAGE_SIZE));
  if (totalPages <= 1) return null;

  const pages = Array.from(new Set([
    1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    totalPages,
  ])).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);

  return (
    <nav aria-label="Problem pages" className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
      {currentPage > 1 ? (
        <Link
          href={currentPage === 2 ? "/problems" : `/problems/page/${currentPage - 1}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Previous
        </Link>
      ) : (
        <span className="h-9 w-[5.5rem]" aria-hidden />
      )}

      {pages.map((page, index) => {
        const previous = pages[index - 1];
        const gap = previous && page - previous > 1;

        return (
          <span key={page} className="flex items-center gap-1.5">
            {gap && <span className="px-1 text-muted-foreground">…</span>}
            <Link
              href={page === 1 ? "/problems" : `/problems/page/${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition-colors ${
                currentPage === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={`/problems/page/${currentPage + 1}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Next
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <span className="h-9 w-14" aria-hidden />
      )}
    </nav>
  );
}

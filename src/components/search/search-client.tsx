"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MiniSearch from "minisearch";
import type { SearchDocument } from "@/lib/schema/types";
import { DifficultyBadge } from "@/components/ui/badge";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!query.trim() || documents.length > 0 || loading) return;

    setLoading(true);
    const url = new URL("../search-index.json", window.location.href);

    fetch(url.toString(), { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("Search index could not be loaded.");
        return response.json() as Promise<SearchDocument[]>;
      })
      .then((data) => setDocuments(data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Search index could not be loaded.");
      })
      .finally(() => setLoading(false));
  }, [query, documents.length, loading]);

  const index = useMemo(() => {
    if (!documents.length) return null;

    const mini = new MiniSearch<SearchDocument>({
      idField: "id",
      fields: ["title", "description", "keywords", "slug"],
      storeFields: [
        "id",
        "type",
        "title",
        "slug",
        "path",
        "description",
        "difficulty",
        "topics",
        "patterns",
        "number",
      ],
      searchOptions: {
        boost: { title: 3, keywords: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    const seen = new Set<string>();
    mini.addAll(
      documents.filter((d) => {
        if (seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
      }),
    );
    return mini;
  }, [documents]);

  const results = useMemo<SearchDocument[]>(() => {
    if (!query.trim() || !index) return [];
    return index.search(query, { combineWith: "AND" }).slice(0, 30) as unknown as SearchDocument[];
  }, [query, index]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="search" className="sr-only">
          Search problems, topics, patterns
        </label>
        <input
          id="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Two Sum, DP, Google, Blind 75…"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          autoFocus
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Search data loads only when you start typing.
        </p>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading search index…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && query.trim() && results.length === 0 && (
        <p className="text-sm text-muted-foreground">No results. Try another query.</p>
      )}

      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r.id}>
            <Link
              href={r.path}
              className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex flex-wrap items-center gap-2">
                {r.number != null && (
                  <span className="font-mono text-[11px] font-bold text-muted-foreground">
                    #{r.number}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  {r.type}
                </span>
                {r.difficulty && <DifficultyBadge difficulty={r.difficulty} />}
              </div>
              <p className="mt-1 font-semibold">{r.title}</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

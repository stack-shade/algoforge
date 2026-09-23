import type { MetadataRoute } from "next";
import { getSitemapPaths, getProblemsIndex, PROBLEMS_PAGE_SIZE } from "@/lib/data/problems";
import { siteConfig } from "@/lib/config";

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const problemPageCount = Math.ceil(getProblemsIndex().length / PROBLEMS_PAGE_SIZE);
  const problemPages = Array.from({ length: Math.max(0, problemPageCount - 1) }, (_, index) => `/problems/page/${index + 2}`);
  const paths = Array.from(new Set([...getSitemapPaths(), "/", ...problemPages]));
  const base = siteConfig.url.replace(/\/$/, "");
  const limited = paths.slice(0, 45000);

  return limited.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path.startsWith("/blog") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/problems/") ? 0.8 : 0.6,
  }));
}

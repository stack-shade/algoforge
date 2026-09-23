import fs from "node:fs";
import path from "node:path";
import { GENERATED } from "./paths";
import { z } from "zod";

const ProblemIndexSchema = z.object({
  number: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  topics: z.array(z.string()),
  patterns: z.array(z.string()),
  companies: z.array(z.string()),
  languages: z.array(z.string()),
  premium: z.boolean(),
  timeComplexity: z.string().min(1),
  spaceComplexity: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
});

const SolutionSchema = z.object({
  language: z.string().min(1),
  languageSlug: z.string().min(1),
  filename: z.string().min(1),
  code: z.string(),
  sourcePath: z.string().min(1),
});

const ProblemSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  topics: z.array(z.string()),
  patterns: z.array(z.string()),
  languages: z.array(z.string()),
  solutions: z.record(z.string(), SolutionSchema),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    keywords: z.array(z.string()),
    canonicalPath: z.string().startsWith("/"),
  }),
}).passthrough();

const ManifestSchema = z.object({
  generatedAt: z.string().datetime(),
  problemCount: z.number().int().nonnegative(),
  topicCount: z.number().int().nonnegative(),
  patternCount: z.number().int().nonnegative(),
  companyCount: z.number().int().nonnegative(),
  collectionCount: z.number().int().nonnegative(),
  landingCount: z.number().int().nonnegative(),
  languages: z.array(z.string()),
  version: z.string().min(1),
});

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function main() {
  const indexPath = path.join(GENERATED, "problems-index.json");
  const manifestPath = path.join(GENERATED, "site-manifest.json");
  if (!fs.existsSync(indexPath) || !fs.existsSync(manifestPath)) {
    throw new Error("Generated data is missing. Run npm run pipeline first.");
  }

  const index = z.array(ProblemIndexSchema).parse(readJson(indexPath));
  const manifest = ManifestSchema.parse(readJson(manifestPath));

  const slugs = new Set<string>();
  const numbers = new Set<number>();
  for (const item of index) {
    if (slugs.has(item.slug)) throw new Error(`Duplicate problem slug: ${item.slug}`);
    if (numbers.has(item.number)) throw new Error(`Duplicate problem number: ${item.number}`);
    slugs.add(item.slug);
    numbers.add(item.number);

    const problemPath = path.join(GENERATED, "problems", `${item.slug}.json`);
    if (!fs.existsSync(problemPath)) throw new Error(`Missing problem JSON: ${item.slug}`);
    const problem = ProblemSchema.parse(readJson(problemPath));
    if (problem.number !== item.number) throw new Error(`Problem number mismatch: ${item.slug}`);
    if (problem.slug !== item.slug) throw new Error(`Problem slug mismatch: ${item.slug}`);
    if (problem.seo.canonicalPath !== `/problems/${item.slug}`) {
      throw new Error(`Canonical mismatch: ${item.slug}`);
    }
  }

  if (manifest.problemCount !== index.length) {
    throw new Error(`Manifest problem count ${manifest.problemCount} != index ${index.length}`);
  }

  console.log(`Validated ${index.length} generated problem records.`);
}

main();

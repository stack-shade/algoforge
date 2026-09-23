export const siteConfig = {
  name: "AlgoForge",
  tagline: "Master coding interviews with patterns, roadmaps, and solutions",
  description:
    "AlgoForge is a free coding interview learning platform with pattern-based problem solving, structured roadmaps, multi-language solutions, and lightweight progress tracking.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stack-shade.github.io/algoforge",
  basePath: "/algoforge",
  ogImage: "/algoforge/og-default.svg",
  links: {
    github: "https://github.com/stack-shade/algoforge",
    sourceSolutions: "https://github.com/kamyu104/LeetCode-Solutions",
  },
  creator: "AlgoForge",
  keywords: [
    "leetcode",
    "coding interview",
    "blind 75",
    "grind 169",
    "dynamic programming",
    "data structures",
    "algorithms",
    "interview preparation",
  ],
} as const;

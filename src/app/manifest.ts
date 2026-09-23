import type { MetadataRoute } from "next";

const basePath = "/algoforge";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AlgoForge — Interview Workspace",
    short_name: "AlgoForge",
    description:
      "Pattern-first coding interview preparation with roadmaps, problem search, and local progress tracking.",
    start_url: basePath + "/",
    scope: basePath + "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#05070a",
    theme_color: "#05070a",
    categories: ["education", "developer", "productivity"],
    lang: "en",
    icons: [
      {
        src: basePath + "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
      {
        src: basePath + "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}

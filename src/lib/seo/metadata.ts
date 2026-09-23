import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import type { SeoFields } from "@/lib/schema/types";

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function buildMetadata(seo: SeoFields, extras: Partial<Metadata> = {}): Metadata {
  const url = absoluteUrl(seo.canonicalPath);
  const ogImage = seo.ogImage ?? siteConfig.ogImage;
  const { openGraph: extraOpenGraph, twitter: extraTwitter, ...rest } = extras;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title: seo.title,
      description: seo.description,
      url,
      siteName: siteConfig.name,
      images: [{ url: absoluteUrl(ogImage), width: 1200, height: 630, alt: seo.title }],
      ...extraOpenGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [absoluteUrl(ogImage)],
      ...extraTwitter,
    },
    ...rest,
  };
}

export function defaultMetadata(): Metadata {
  return buildMetadata({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    keywords: [...siteConfig.keywords],
    canonicalPath: "/",
  });
}

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

const primaryNav = [
  { href: "/problems", label: "Problems" },
  { href: "/topics", label: "Topics" },
  { href: "/patterns", label: "Patterns" },
  { href: "/roadmaps", label: "Roadmaps" },
];

const secondaryNav = [
  { href: "/blind-75", label: "Blind 75" },
  { href: "/companies", label: "Companies" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight"
            aria-label={siteConfig.name}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-[11px] font-black">
              AF
            </span>
            <span>{siteConfig.name}</span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1" aria-label="Primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex gap-2">
            <Link href="/search" aria-label="Search AlgoForge">
              <Search className="h-4 w-4" />
              <span>Search</span>
              <kbd className="rounded border border-border bg-muted px-1.5 text-[10px] font-mono">/</kbd>
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard">Progress</Link>
          </Button>

          <details className="relative xl:hidden">
            <summary
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </summary>
            <div className="absolute right-0 top-11 w-64 rounded-2xl border border-border bg-popover p-2 shadow-xl">
              <Link href="/search" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-muted">
                <Search className="h-4 w-4" />
                Search
              </Link>
              {[...primaryNav, ...secondaryNav].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <Link
                href="/dashboard"
                className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Progress
              </Link>
            </div>
          </details>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

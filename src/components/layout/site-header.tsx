import Link from "next/link";
import { Menu, Search, Terminal, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

const primaryNav = [
  { href: "/problems", label: "Problems" },
  { href: "/patterns", label: "Patterns" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/companies", label: "Companies" },
];

const secondaryNav = [
  { href: "/topics", label: "Topics" },
  { href: "/blind-75", label: "Blind 75" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/82 backdrop-blur-2xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={siteConfig.name}
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[1.1rem] border border-primary/25 bg-primary/10 text-primary shadow-[0_8px_22px_color-mix(in_oklab,var(--primary)_16%,transparent)] transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105">
              <span className="absolute -right-1 -top-1 text-[11px] text-[var(--cute-pink)]">✦</span>
              <Terminal className="relative h-4 w-4" />
            </span>
            <span className="hidden min-[420px]:block">
              <span className="block font-mono text-sm font-bold tracking-tight">algoforge</span>
              <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                pattern-first interview lab
              </span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 shadow-sm" aria-label="Primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 font-mono text-[10px] font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden gap-2 rounded-full border-border/80 bg-card/70 font-mono text-xs shadow-sm sm:inline-flex"
          >
            <Link href="/search" aria-label="Search AlgoForge">
              <Search className="h-3.5 w-3.5" />
              <span>search</span>
              <kbd className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[9px]">/</kbd>
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="hidden rounded-full font-mono text-xs sm:inline-flex hover:bg-accent/40">
            <Link href="/dashboard">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[var(--cute-purple)]" />
              progress
            </Link>
          </Button>

          <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

          <details className="relative xl:hidden">
            <summary
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-all hover:-translate-y-px hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </summary>
            <div className="absolute right-0 top-11 w-72 rounded-2xl border border-border bg-popover/96 p-2 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-border px-3 pb-3 pt-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  explore the lab
                </p>
              </div>
              {[...primaryNav, ...secondaryNav].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mt-1 block rounded-xl px-3 py-2.5 font-mono text-sm text-muted-foreground transition-all hover:bg-primary/8 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <Link href="/search" className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-mono text-sm hover:bg-muted">
                <Search className="h-4 w-4" />
                Search workspace
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-mono text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <Sparkles className="h-4 w-4 text-[var(--cute-purple)]" />
                Progress
              </Link>
            </div>
          </details>

          <ThemeToggle />

          <span
            className="ml-1 hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary lg:flex"
            title="AlgoForge is ready"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary terminal-pulse" />
            ready
          </span>
        </div>
      </div>
    </header>
  );
}

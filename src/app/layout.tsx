import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { defaultMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import {
  organizationJsonLd,
  websiteJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/config";
import { SearchModal } from "@/components/search/search-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...defaultMetadata(),
  metadataBase: new URL(siteConfig.url),
  icons: { icon: "/favicon.ico" },
  verification: {
    google: "_rPi-600gMFYjNa9qzMTuIQg1_aey417EeAdaiIqgFg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <JsonLd data={organizationJsonLd()} />
          <JsonLd data={websiteJsonLd()} />
          <JsonLd data={softwareApplicationJsonLd()} />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-QDGSX2YTBT"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QDGSX2YTBT');
            `}
          </Script>
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1828915420581549"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          <SiteHeader />
          <main id="main" className="min-h-[70vh]">
            {children}
          </main>
          <SiteFooter />
          <SearchModal />
        </ThemeProvider>
      </body>
    </html>
  );
}

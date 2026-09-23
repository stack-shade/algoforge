import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
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

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...defaultMetadata(),
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
      <body className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}>
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

          <SiteHeader />
          <main id="main" className="min-h-[70vh]">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}

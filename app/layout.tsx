import { geist, spaceGrotesk, plexMono, fraunces } from "./fonts";
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import AppProviders from "./components/providers/AppProviders";
import { Toaster } from "./components/ui/sonner";
import { GoogleTagManager } from "@next/third-parties/google";
import { getSiteUrl } from "@/lib/site";
import { absoluteImageUrl, SEO_DEFAULTS } from "@/lib/seo";

function siteUrl() {
  return getSiteUrl();
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SEO_DEFAULTS.siteName} | Web Development & Digital Marketing Agency`,
    template: `%s | ${SEO_DEFAULTS.siteName}`,
  },
  description: SEO_DEFAULTS.description,
  applicationName: SEO_DEFAULTS.siteName,
  keywords: [
    "web development",
    "digital marketing",
    "SEO",
    "software agency",
    "Bangladesh",
    "UAE",
    "Databist",
  ],
  authors: [{ name: SEO_DEFAULTS.siteName, url: siteUrl() }],
  creator: SEO_DEFAULTS.siteName,
  publisher: SEO_DEFAULTS.siteName,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl(),
    siteName: SEO_DEFAULTS.siteName,
    title: `${SEO_DEFAULTS.siteName} | Web Development & Digital Marketing Agency`,
    description: SEO_DEFAULTS.description,
    images: [
      {
        url: absoluteImageUrl(SEO_DEFAULTS.ogImage),
        alt: SEO_DEFAULTS.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_DEFAULTS.siteName} | Web Development & Digital Marketing Agency`,
    description: SEO_DEFAULTS.description,
    images: [absoluteImageUrl(SEO_DEFAULTS.ogImage)],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl(),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        geist.variable,
        spaceGrotesk.variable,
        plexMono.variable,
        fraunces.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <GoogleTagManager gtmId="GTM-NCFL883Q" />
        <AppProviders>
          {children}
          <Toaster richColors position="top-left" />
        </AppProviders>
      </body>
    </html>
  );
}

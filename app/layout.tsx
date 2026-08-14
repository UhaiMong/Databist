import { spaceGrotesk, plexMono } from "./fonts";
import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import AppProviders from "./components/providers/AppProviders";
import { Toaster } from "./components/ui/sonner";
import { GoogleTagManager } from "@next/third-parties/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Databist",
  description:
    "A full-service of offering website development, content writing, SEO, video ads, social media management, digital marketing, and online maintenance packages.",
  icons: { icon: "/favicon.ico" },
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
        "h-full",
        "antialiased",
        "font-sans",
        geist.variable,
        `${spaceGrotesk.variable} ${plexMono.variable}`,
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Databist",
  description:
    "A full-service digital agency offering website development, graphic design, content writing, SEO, video ads, social media management, digital marketing, and online maintenance packages.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

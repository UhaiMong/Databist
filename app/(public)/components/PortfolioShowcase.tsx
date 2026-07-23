"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

function ProjectCard({ item }: { item: any }) {
  const [revealed, setRevealed] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    if (!revealed) {
      e.preventDefault();
      setRevealed(true);
    }
  };

  return (
    <Link
      href={`/portfolio/${item.slug}`}
      onClick={handleClick}
      className="group relative block overflow-hidden rounded-sm bg-[#15161B] ring-1 ring-[#2A2B31] transition-colors duration-300 hover:ring-[#C9A15A]/60"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="eager"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* Scrim — always present for legibility, deepens on reveal */}
        <div
          className={`absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent transition-opacity duration-500 ${
            revealed ? "opacity-100" : "opacity-90 group-hover:opacity-100"
          }`}
        />

        {/* Service type tag */}
        {item.serviceType && (
          <span
            className="absolute left-4 top-4 rounded-full border border-[#C9A15A]/40 bg-black/30 px-2.5 py-1 text-[11px] tracking-[0.15em] text-brand-light backdrop-blur-sm"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            {item.serviceType}
          </span>
        )}

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3
            className="text-xl leading-snug text-[#EDEAE2] italic"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {item.title}
          </h3>

          {item.summary && (
            <div
              className={`grid overflow-hidden transition-all duration-500 ease-out ${
                revealed
                  ? "mt-2 grid-rows-[1fr] opacity-100"
                  : "mt-0 grid-rows-[0fr] opacity-0"
              } group-hover:mt-2 group-hover:grid-rows-[1fr] group-hover:opacity-100`}
            >
              <div className="overflow-hidden">
                <p className="line-clamp-3 text-sm leading-relaxed text-[#C9C6BA]">
                  {item.summary}
                </p>
              </div>
            </div>
          )}

          <span
            className={`mt-3 inline-flex items-center gap-1 text-[11px] tracking-[0.15em] uppercase text-[#8A8779] transition-all duration-300 ${
              revealed ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            } group-hover:translate-y-0 group-hover:opacity-100`}
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            View project
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PortfolioShowcase({
  portfolioItems,
}: {
  portfolioItems: any;
}) {
  if (!portfolioItems?.length) return null;

  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} relative py-24 px-4 sm:px-6`}
      style={{ background: "#101014" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 md:mb-16 max-w-xl">
          <span
            className="block text-[11px] tracking-[0.25em] text-[#8A8779] uppercase"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            Selected Work — On Display
          </span>
          <h2
            className="mt-3 text-4xl sm:text-5xl text-[#EDEAE2] italic"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Recent work
          </h2>
        </div>

        {/* Exhibit grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item: any) => (
            <ProjectCard key={item.slug} item={item} />
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 border-b border-[#2A2B31] pb-1 text-xs tracking-[0.2em] uppercase text-[#EDEAE2] transition-colors hover:border-[#C9A15A] hover:text-[#C9A15A]"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            View all work
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

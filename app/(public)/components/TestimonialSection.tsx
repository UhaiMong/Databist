"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn, DesignTokens, fraunces, plexMono } from "@/lib/utils";

function RatingSeal({ rating, max = 5 }: { rating: number; max?: number }) {
  const size = 52;
  const stroke = 1.5;
  const r = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, rating / max));
  const filled = circumference * pct;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: DesignTokens.bg }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={DesignTokens.hairline}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={DesignTokens.gold}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>
      <span
        className="absolute text-[11px]"
        style={{ fontFamily: "var(--font-plex-mono)", color: DesignTokens.ink }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function TestimonialSection({
  testimonials,
}: {
  testimonials: any;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [
      Autoplay({
        delay: 4200,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSlideCount(emblaApi.scrollSnapList().length);
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  if (!testimonials?.length) return null;

  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} relative overflow-hidden px-4 py-24 sm:px-6`}
      style={{ background: DesignTokens.bg }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <span
              className="block text-[11px] tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-plex-mono)",
                color: DesignTokens.muted,
              }}
            >
              Correspondence — Verified
            </span>
            <h2
              className="mt-3 text-4xl italic sm:text-5xl"
              style={{
                fontFamily: "var(--font-fraunces)",
                color: DesignTokens.ink,
              }}
            >
              Entries from the field
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <span
              className="text-[11px] tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-plex-mono)",
                color: DesignTokens.mutedDark,
              }}
            >
              {String(selectedIndex + 1).padStart(2, "0")} /{" "}
              {String(slideCount).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full ring-1 transition-colors hover:text-[#C9A15A]"
                style={{
                  borderColor: DesignTokens.hairline,
                  color: DesignTokens.muted,
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full ring-1 transition-colors hover:text-[#C9A15A]"
                style={{
                  borderColor: DesignTokens.hairline,
                  color: DesignTokens.muted,
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="cursor-grab overflow-hidden active:cursor-grabbing"
          ref={emblaRef}
        >
          <div className="-ml-6 flex">
            {testimonials.map((t: any) => (
              <div
                key={t._id}
                className="min-w-0 h-96 shrink-0 grow-0 basis-[86%] pl-6 sm:basis-[60%] lg:basis-[38%]"
              >
                <div
                  className="flex h-full flex-col rounded-sm p-6 ring-1 transition-colors sm:p-7"
                  style={{
                    background: DesignTokens.surface,
                    borderColor: DesignTokens.hairline,
                  }}
                >
                  <RatingSeal rating={t.rating} />

                  <div
                    className={cn(
                      "h-80 mt-5 flex-1 text-lg italic leading-[1.55] sm:text-xl",
                      t.quote.length > 200 ? "overflow-y-scroll" : "",
                    )}
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: "rgba(237,234,226,0.9)",
                    }}
                  >
                    <span style={{ color: DesignTokens.gold }}>&ldquo;</span>

                    {t.quote}

                    <span style={{ color: DesignTokens.gold }}>&rdquo;</span>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    {t.avatar ? (
                      <Image
                        src={t.avatar}
                        alt={t.clientName}
                        width={36}
                        height={36}
                        className="rounded-full object-cover object-center ring-1"
                        style={{ borderColor: DesignTokens.hairline }}
                      />
                    ) : (
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full ring-1"
                        style={{
                          background: DesignTokens.bg,
                          borderColor: DesignTokens.hairline,
                        }}
                      >
                        <span
                          className="text-[11px]"
                          style={{
                            fontFamily: "var(--font-plex-mono)",
                            color: DesignTokens.muted,
                          }}
                        >
                          {t.clientName?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div
                      className="text-xs tracking-wide"
                      style={{ fontFamily: "var(--font-plex-mono)" }}
                    >
                      <span style={{ color: DesignTokens.ink }}>
                        {t.clientName}
                      </span>
                      {(t.clientRole || t.companyName) && (
                        <span style={{ color: DesignTokens.muted }}>
                          {"  —  "}
                          {t.clientRole}
                          {t.clientRole && t.companyName ? ", " : ""}
                          {t.companyName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

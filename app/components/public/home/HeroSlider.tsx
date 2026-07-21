"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { Slide, SLIDES } from "./data/SlideData";

// Component

const AUTOPLAY_DELAY = 5000;

export default function HeroSlider({ slides = SLIDES }: { slides?: Slide[] }) {
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
      stopOnFocusIn: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
      skipSnaps: false,
    },
    [autoplay.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  const onPointerDown = useCallback(
    (_api: EmblaCarouselType, _event: EmblaEventType) => setIsDragging(true),
    [],
  );

  const onPointerUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi, onSelect, onPointerDown, onPointerUp]);

  return (
    <section className="w-full overflow-hidden bg-[#05070F]">
      <div className="relative pl-4 pr-0 sm:pl-6 lg:pl-10 xl:pl-16">
        {/* Viewport */}
        <div
          ref={emblaRef}
          className={cn(
            "overflow-hidden",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          {/* Container */}
          <div className="flex touch-pan-y gap-4 sm:gap-5 lg:gap-6 mt-14">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "relative shrink-0 grow-0",
                  "flex-[0_0_86%] sm:flex-[0_0_78%] lg:flex-[0_0_68%] xl:flex-[0_0_60%]",
                )}
              >
                <div className="my-7">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-100">
                    {slide?.headline}
                  </h1>
                </div>
                <SlideCard
                  slide={slide}
                  total={slides.length}
                  isActive={index === selectedIndex}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Indicators */}
        <div className="flex justify-start items-center gap-3 mt-4 py-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2.5 transition-all ease-in-out duration-300 rounded-full bg-slate-50 cursor-pointer",
                index === selectedIndex
                  ? "w-8 opacity-100"
                  : "w-2.5 opacity-40 hover:opacity-75",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SlideCard({
  slide,
  total,
  isActive,
}: {
  slide: Slide;
  total: number;
  isActive: boolean;
}) {
  const hasSecondary = Boolean(slide.secondaryButtonText && slide.s_link);

  return (
    <div className="group relative h-100 sm:h-110 lg:h-120 w-full overflow-hidden bg-[#05070F]">
      {/* Background image */}
      <Image
        src={slide.bannerImage}
        alt=""
        fill
        priority={isActive}
        sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 68vw, (min-width: 640px) 78vw, 86vw"
        className={cn(
          "object-cover object-center opacity-70 transition-transform duration-1200 ease-out",
          isActive ? "scale-105" : "scale-100",
        )}
      />

      {/* Gradient overlays for legibility */}
      <div className="absolute inset-0 bg-linear-to-r from-[#05070F] via-[#05070F]/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-[#05070F]/60 via-transparent to-[#05070F]/20" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
        {/* Eyebrow / sequence marker */}
        <div className="flex items-center gap-3 text-slate-300">
          <span className="text-sm font-semibold tracking-wide text-white">
            {slide.id}
          </span>
          <span className="h-px w-8 bg-white/30" />
          <span className="text-xs font-medium tracking-wide text-slate-400">
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Headline & subtext */}
        <div className="max-w-xl">
          <p className="mt-3 max-w-md text-sm text-slate-300/90 sm:text-base">
            {slide.subtext}
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {slide.primaryButtonText && slide.p_link && (
              <Button asChild className="rounded-full px-5 bg-brand text-white">
                <Link href={slide.p_link}>
                  {slide.primaryButtonText}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            )}

            {hasSecondary && (
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/30 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={slide.s_link}>
                  {slide.secondaryButtonText}
                  <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

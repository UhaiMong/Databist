"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";

const SLIDES = [
  {
    headline: "Digital Growth Partners for Ambitious Businesses",
    subtext:
      "Web development, design, SEO, and marketing — all under one accountable team.",
  },
  {
    headline: "Websites Built for Speed, Security, and Conversions",
    subtext:
      "Custom-designed, responsive builds optimised for Core Web Vitals.",
  },
  {
    headline: "From Bangladesh to the UAE and Beyond",
    subtext:
      "Serving clients across multiple markets with local expertise, global standards.",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-background py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          {slide.headline}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          {slide.subtext}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/booking">
              Book a Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/services">View Services</Link>
          </Button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-primary" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  suffix?: string;
  /** Animation length in ms. */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  duration = 1400,
  className,
  style,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const animate = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setDisplay(value * eased);
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
        } else {
          if (frameRef.current) cancelAnimationFrame(frameRef.current);
          setDisplay(0);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return (
    <span
      ref={spanRef}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums", ...style }}
    >
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

import { Star } from "lucide-react";
import { DesignTokens, fraunces, plexMono } from "@/lib/utils";
import AnimatedNumber from "./AnimatedNumber";

export default function TrustTrip() {
  const established = 2020;
  const experience = new Date().getFullYear() - established;

  const stats = [
    { label: "Years in Operation", value: experience, suffix: "+" },
    { label: "Clients Served", value: 150, suffix: "+" },
    { label: "Countries Served", value: 10, suffix: "+" },
  ];

  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} relative border-y py-8`}
      style={{
        background: DesignTokens.bg,
        borderColor: DesignTokens.hairline,
      }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-5xl grid-cols-2 divide-y divide-[#2A2B31] px-4 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-1.5 px-4 py-5"
          >
            <AnimatedNumber
              value={stat.value}
              suffix={stat.suffix}
              className="text-3xl sm:text-4xl"
              style={{
                fontFamily: "var(--font-plex-mono)",
                color: DesignTokens.ink,
              }}
            />
            <p
              className="text-[11px] tracking-[0.15em] uppercase"
              style={{ color: DesignTokens.muted }}
            >
              {stat.label}
            </p>
          </div>
        ))}

        <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-5">
          <div className="flex items-center gap-1.5">
            <Star
              className="h-5 w-5"
              style={{ color: DesignTokens.gold, fill: DesignTokens.gold }}
            />
            <AnimatedNumber
              value={4.9}
              decimals={1}
              className="text-3xl sm:text-4xl"
              style={{
                fontFamily: "var(--font-plex-mono)",
                color: DesignTokens.ink,
              }}
            />
          </div>
          <p
            className="text-[11px] tracking-[0.15em] uppercase"
            style={{ color: DesignTokens.muted }}
          >
            Average Rating
          </p>
        </div>
      </div>
    </section>
  );
}

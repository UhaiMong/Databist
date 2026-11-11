import { DesignTokens, fraunces, plexMono } from "@/lib/utils";
import AnimatedNumber from "./AnimatedNumber";

export type TrustStats = {
  serviceCount: number;
  projectCount: number;
  postCount: number;
  officeCount: number;
};

type TrustTripProps = {
  stats: TrustStats;
};

export default function TrustTrip({ stats }: TrustTripProps) {
  const items = [
    {
      label: "Services offered",
      value: Math.max(stats.serviceCount, 0),
      suffix: "+",
    },
    {
      label: "Projects delivered",
      value: Math.max(stats.projectCount, 0),
      suffix: "+",
    },
    {
      label: "Articles published",
      value: Math.max(stats.postCount, 0),
      suffix: "+",
    },
    {
      label: "Office locations",
      value: Math.max(stats.officeCount, 0),
      suffix: "",
    },
  ].filter((item) => item.value > 0);

  if (items.length === 0) return null;

  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} relative border-y py-8`}
      style={{
        background: DesignTokens.bg,
        borderColor: DesignTokens.hairline,
      }}
      aria-label="Company snapshot"
    >
      <div
        className={`relative mx-auto grid max-w-5xl grid-cols-2 px-4 sm:divide-x sm:divide-y-0 divide-y divide-[#2A2B31] ${
          items.length >= 4
            ? "sm:grid-cols-4"
            : items.length === 3
              ? "sm:grid-cols-3"
              : "sm:grid-cols-2"
        }`}
      >
        {items.map((stat) => (
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
      </div>
    </section>
  );
}

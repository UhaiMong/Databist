import { DesignTokens, fraunces, plexMono } from "@/lib/utils";
import {
  Shirt,
  ShoppingCart,
  Building2,
  GraduationCap,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const INDUSTRIES = [
  { name: "Fashion & Apparel", icon: "shirt" },
  { name: "Retail & E-commerce", icon: "shopping-cart" },
  { name: "Real Estate", icon: "building" },
  { name: "Education", icon: "graduation-cap" },
  { name: "Professional Services", icon: "briefcase" },
];

const ICONS: Record<string, LucideIcon> = {
  shirt: Shirt,
  "shopping-cart": ShoppingCart,
  building: Building2,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
};

export default function Industries() {
  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} w-full px-4 py-24 sm:px-6`}
      style={{ background: DesignTokens.bg }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-xl text-center md:mb-16">
          <span
            className="block text-[11px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-plex-mono)",
              color: DesignTokens.muted,
            }}
          >
            Industries — Served
          </span>
          <h2
            className="mt-3 text-4xl italic sm:text-5xl"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: DesignTokens.ink,
            }}
          >
            Where we work
          </h2>
        </div>

        {/* Industry seals */}
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {INDUSTRIES.map((industry) => {
            const Icon = ICONS[industry.icon] ?? Briefcase;
            return (
              <div
                key={industry.name}
                className="group flex flex-col items-center gap-4 px-2 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full ring-1 ring-[#2A2B31] text-[#8A8779] transition-colors duration-300 group-hover:ring-[#C9A15A]/70 group-hover:text-[#C9A15A]">
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className="text-xs italic leading-snug text-[#C9C6BA] transition-colors duration-300 group-hover:text-[#EDEAE2] sm:text-sm"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {industry.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

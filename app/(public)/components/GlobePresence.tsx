import Image from "next/image";
import { MapPin, Globe2 } from "lucide-react";
import { DesignTokens, fraunces, plexMono } from "@/lib/utils";

export default function GlobalPresence({ settings }: { settings: any }) {
  if (!settings?.offices?.length) return null;

  const offices = settings.offices as any[];

  const pinned = offices.filter((o) => o.coordinates);

  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} w-full px-4 py-24 sm:px-6`}
      style={{ background: DesignTokens.bg }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 max-w-xl md:mb-16">
          <span
            className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-plex-mono)",
              color: DesignTokens.muted,
            }}
          >
            <Globe2
              className="h-3.5 w-3.5"
              style={{ color: DesignTokens.gold }}
            />
            Network — Worldwide
          </span>
          <h2
            className="mt-3 text-4xl italic sm:text-5xl"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: DesignTokens.ink,
            }}
          >
            Our global presence
          </h2>
          <p
            className="mt-3 text-sm leading-relaxed sm:text-base"
            style={{ color: DesignTokens.body }}
          >
            Connecting teams, partners, and clients across key international
            hubs.
          </p>
        </div>

        {/* Offices + map, side by side on larger screens */}
        <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
          {/* Office list — ledger style, consistent with the rest of the site */}
          <div
            className="border-t lg:col-span-2"
            style={{ borderColor: DesignTokens.hairline }}
          >
            {offices.map((office: any, idx: number) => (
              <div
                key={office.label}
                className="flex gap-4 border-b py-5"
                style={{ borderColor: DesignTokens.hairline }}
              >
                <span
                  className="mt-1.5 w-10 shrink-0 text-[11px] tracking-[0.2em]"
                  style={{
                    fontFamily: "var(--font-plex-mono)",
                    color: DesignTokens.mutedDark,
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1"
                  style={{
                    borderColor: DesignTokens.hairline,
                    color: DesignTokens.gold,
                    boxShadow: `inset 0 0 0 1px ${DesignTokens.gold}33`,
                  }}
                >
                  <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className="italic leading-snug"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: DesignTokens.ink,
                    }}
                  >
                    {office.label}
                  </h3>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: DesignTokens.body }}
                  >
                    {office.address}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Map panel */}
          <div
            className="relative h-80 overflow-hidden rounded-sm ring-1 md:h-96 lg:col-span-3 lg:h-full lg:min-h-105"
            style={{
              background: DesignTokens.surface,
              borderColor: DesignTokens.hairline,
            }}
          >
            <Image
              src="/map-bg.webp"
              alt="World map"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain object-center opacity-80 mix-blend-luminosity"
            />
            {/* Contrast wash, then a gold tint so the map reads as part of the palette */}
            <div className="absolute inset-0 bg-black/35" />
            <div
              className="absolute inset-0"
              style={{
                background: DesignTokens.gold,
                mixBlendMode: "color",
                opacity: 0.3,
              }}
            />

            {/* Corner frame, echoing the header banner's plate motif */}
            <div className="pointer-events-none absolute inset-4 sm:inset-5">
              {[
                "left-0 top-0 border-l border-t",
                "right-0 top-0 border-r border-t",
                "bottom-0 left-0 border-b border-l",
                "bottom-0 right-0 border-b border-r",
              ].map((pos) => (
                <span
                  key={pos}
                  className={`absolute h-4 w-4 ${pos}`}
                  style={{ borderColor: `${DesignTokens.gold}80` }}
                />
              ))}
            </div>

            {/* Pins */}
            <div className="absolute inset-0 hidden md:block">
              {pinned.map((office) => (
                <div
                  key={office.label}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: office.coordinates.top,
                    left: office.coordinates.left,
                  }}
                >
                  <span
                    className="absolute -inset-2 animate-ping rounded-full"
                    style={{ background: `${DesignTokens.gold}40` }}
                  />
                  <div
                    className="relative flex items-center gap-1.5 rounded-full border px-2.5 py-1 backdrop-blur-sm"
                    style={{
                      borderColor: `${DesignTokens.gold}66`,
                      background: "rgba(16,16,20,0.75)",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: DesignTokens.gold }}
                    />
                    <span
                      className="text-[10px] tracking-wide whitespace-nowrap"
                      style={{
                        fontFamily: "var(--font-plex-mono)",
                        color: DesignTokens.ink,
                      }}
                    >
                      {office.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

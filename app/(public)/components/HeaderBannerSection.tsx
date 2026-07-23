import { cn, DesignTokens, fraunces, plexMono } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

export interface HeaderBannerProps {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  subtitle?: string;
  extraInfo?: ReactNode;
  heightClass?: string;
  overlayClass?: string;
}

export default function HeaderBannerSection({
  title,
  imageSrc,
  imageAlt = "Header background image",
  subtitle,
  extraInfo,
  heightClass = "h-[340px] md:h-[440px]",
  overlayClass = "bg-gradient-to-t from-black/90 via-black/45 to-black/10",
}: HeaderBannerProps) {
  return (
    <div
      className={`${fraunces.variable} ${plexMono.variable} w-full overflow-hidden`}
    >
      <div
        className={`relative ${heightClass}`}
        style={{ background: DesignTokens.bg }}
      >
        {/* Background image */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Directional scrim for text legibility */}
        <div className={cn("absolute inset-0 z-10", overlayClass)} />

        {/* Vignette for depth */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Corner frame — plate/specimen-label motif shared with the rest of the site */}
        <div className="pointer-events-none absolute inset-4 z-20 sm:inset-6">
          <span
            className="absolute left-0 top-0 h-5 w-5 border-l border-t"
            style={{ borderColor: `${DesignTokens.gold}B3` }}
          />
          <span
            className="absolute right-0 top-0 h-5 w-5 border-r border-t"
            style={{ borderColor: `${DesignTokens.gold}B3` }}
          />
          <span
            className="absolute bottom-0 left-0 h-5 w-5 border-b border-l"
            style={{ borderColor: `${DesignTokens.gold}B3` }}
          />
          <span
            className="absolute bottom-0 right-0 h-5 w-5 border-b border-r"
            style={{ borderColor: `${DesignTokens.gold}B3` }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 mx-auto flex h-full w-full max-w-4xl flex-col justify-center px-6 sm:px-8">
          <div className="max-w-3xl space-y-4">
            {/* Gold marker rule */}
            <span
              className="block h-px w-10"
              style={{ background: DesignTokens.gold }}
            />

            <h1
              className="text-3xl italic leading-tight sm:text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-fraunces)",
                color: DesignTokens.ink,
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className="max-w-xl text-base leading-relaxed sm:text-lg"
                style={{ color: DesignTokens.body }}
              >
                {subtitle}
              </p>
            )}

            {extraInfo && <div className="pt-2">{extraInfo}</div>}
          </div>
        </div>

        {/* Bottom hairline — the same transition device used between sections sitewide */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${DesignTokens.gold}99, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

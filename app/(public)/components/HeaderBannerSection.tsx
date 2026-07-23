import { cn } from "@/lib/utils";
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
  heightClass = "h-[300px] md:h-[400px]",
  overlayClass = "bg-black/50",
}: HeaderBannerProps) {
  return (
    <div className="w-full overflow-hidden">
      <div className={`relative ${heightClass}`}>
        {/* Background Image */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className={cn("absolute inset-0 z-10", overlayClass)} />

        <div className="w-full md:max-w-4xl relative z-20 mx-auto flex h-full flex-col justify-center text-white">
          <div className="max-w-3xl space-y-3">
            {/* Main Title */}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>

            {/* Subtitle (Optional) */}
            {subtitle && (
              <p className="text-base font-normal text-zinc-200 sm:text-lg md:text-xl">
                {subtitle}
              </p>
            )}

            {/* Custom Extra Info / Slots (Optional) */}
            {extraInfo && <div className="pt-2">{extraInfo}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const PAGE_BG = "#101014";

export default function Services({ services }: { services: any }) {
  if (!services?.length) return null;

  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} relative py-24 px-4 sm:px-6 bg-page-bg`}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 md:mb-16 max-w-xl">
          <span
            className="block text-[11px] tracking-[0.25em] text-[#8A8779] uppercase"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            Capabilities — Itemized
          </span>
          <h2
            className="mt-3 text-4xl sm:text-5xl text-[#EDEAE2] italic"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            What we build
          </h2>
          <p className="mt-3 text-sm text-[#8A8779] leading-relaxed">
            Everything you need to build and grow your digital presence, under
            one roof — priced up front, no surprises.
          </p>
        </div>

        {/* Manifest grid */}
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service: any, idx: number) => {
            const inclusions: string[] = service.inclusions ?? [];
            const shown = inclusions.slice(0, 4);
            const extra = inclusions.length - shown.length;

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative flex flex-col rounded-sm bg-[#15161B] ring-1 ring-[#2A2B31] transition-colors hover:ring-[#C9A15A]/60"
              >
                {/* Stub header */}
                <div className="relative flex items-center justify-between px-5 pt-4 pb-3">
                  <span
                    className="text-[11px] tracking-[0.2em] text-[#5C5A50]"
                    style={{ fontFamily: "var(--font-plex-mono)" }}
                  >
                    No. {String(service.order ?? idx + 1).padStart(2, "0")}
                  </span>
                  {service.isCombo && (
                    <span
                      className="text-[10px] tracking-[0.15em] text-[#C9A15A] border border-[#C9A15A]/40 rounded-full px-2 py-0.5"
                      style={{ fontFamily: "var(--font-plex-mono)" }}
                    >
                      BUNDLE
                    </span>
                  )}
                </div>

                {/* Perforation */}
                <div className="relative">
                  <div className="border-t border-dashed border-[#2A2B31]" />
                  <span className="absolute -left-1.75 -top-1.75 h-3.5 w-3.5 rounded-full bg-page-bg" />
                  <span className="absolute -right-1.75 -top-1.75 h-3.5 w-3.5 rounded-full bg-page-bg" />
                </div>

                {/* Body */}
                <div className="flex-1 px-5 pt-5 pb-4">
                  <h3
                    className="text-lg leading-snug text-[#EDEAE2] italic"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {service.name}
                  </h3>

                  {shown.length > 0 ? (
                    <ul className="mt-4 space-y-1.5">
                      {shown.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-xs text-[#8A8779]"
                          style={{ fontFamily: "var(--font-plex-mono)" }}
                        >
                          <span className="text-[#C9A15A]">—</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                      {extra > 0 && (
                        <li
                          className="text-xs text-[#5C5A50] pl-4"
                          style={{ fontFamily: "var(--font-plex-mono)" }}
                        >
                          +{extra} more
                        </li>
                      )}
                    </ul>
                  ) : (
                    service.shortDescription && (
                      <p className="mt-3 text-xs text-[#8A8779] leading-relaxed line-clamp-3">
                        {service.shortDescription}
                      </p>
                    )
                  )}
                </div>

                {/* Perforation */}
                <div className="relative">
                  <div className="border-t border-dashed border-[#2A2B31]" />
                  <span className="absolute -left-1.75 -top-1.75 h-3.5 w-3.5 rounded-full bg-page-bg" />
                  <span className="absolute -right-1.75 -top-1.75 h-3.5 w-3.5 rounded-full bg-page-bg" />
                </div>

                {/* Price footer */}
                <div className="flex items-center justify-between px-5 py-4">
                  <span
                    className="text-xl text-[#EDEAE2]"
                    style={{ fontFamily: "var(--font-plex-mono)" }}
                  >
                    ${service.priceLabel}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] tracking-wide text-[#8A8779] transition-colors group-hover:text-[#C9A15A]">
                    View
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#EDEAE2] border-b border-[#2A2B31] pb-1 transition-colors hover:border-[#C9A15A] hover:text-[#C9A15A]"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            View full manifest
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

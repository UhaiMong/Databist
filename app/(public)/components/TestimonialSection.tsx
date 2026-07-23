import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";

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

interface Testimonial {
  _id: string;
  quote: string;
  rating: number;
  clientName: string;
  avatar?: string;
  clientRole?: string;
  companyName?: string;
}

function RatingSeal({ rating, max = 5 }: { rating: number; max?: number }) {
  const size = 64;
  const stroke = 1.5;
  const r = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, rating / max));
  const filled = circumference * pct;

  return (
    <div
      className="relative shrink-0 flex items-center justify-center rounded-full bg-[#0E0F13]"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#2A2B31"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#C9A15A"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>
      <span
        className="absolute text-[13px] tracking-tight text-[#EDEAE2]"
        style={{ fontFamily: "var(--font-plex-mono)" }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function TestimonialSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} relative bg-[#101014] py-24 px-4 sm:px-6`}
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <span
            className="block text-[11px] tracking-[0.25em] text-[#8A8779] uppercase"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            Correspondence — Verified
          </span>
          <h2
            className="mt-3 text-4xl sm:text-5xl text-[#EDEAE2] italic"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Entries from the field
          </h2>
          <p className="mt-3 max-w-md text-sm text-[#8A8779] leading-relaxed">
            A running log of what clients have told us, dated and kept exactly
            as received.
          </p>
        </div>

        {/* Log */}
        {testimonials.length > 0 ? (
          <div className="relative">
            {/* spine */}
            <div className="absolute left-8 top-2 bottom-2 w-px bg-[#2A2B31]" />

            <ul>
              {testimonials.map((t: any, idx: number) => (
                <li key={t._id} className="relative pb-14 last:pb-0">
                  <div className="flex gap-6 md:gap-8">
                    <RatingSeal rating={t.rating} />

                    <div className="flex-1 min-w-0 pt-1">
                      <span
                        className="block text-[11px] tracking-[0.2em] text-[#5C5A50] uppercase mb-3"
                        style={{ fontFamily: "var(--font-plex-mono)" }}
                      >
                        No. {String(idx + 1).padStart(2, "0")}
                      </span>

                      <p
                        className="text-xl sm:text-[22px] leading-normal text-[#EDEAE2]/90 italic"
                        style={{ fontFamily: "var(--font-fraunces)" }}
                      >
                        <span className="text-[#C9A15A] not-italic mr-0.5">
                          &ldquo;
                        </span>
                        {t.quote}
                        <span className="text-[#C9A15A] not-italic ml-0.5">
                          &rdquo;
                        </span>
                      </p>

                      <div className="mt-5 flex items-center gap-3">
                        {t.avatar ? (
                          <Image
                            src={t.avatar}
                            alt={t.clientName}
                            width={36}
                            height={36}
                            loading="eager"
                            className="rounded-full object-cover object-center ring-1 ring-[#2A2B31]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#1B1C21] ring-1 ring-[#2A2B31] flex items-center justify-center">
                            <span
                              className="text-[11px] text-[#8A8779]"
                              style={{ fontFamily: "var(--font-plex-mono)" }}
                            >
                              {t.clientName?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div
                          className="text-xs tracking-wide"
                          style={{ fontFamily: "var(--font-plex-mono)" }}
                        >
                          <span className="text-[#EDEAE2]">{t.clientName}</span>
                          {(t.clientRole || t.companyName) && (
                            <span className="text-[#8A8779]">
                              {"  —  "}
                              {t.clientRole}
                              {t.clientRole && t.companyName ? ", " : ""}
                              {t.companyName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p
            className="text-sm text-[#5C5A50]"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            No entries logged yet.
          </p>
        )}
      </div>
    </section>
  );
}

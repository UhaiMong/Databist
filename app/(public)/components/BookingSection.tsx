import BookingWidget from "@/app/components/public/booking/BookingWidget";
import { DesignTokens, fraunces, plexMono } from "@/lib/utils";

export default function BookingSection() {
  return (
    <section
      id="booking"
      className={`${fraunces.variable} ${plexMono.variable} w-full px-4 py-24 sm:px-6`}
      style={{ background: DesignTokens.bg }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center md:mb-14">
          <span
            className="block text-[11px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-plex-mono)",
              color: DesignTokens.muted,
            }}
          >
            Consultation — By Appointment
          </span>
          <h2
            className="mt-3 text-4xl italic sm:text-5xl"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: DesignTokens.ink,
            }}
          >
            Book a free consultation
          </h2>
          <p
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed sm:text-base"
            style={{ color: DesignTokens.body }}
          >
            Pick a time that works for you — no back-and-forth emails.
          </p>
        </div>

        {/* Framed panel around the widget — same plate motif used across the site */}
        <div
          className="relative overflow-hidden rounded-sm ring-1"
          style={{
            background: DesignTokens.surface,
            borderColor: DesignTokens.hairline,
          }}
        >
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

          {/* Top hairline accent */}
          <div
            className="h-px w-full"
            style={{
              background: `linear-gradient(to right, transparent, ${DesignTokens.gold}99, transparent)`,
            }}
          />

          <div className="p-6 sm:p-10">
            <BookingWidget />
          </div>
        </div>
      </div>
    </section>
  );
}

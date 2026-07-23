import Image from "next/image";
import { MapPin, Building2, Globe2 } from "lucide-react";

// Example pinned locations overlaid on top of world map image
const MAP_LOCATIONS = [
  { name: "New York", top: "35%", left: "25%" },
  { name: "London", top: "28%", left: "48%" },
  { name: "Tokyo", top: "38%", left: "82%" },
  { name: "Sydney", top: "72%", left: "88%" },
];

export default function GlobalPresence({ settings }: { settings: any }) {
  if (!settings?.offices?.length) return null;

  return (
    <section className="py-20 bg-background">
      {/* Content Container */}
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center space-y-3">
          <h2 className="text-xl font-bold tracking-tight md:text-3xl">
            Our Global Presence
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Connecting teams, partners, and clients across key international
            hubs.
          </p>
        </div>

        {/* Office Cards Grid */}
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {settings.offices.map((office: any) => (
            <div
              key={office.label}
              className="group relative flex gap-4 rounded-xl border border-border/60 bg-background/80 p-6 backdrop-blur-md shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-foreground leading-none pt-0.5">
                  {office.label}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                  {office.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* World Map */}
      <div className="relative -mt-30 h-80 md:h-112.5 lg:h-130 w-full overflow-hidden bg-linear-to-t from-brand/70 via-brand-dark/50 to-brand/90">
        <Image
          src="/map-bg.webp"
          alt="Global map"
          fill
          priority
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain object-center"
        />

        {/* Location Pins */}
        <div className="absolute inset-0 hidden md:block">
          {MAP_LOCATIONS.map((loc) => (
            <div
              key={loc.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ top: loc.top, left: loc.left }}
            >
              <span className="absolute -inset-2 rounded-full bg-primary/30 animate-ping" />

              <div className="relative flex items-center gap-2 rounded-full border bg-background/90 px-3 py-1 shadow-lg backdrop-blur">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium">{loc.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

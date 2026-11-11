import Image from "next/image";
import Link from "next/link";

type Partner = {
  name: string;
  logoUrl: string;
  url?: string;
};

export default function PartnersStrip({ partners }: { partners: Partner[] }) {
  const items = partners.filter((p) => p.name && p.logoUrl);
  if (items.length === 0) return null;

  return (
    <section className="border-y bg-muted/20 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by teams we build with
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {items.map((partner) => {
            const logo = (
              <Image
                src={partner.logoUrl}
                alt={partner.name}
                width={140}
                height={48}
                className="h-10 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            );

            return (
              <li key={`${partner.name}-${partner.logoUrl}`}>
                {partner.url ? (
                  <Link
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={partner.name}
                  >
                    {logo}
                  </Link>
                ) : (
                  logo
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

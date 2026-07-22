import Link from "next/link";
import { Heading } from "./DynamicHeading";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Services({ services }: { services: any }) {
  if (services.length < 0) return null;
  return (
    <section className="container mx-auto px-4 py-16">
      <Heading
        title="We Offering"
        titleClassName="text-center"
        subTitleClassName="text-center"
        subTitle="Everything you need to build and grow your digital presence, under
            one roof."
        className="mx-auto"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service: any) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group rounded-lg border p-6 transition-shadow hover:shadow-md"
          >
            <h3 className="font-semibold">{service.name}</h3>
            <p className="mt-1 text-sm font-medium text-primary">
              $ {service.priceLabel}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {service.shortDescription}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button asChild variant="link" className="bg-brand text-slate-50">
          <Link href="/services">
            View All Services <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

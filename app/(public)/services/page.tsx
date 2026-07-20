import { Metadata } from "next";
import Link from "next/link";
import connectDB from "@/lib/db/connectDB";
import { ServicePackage } from "@/lib/models";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export const metadata: Metadata = {
  title: "Our Services | Digital Resolution",
  description:
    "Website development, graphic design, content writing, SEO, video ads, social media, and digital marketing packages.",
};

export const revalidate = 60;

async function getServices() {
  await connectDB();
  const services = await ServicePackage.find({ status: "published" })
    .sort({ order: 1 })
    .lean();
  return JSON.parse(JSON.stringify(services));
}

export default async function ServicesPage() {
  const services = await getServices();
  const combo = services.find((s: any) => s.isCombo);
  const regular = services.filter((s: any) => !s.isCombo);

  return (
    <section className="container mx-auto px-4 py-16 mt-7">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Our Service Packages
        </h1>
        <p className="mt-3 text-muted-foreground">
          Straightforward, project-based pricing across every service you need
          to grow — pick one package or bundle them together.
        </p>
      </div>

      {combo && (
        <Card className="mb-10 border-primary bg-primary/5">
          <CardHeader>
            <Badge className="w-fit">Best Value</Badge>
            <CardTitle className="text-2xl">{combo.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-lg font-semibold">{combo.priceLabel}</p>
              <p className="mt-1 text-muted-foreground">
                {combo.shortDescription}
              </p>
            </div>
            <Button asChild>
              <Link href={`/services/${combo.slug}`}>
                View Bundle <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {regular.map((service: any) => (
          <Card key={service.slug} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <p className="text-sm font-medium text-primary">
                {service.priceLabel}
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {service.shortDescription}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/services/${service.slug}`}>
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/booking">
            Not sure which package fits? Book a Consultation
          </Link>
        </Button>
      </div>
    </section>
  );
}

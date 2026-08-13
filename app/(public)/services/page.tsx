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
import { ArrowRight, Link2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import HeaderBannerSection from "../components/HeaderBannerSection";
import { CTA } from "../components/CTA";

export const metadata: Metadata = {
  title: "Our Services | Databist",
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
    <section className="mt-16 bg-page-bg text-ink">
      <HeaderBannerSection
        title="What we provide you"
        subtitle="Choice one, visulaize your brand in the world"
        imageSrc="/serviceBanner.jpg"
        overlayClass="bg-linear-to-b from-brand/30 via-brand-dark/40 to-brand/70"
      />
      <div className="mx-auto mb-7 max-w-2xl text-center mt-4 py-3.5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl inline-block bg-linear-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          Our Service Packages
        </h1>
        <p className="mt-3 text-muted-foreground">
          Straightforward, project-based pricing across every service you need
          to grow — pick one package or bundle them together.
        </p>
      </div>

      <div className="container md:max-w-5xl w-full mx-auto px-4 py-16 ">
        {combo && (
          <Card className="mb-10 bg-page-bg/90 text-ink shadow-2xl p-4">
            <CardHeader>
              <Badge className="w-fit bg-linear-to-r from-indigo-500 to-pink-500">
                Best Value
              </Badge>
              <CardTitle className="text-2xl">{combo.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mt-1">{combo.shortDescription}</p>
              </div>
              <Button
                className="bg-linear-to-r from-indigo-500 to-pink-500"
                asChild
              >
                <Link href={`/services/${combo.slug}`}>
                  View Bundle <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regular.map((service: any) => (
            <Card
              key={service.slug}
              className="flex flex-col justify-between bg-page-bg/90 shadow-2xl text-ink"
            >
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  {service.shortDescription}
                </p>
                <Button
                  asChild
                  variant="default"
                  className="w-full bg-linear-to-r from-indigo-500 to-pink-500"
                >
                  <Link href={`/services/${service.slug}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <CTA />
      </div>
    </section>
  );
}

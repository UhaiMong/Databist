import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db/connectDB";
import { ServicePackage } from "@/lib/models";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";
import FaqAccordion from "@/app/components/public/faq/FaqAccordion";
import HeaderBannerSection from "../../components/HeaderBannerSection";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  await connectDB();
  const service = await ServicePackage.findOne({
    slug,
    status: "published",
  }).lean();
  return service ? JSON.parse(JSON.stringify(service)) : null;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) return { title: "Service Not Found | Digital Resolution" };

  return {
    title: `${service.name} | Digital Resolution`,
    description: service.shortDescription,
  };
}

export const revalidate = 60;

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  return (
    <section className="mt-16">
      <HeaderBannerSection
        title={service?.name}
        subtitle={service?.shortDescription}
        imageSrc={service?.heroImage}
        heightClass="h-[450px] md:h-[500px]"
        overlayClass="bg-linear-to-b from-brand/30 via-brand-dark/40 to-brand/70"
      />
      <article className="container mx-auto px-4 py-3.5 mt-4">
        <div className="mx-auto max-w-3xl">
          {service.isCombo && (
            <Badge className="mb-3 bg-brand text-slate-50">Best Value</Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {service.name}
          </h1>
          <p className="mt-2 text-2xl font-bold text-primary">
            $ {service.priceLabel}
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            {service.shortDescription}
          </p>

          <Button asChild size="lg" className="mt-6 bg-brand text-slate-50">
            <Link href={`/booking?service=${encodeURIComponent(service.name)}`}>
              Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <div className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold">About This Package</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {service.longDescription}
            </p>
          </div>

          {service.inclusions?.length > 0 && (
            <div className="mt-12 space-y-4">
              <h2 className="text-2xl font-semibold">What&apos;s Included</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.inclusions.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.processSteps?.length > 0 && (
            <div className="mt-12 space-y-4">
              <h2 className="text-2xl font-semibold">How It Works</h2>
              <ol className="space-y-4">
                {service.processSteps.map((step: any, i: number) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {service.faqs?.length > 0 && (
            <div className="mt-12 space-y-4">
              <h2 className="text-2xl font-semibold">
                Frequently Asked Questions
              </h2>
              <FaqAccordion items={service.faqs} />
            </div>
          )}

          <div className="mt-12 rounded-lg border bg-muted/40 p-8 text-center">
            <h2 className="text-xl font-semibold">
              Ready to get started with {service.name}?
            </h2>
            <Button
              asChild
              variant="link"
              size="lg"
              className="mt-4 bg-brand text-primary-foreground"
            >
              <Link
                href={`/booking?service=${encodeURIComponent(service.name)}`}
              >
                Book a Free Consultation
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}

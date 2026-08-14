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
import CTA from "@/app/components/public/button/CTA";
import { phone, whatsApp } from "@/lib/constant";

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

  if (!service) return { title: "Service Not Found | Databist" };

  return {
    title: `${service.name} | Databist`,
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
    <section className="mt-16 bg-page-bg text-ink">
      <HeaderBannerSection
        title={service?.name}
        subtitle={service?.shortDescription}
        imageSrc={service?.heroImage}
        heightClass="h-[450px] md:h-[500px]"
        overlayClass="bg-linear-to-b from-brand/30 via-brand-dark/40 to-brand/70"
      />
      <div className="max-w-7xl mx-auto px-4 py-3.5 mt-4">
        <div className="w-full">
          {service.isCombo && (
            <Badge className="mb-3 bg-brand text-slate-50">Best Value</Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {service.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {service.shortDescription}
          </p>

          <Button
            asChild
            size="lg"
            className="mt-6 bg-brand text-slate-50 bg-linear-to-r from-indigo-500 to-pink-500"
          >
            <Link
              href={`/booking?serviceId=${encodeURIComponent(service._id)}`}
            >
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
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
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
              <div className="flex justify-between">
                <div>
                  <strong className="text-[#A431FF]">FAQ_</strong>
                  <h2 className="text-2xl font-semibold">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div>
                  <h2>Not found here?</h2>
                  <a href="tel:+8801516341885">Call</a>
                </div>
              </div>
              <FaqAccordion items={service.faqs} />
            </div>
          )}

          <CTA
            styleCall="bg-primary"
            styleWhatsApp="bg-green-800 text-white hover:bg-green-500 hover:text-white transaction-colors duration-300 px-3"
            service={service}
            contactNo={phone}
            whatsappNo={whatsApp}
            imageUrl="/contact.jpg"
          />
        </div>
      </div>
    </section>
  );
}

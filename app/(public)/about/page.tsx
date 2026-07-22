import { Metadata } from "next";
import Link from "next/link";
import connectDB from "@/lib/db/connectDB";
import { SiteSettings } from "@/lib/models";
import { Button } from "@/app/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import TrustTrip from "../components/TrustStrip";
import HeaderBannerSection from "../components/HeaderBannerSection";

export const metadata: Metadata = {
  title: "About Us | Digital Resolution",
  description:
    "Digital Resolution is a full-service digital marketing and web development agency serving clients in Bangladesh, the UAE, and beyond.",
};

export const revalidate = 60;

const MILESTONES = [
  { label: "Years in Operation", value: "6+" },
  { label: "Clients Served", value: "150+" },
  { label: "Countries Served", value: "10+" },
  { label: "Projects Delivered", value: "300+" },
];

async function getOffices() {
  await connectDB();
  const settings = await SiteSettings.findOne({ key: "global" })
    .select("offices")
    .lean();
  return settings ? (JSON.parse(JSON.stringify(settings)).offices ?? []) : [];
}

export default async function AboutUsPage() {
  const offices = await getOffices();

  return (
    <section className="mt-16">
      <HeaderBannerSection
        title="Digital Resolution"
        subtitle="Connecting offices and clients worldwide"
        imageSrc="/aboutBanner.jpg"
        overlayClass="bg-linear-to-b from-brand/30 via-brand-dark/40 to-brand/70"
      />
      <div className="mx-auto max-w-3xl text-center mt-4 py-3.5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl inline-block bg-linear-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          About Digital Resolution
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A full-service digital marketing and web development agency helping
          businesses across Bangladesh, the UAE, and beyond build a stronger
          digital presence — from websites and branding to SEO and paid growth.
        </p>
      </div>

      <TrustTrip />
      <div className="mx-auto mt-16 max-w-3xl space-y-4">
        <h2 className="text-2xl font-semibold">
          Why Choose Digital Resolution
        </h2>
        <p className="text-muted-foreground">
          We combine project-based pricing with senior-level execution across
          web development, design, content, and marketing — so clients get one
          accountable team instead of juggling multiple vendors. Every
          engagement is built around measurable outcomes, not just deliverables.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="mb-6 text-center text-2xl font-semibold">We located_</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {offices.map((office: any) => (
            <div
              key={office.label}
              className="flex gap-4 rounded-lg border p-6"
            >
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">{office.label} Office</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {office.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-lg border bg-muted/40 p-8 text-center">
        <h2 className="text-xl font-semibold">Ready to work together?</h2>
        <Button asChild size="lg" className="mt-4">
          <Link href="/booking">
            Book a Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

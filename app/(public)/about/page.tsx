import { Metadata } from "next";
import Link from "next/link";
import connectDB from "@/lib/db/connectDB";
import { SiteSettings } from "@/lib/models";
import { Button } from "@/app/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import HeaderBannerSection from "../components/HeaderBannerSection";
import OrgChart from "@/app/components/public/about/OrgChart";
import CTA from "@/app/components/public/button/CTA";
import { phone, whatsApp } from "@/lib/constant";

export const metadata: Metadata = {
  title: "About Us | Databist",
  description:
    "Databist is a full-service digital marketing and web development agency serving clients in Bangladesh, the UAE, and beyond.",
};

export const revalidate = 60;

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
    <section className="mt-16 bg-page-bg text-ink">
      <HeaderBannerSection
        title="About Us"
        subtitle="A full-service digital agency helping businesses across Bangladesh, the UAE, and beyond build a stronger digital presence."
        imageSrc="/aboutBanner.jpg"
        overlayClass="bg-app-bg/50"
      />

      <OrgChart />

      <div className="mx-auto max-w-3xl space-y-4 py-4 mt-3.5 px-4">
        <h2 className="text-2xl font-semibold">Why Choose Databist</h2>
        <p className="text-muted-foreground">
          We combine project-based pricing with senior-level execution across
          web development, design, content, and marketing — so clients get one
          accountable team instead of juggling multiple vendors. Every
          engagement is built around measurable outcomes, not just deliverables.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-4xl px-4">
        <h2 className="text-center text-2xl font-semibold my-2.5">
          Where We Connect
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {offices.map((office: any) => (
            <div
              key={office.label}
              className="flex gap-4 rounded-lg border p-6"
            >
              <MapPin className="mt-1 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">{office.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {office.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full bg-page-bg border border-transparent">
        <CTA
          styleCall="bg-primary"
          styleWhatsApp="bg-green-800 text-white hover:bg-green-500 hover:text-white transaction-colors duration-300 px-3"
          contactNo={phone}
          whatsappNo={whatsApp}
          imageUrl="/contact.jpg"
        />
      </div>
    </section>
  );
}

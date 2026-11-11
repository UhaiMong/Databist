import { Metadata } from "next";
import BookingWidget from "@/app/components/public/booking/BookingWidget";
import HeaderBannerSection from "../components/HeaderBannerSection";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Book a Free Consultation",
  description:
    "Pick a time that works for you — no back-and-forth emails. Book a free consultation with Databist.",
  path: "/booking",
  image: "/blogBanner.jpg",
});

interface BookingPageProps {
  searchParams: Promise<{ serviceId?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { serviceId } = await searchParams;

  return (
    <section className="mt-16 bg-page-bg text-ink">
      <HeaderBannerSection
        title="Book a Free Consultation"
        subtitle="Pick a time that works for you — no back-and-forth emails."
        imageSrc="/blogBanner.jpg"
        overlayClass="bg-linear-to-b from-brand/70 via-brand-dark/80 to-brand/90"
      />
      <div className="w-full py-8">
        <BookingWidget defaultServiceId={serviceId} />
      </div>
    </section>
  );
}

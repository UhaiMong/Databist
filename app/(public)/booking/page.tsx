import { Metadata } from "next";
import BookingWidget from "@/app/components/public/booking/BookingWidget";
import HeaderBannerSection from "../components/HeaderBannerSection";

export const metadata: Metadata = {
  title: "Book a Free Consultation | Databist",
  description:
    "Pick a time that works for you — no back-and-forth emails. Book a free consultation with Databist.",
};

interface BookingPageProps {
  searchParams: Promise<{ serviceId?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { serviceId } = await searchParams;

  return (
    <section className="mt-16 bg-page-bg text-ink">
      <HeaderBannerSection
        title="Book A Demo"
        subtitle="Be a part of Databist"
        imageSrc="/blogBanner.jpg"
        overlayClass="bg-linear-to-b from-brand/70 via-brand-dark/80 to-brand/90"
      />
      <div className="w-full py-3.5">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Book a Free Consultation
          </h1>
          <p className="mt-3 text-muted-foreground">
            Pick a time that works for you — no back-and-forth emails.
          </p>
        </div>

        <BookingWidget defaultServiceId={serviceId} />
      </div>
    </section>
  );
}

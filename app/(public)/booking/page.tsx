import { Metadata } from "next";
import BookingWidget from "@/app/components/public/booking/BookingWidget";

export const metadata: Metadata = {
  title: "Book a Free Consultation | Digital Resolution",
  description:
    "Pick a time that works for you — no back-and-forth emails. Book a free consultation with Digital Resolution.",
};

interface BookingPageProps {
  searchParams: Promise<{ serviceId?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { serviceId } = await searchParams;

  return (
    <section className="container mx-auto px-4 py-16 mt-7">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Book a Free Consultation
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pick a time that works for you — no back-and-forth emails.
        </p>
      </div>

      <BookingWidget defaultServiceId={serviceId} />
    </section>
  );
}

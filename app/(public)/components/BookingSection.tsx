import BookingWidget from "@/app/components/public/booking/BookingWidget";

export default function BookingSection() {
  return (
    <section id="booking" className="container mx-auto px-4 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Book a Free Consultation
        </h2>
        <p className="mt-3 text-muted-foreground">
          Pick a time that works for you — no back-and-forth emails.
        </p>
      </div>
      <BookingWidget />
    </section>
  );
}

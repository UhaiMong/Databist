import connectDB from "@/lib/db/connectDB";
import { Testimonial } from "@/lib/models";
import TestimonialManager from "@/app/components/dashboard/testimonials/TestimonialManager";

export const metadata = {
  title: "Testimonial Management | Digital Resolution",
};

async function getTestimonials() {
  await connectDB();
  const testimonials = await Testimonial.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(testimonials));
}

export default async function DashboardTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Testimonial Management
        </h1>
        <p className="text-muted-foreground">
          Manage client quotes shown on the homepage and service pages.
        </p>
      </div>

      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  );
}

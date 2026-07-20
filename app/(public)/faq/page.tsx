import { Metadata } from "next";
import connectDB from "@/lib/db/connectDB";
import { FaqGlobal } from "@/lib/models";
import FaqPageClient from "@/app/components/public/faq/FaqPageClient";

export const metadata: Metadata = {
  title: "FAQ | Digital Resolution",
  description:
    "Answers to common questions about our services, pricing, delivery timelines, support, and engagement models.",
};

export const revalidate = 60;

async function getFaqs() {
  await connectDB();
  const faqs = await FaqGlobal.find({ isPublished: true })
    .sort({ category: 1, order: 1 })
    .lean();
  return JSON.parse(JSON.stringify(faqs));
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <section className="container mx-auto px-4 py-16 mt-7">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Everything you need to know about working with Digital Resolution.
        </p>
      </div>

      <FaqPageClient faqs={faqs} />
    </section>
  );
}

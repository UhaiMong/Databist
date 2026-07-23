import { Metadata } from "next";
import connectDB from "@/lib/db/connectDB";
import { Portfolio } from "@/lib/models";
import PortfolioGrid from "@/app/components/public/portfolio/PortfolioGrid";
import HeaderBannerSection from "../components/HeaderBannerSection";

export const metadata: Metadata = {
  title: "Portfolio | Digital Resolution",
  description:
    "Case studies and past work from Digital Resolution across web, design, and marketing.",
};

export const revalidate = 60;

async function getPortfolioItems() {
  await connectDB();
  const items = await Portfolio.find({ status: "completed" })
    .sort({ order: 1 })
    .lean();
  return JSON.parse(JSON.stringify(items));
}

export default async function PortfolioPage() {
  const items = await getPortfolioItems();

  return (
    <section className="mt-16">
      <HeaderBannerSection
        title="To Visualize Development"
        subtitle="Seamless visualization of your thinking"
        imageSrc="/portfolioBanner.jpg"
        overlayClass="bg-linear-to-b from-brand/30 via-brand-dark/40 to-brand/70"
      />
      <div className="mx-auto mb-10 max-w-2xl text-center py-3.5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl inline-block bg-linear-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          Our Impact
        </h1>
        <p className="mt-3 text-muted-foreground">
          A selection of projects across web development, design, and marketing.
        </p>
      </div>
      <div className="container mx-auto px-4 py-16">
        <PortfolioGrid items={items} />
      </div>
    </section>
  );
}

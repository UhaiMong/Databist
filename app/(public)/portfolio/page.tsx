import { Metadata } from "next";
import connectDB from "@/lib/db/connectDB";
import { Portfolio } from "@/lib/models";
import PortfolioGrid from "@/app/components/public/portfolio/PortfolioGrid";
import HeaderBannerSection from "../components/HeaderBannerSection";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Portfolio",
  description:
    "Case studies and past work from Databist across web, design, and marketing.",
  path: "/portfolio",
  image: "/portfolioBanner.jpg",
});

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
    <section className="mt-16 bg-page-bg text-ink">
      <HeaderBannerSection
        title="Our Work"
        subtitle="A selection of projects across web development, design, and marketing."
        imageSrc="/portfolioBanner.jpg"
        overlayClass="bg-linear-to-b from-brand/30 via-brand-dark/40 to-brand/70"
      />
      <div className="container mx-auto px-4 py-7">
        <PortfolioGrid items={items} />
      </div>
    </section>
  );
}

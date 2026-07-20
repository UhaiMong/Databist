import { Metadata } from "next";
import connectDB from "@/lib/db/connectDB";
import { Portfolio } from "@/lib/models";
import PortfolioGrid from "@/app/components/public/portfolio/PortfolioGrid";

export const metadata: Metadata = {
  title: "Portfolio | Digital Resolution",
  description:
    "Case studies and past work from Digital Resolution across web, design, and marketing.",
};

export const revalidate = 60;

async function getPortfolioItems() {
  await connectDB();
  const items = await Portfolio.find({ status: "published" })
    .sort({ order: 1 })
    .lean();
  return JSON.parse(JSON.stringify(items));
}

export default async function PortfolioPage() {
  const items = await getPortfolioItems();

  return (
    <section className="container mx-auto px-4 py-16 mt-7">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Our Impact
        </h1>
        <p className="mt-3 text-muted-foreground">
          A selection of projects across web development, design, and marketing.
        </p>
      </div>

      <PortfolioGrid items={items} />
    </section>
  );
}

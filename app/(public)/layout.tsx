import connectDB from "@/lib/db/connectDB";
import { PublicFooter } from "../components/public/shared/footer";
import { PublicNavbar } from "../components/public/shared/navbar";
import ScrollToTopButton from "../components/public/shared/ScrollToTopButton";
import WhatsAppButton from "../components/public/shared/whatsAppButton";
import { Portfolio, ServicePackage } from "@/lib/models";

async function getData() {
  await connectDB();

  const [services, portfolioItems] = await Promise.all([
    ServicePackage.find({ status: "published" })
      .sort({ order: 1 })
      .limit(8)
      .lean(),
    Portfolio.find({ status: "completed" }).sort({ order: 1 }).limit(12).lean(),
  ]);

  // Strip down to ONLY what the client needs to minimize payload size
  const mappedServices = services.map((s) => ({
    _id: s._id.toString(),
    title: s.name,
    slug: s.slug,
  }));

  const mappedWorks = portfolioItems.map((w) => ({
    _id: w._id.toString(),
    title: w.title,
    slug: w.slug,
  }));

  return { services: mappedServices, works: mappedWorks };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { services, works } = await getData();
  return (
    <div className="flex flex-col min-h-screen bg-page-bg/10">
      <PublicNavbar services={services} works={works} />
      <main className="flex-1 pt-16 lg:pt-[72px]">
        {children}
        <ScrollToTopButton />
        <WhatsAppButton />
      </main>
      <PublicFooter />
    </div>
  );
}

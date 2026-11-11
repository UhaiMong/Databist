import connectDB from "@/lib/db/connectDB";
import { PublicFooter } from "../components/public/shared/footer";
import { PublicNavbar } from "../components/public/shared/navbar";
import ScrollToTopButton from "../components/public/shared/ScrollToTopButton";
import WhatsAppButton from "../components/public/shared/whatsAppButton";
import JsonLd from "../components/seo/JsonLd";
import { Portfolio, ServicePackage, SiteSettings } from "@/lib/models";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

async function getData() {
  await connectDB();

  const [services, portfolioItems, settings] = await Promise.all([
    ServicePackage.find({ status: "published" })
      .sort({ order: 1 })
      .limit(8)
      .lean(),
    Portfolio.find({ status: "completed" }).sort({ order: 1 }).limit(12).lean(),
    SiteSettings.findOne({ key: "global" }).lean(),
  ]);

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

  const plainSettings = settings
    ? JSON.parse(JSON.stringify(settings))
    : null;

  return {
    services: mappedServices,
    works: mappedWorks,
    whatsapp: plainSettings?.whatsapp ?? null,
    settings: plainSettings,
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { services, works, whatsapp, settings } = await getData();

  return (
    <div className="flex flex-col min-h-screen bg-page-bg/10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [organizationJsonLd(settings), websiteJsonLd()],
        }}
      />
      <PublicNavbar services={services} works={works} />
      <main className="flex-1 pt-16 lg:pt-[72px]">
        {children}
        <ScrollToTopButton />
        <WhatsAppButton phone={whatsapp} />
      </main>
      <PublicFooter />
    </div>
  );
}

import { PublicFooter } from "../components/public/shared/footer";
import { PublicNavbar } from "../components/public/shared/navbar";
import ScrollToTopButton from "../components/public/shared/ScrollToTopButton";
import WhatsAppButton from "../components/public/shared/whatsAppButton";
import JsonLd from "../components/seo/JsonLd";
import {
  getNavPortfolio,
  getNavServices,
  getSiteSettings,
} from "@/lib/data/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

async function getData() {
  const [services, works, settings] = await Promise.all([
    getNavServices(8),
    getNavPortfolio(12),
    getSiteSettings(),
  ]);

  return {
    services,
    works,
    whatsapp: settings?.whatsapp ?? null,
    settings,
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { services, works, whatsapp, settings } = await getData();

  return (
    <div className="flex min-h-screen flex-col bg-page-bg/10">
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

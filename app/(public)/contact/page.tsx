import { Metadata } from "next";
import connectDB from "@/lib/db/connectDB";
import { SiteSettings } from "@/lib/models";
import ContactForm from "@/app/components/public/contact/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";
import HeaderBannerSection from "../components/HeaderBannerSection";

export const metadata: Metadata = {
  title: "Contact Us | Databist",
  description:
    "Get in touch with Databist — office locations, phone, WhatsApp, and email.",
};

export const revalidate = 60;

async function getSettings() {
  await connectDB();
  const settings = await SiteSettings.findOne({ key: "global" }).lean();
  return settings ? JSON.parse(JSON.stringify(settings)) : null;
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <section className="mt-16 bg-page-bg text-ink">
      <HeaderBannerSection
        title="Hi, We're here"
        subtitle="A global impact of techlogies is the part of Databist"
        imageSrc="/contact.jpg"
        overlayClass="bg-linear-to-b from-brand/70 via-brand-dark/80 to-brand/90"
      />
      <div className="w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto bg-page-bg/80 py-7 shadow-xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Let's Talk
          </h1>
          <p className="mt-3 text-muted-foreground">
            Prefer email or phone over booking a slot directly? Reach out and
            we&apos;ll get back to you.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <ContactForm />

          <div className="space-y-8">
            {settings?.offices?.map((office: any) => (
              <div key={office.label} className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">{office.label} Office</p>
                  <p className="text-sm text-muted-foreground">
                    {office.address}
                  </p>
                </div>
              </div>
            ))}

            {settings?.phone && (
              <div className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0" />
                <div className="">
                  <p className="font-semibold">Phone / WhatsApp</p>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {settings.phone}
                  </a>
                  <span> / </span>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            )}

            {settings?.contactEmail && (
              <div className="flex gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            )}

            {settings?.offices?.[0] && (
              <div className="overflow-hidden rounded-lg border">
                <iframe
                  title="Office location map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    settings.offices[0].address,
                  )}&output=embed`}
                  className="h-64 w-full"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

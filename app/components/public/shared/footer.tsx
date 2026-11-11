import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import Facebook from "@mui/icons-material/Facebook";
import LinkedIn from "@mui/icons-material/LinkedIn";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import XIcon from "@mui/icons-material/X";

import NewsletterForm from "./NewsletterForm";
import connectDB from "@/lib/db/connectDB";
import { SiteSettings } from "@/lib/models";
import { toWhatsAppNumber } from "@/lib/site";

const logo = "/logo.svg";

export const revalidate = 60;

async function getSettings() {
  await connectDB();
  const settings = await SiteSettings.findOne({ key: "global" }).lean();
  return settings ? JSON.parse(JSON.stringify(settings)) : null;
}

const FOOTER_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Consultant", href: "/booking" },
  { label: "Contact", href: "/contact" },
  { label: "Sitemap", href: "/sitemap.xml" },
] as const;

export async function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const settings = await getSettings();
  const offices = (settings?.offices as { label: string; address: string }[]) ?? [];
  const whatsappDigits = toWhatsAppNumber(settings?.whatsapp);

  return (
    <footer className="relative text-ink">
      <Image
        src="/virtualOffice.jpg"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 z-10 bg-page-bg" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-block w-18 h-18">
              <Image
                src={logo}
                alt="Databist Logo"
                width={72}
                height={72}
                className="h-18 w-18 object-contain rounded-md"
              />
            </Link>
            <p className="text-sm text-gray-200 leading-relaxed">
              {settings?.companyName ?? "Databist"} — a full-service digital
              marketing and web development agency dedicated to scaling your
              online footprint.
            </p>
            <div className="flex items-center space-x-4">
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-yellow-800 rounded-full hover:bg-blue-800 transition-colors duration-200 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-yellow-800 rounded-full hover:bg-blue-900 transition-colors duration-200 group"
                  aria-label="LinkedIn"
                >
                  <LinkedIn className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {settings?.socialLinks?.x && (
                <a
                  href={settings.socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-yellow-800 rounded-full hover:bg-black transition-colors duration-200 group"
                  aria-label="X"
                >
                  <XIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold tracking-wider uppercase text-brand-light mb-4 lg:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-200 hover:text-brand-light transition-colors duration-200 block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wider uppercase text-brand-light mb-2">
              Our Offices
            </h3>

            <div className="space-y-4 text-sm text-gray-200">
              {offices.length > 0 ? (
                offices.map((office) => (
                  <div key={office.label} className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-brand-light shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">
                        {office.label}
                      </span>
                      {office.address}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-300">
                  Contact us anytime — we work remotely with clients worldwide.
                </p>
              )}

              <div className="pt-2 border-t border-brand-dark space-y-2 flex flex-col justify-start">
                {whatsappDigits && (
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    className="flex items-center space-x-3 hover:text-brand-light transition-colors duration-200"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-brand-light shrink-0" />
                    <span>{settings?.whatsapp}</span>
                  </a>
                )}
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center space-x-3 hover:text-brand-light transition-colors duration-200"
                  >
                    <Phone className="w-4 h-4 text-brand-light shrink-0" />
                    <span>{settings.phone}</span>
                  </a>
                )}
                {settings?.contactEmail && (
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="flex items-center space-x-3 hover:text-brand-light transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4 text-brand-light shrink-0" />
                    <span>{settings.contactEmail}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold tracking-wider uppercase text-brand-light mb-4 lg:mb-6">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-200 mb-4 leading-relaxed">
              Subscribe to our newsletter to receive the latest updates, design
              trends, and marketing tips.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 lg:mt-16 pt-8 border-t border-brand-dark flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-300">
          <div>
            &copy; {currentYear} {settings?.companyName ?? "Databist"}. All
            rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/terms-of-service"
              className="hover:text-brand-light transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-brand-light transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

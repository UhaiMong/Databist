import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import Facebook from "@mui/icons-material/Facebook";
import LinkedIn from "@mui/icons-material/LinkedIn";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import XIcon from "@mui/icons-material/X";

import NewsletterForm from "./NewsletterForm";
import connectDB from "@/lib/db/connectDB";
import { Portfolio, ServicePackage, SiteSettings } from "@/lib/models";
const logo = "/logo.svg";

export const revalidate = 60;

async function getSettings() {
  await connectDB();

  const [services, portfolioItems, settings] = await Promise.all([
    ServicePackage.find({ status: "published" })
      .sort({ order: 1 })
      .limit(8)
      .lean(),
    Portfolio.find({ status: "completed" }).sort({ order: 1 }).limit(3).lean(),
    SiteSettings.findOne({ key: "global" }).lean(),
  ]);

  return JSON.parse(
    JSON.stringify({
      services,
      portfolioItems,
      settings,
    }),
  );
}

// Provided footer navigation links
const FOOTER_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Consultant", href: "/booking" },
  { label: "Contact", href: "/contact" },
  { label: "Sitemap", href: "/sitemap.xml" },
] as const;

export async function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const { services, portfolioItems, settings } = await getSettings();

  if (!settings?.offices?.length) return null;

  const offices = settings.offices as any[];

  return (
    <footer className="relative text-ink">
      <Image
        src="/virtualOffice.jpg"
        alt="Databist Logo"
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 z-10 bg-page-bg" />
      {/* Main Footer Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Company Branding & Socials */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-block w-18 h-18">
              <Image
                src={logo}
                alt="Databist Logo"
                width={72}
                height={72}
                className="h-18 w-18 object-contain rounded-md"
                priority
              />
            </Link>
            <p className="text-sm text-gray-200 leading-relaxed">
              Databist A full-service digital marketing and web development
              agency dedicated to scaling your online footprint.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings?.socialLinks?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-yellow-800 rounded-full hover:bg-blue-800 transition-colors duration-200 group"
                  aria-label={settings?.socialLinks?.facebook}
                >
                  <Facebook className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a
                  href={settings?.socialLinks?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-yellow-800 rounded-full hover:bg-blue-900 transition-colors duration-200 group"
                  aria-label={settings?.socialLinks?.linkedin}
                >
                  <LinkedIn className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}

              {settings?.socialLinks?.twiter && (
                <a
                  href={settings?.socialLinks?.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-yellow-800 rounded-full hover:bg-black transition-colors duration-200 group"
                  aria-label={settings?.socialLinks?.x}
                >
                  <XIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold tracking-wider uppercase text-brand-light mb-4 lg:mb-6">
              Quick Link
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

          {/* Column 3: Contact Info & Offices */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wider uppercase text-brand-light mb-2">
              Our Offices
            </h3>

            <div className="space-y-4 text-sm text-gray-200">
              {/* Bangladesh Address */}
              {offices.map((office: any) => (
                <div key={office.label} className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-brand-light shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      {office.label}
                    </span>
                    {office.address}
                  </div>
                </div>
              ))}
              {/* Phone & Email */}
              <div className="pt-2 border-t border-brand-dark space-y-2 flex flex-col justify-start">
                <a
                  href={`https://wa.me/${settings?.whatsapp}`}
                  className="flex items-center space-x-3 hover:text-brand-light transition-colors duration-200"
                >
                  <WhatsAppIcon className="w-4 h-4 text-brand-light shrink-0" />
                  <span>{settings?.whatsapp}</span>
                </a>
                <a
                  href={`tel:${settings?.phone}`}
                  className="flex items-center space-x-3 hover:text-brand-light transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 text-brand-light shrink-0" />
                  <span>{settings?.phone}</span>
                </a>
                <a
                  href={`mailto:${settings?.contactEmail}`}
                  className="flex items-center space-x-3 hover:text-brand-light transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 text-brand-light shrink-0" />
                  <span>{settings?.contactEmail}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Signup */}
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

        {/* Bottom Bar: Legal Info & Copyright */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-brand-dark flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-300">
          <div>&copy; {currentYear} Databist. All rights reserved.</div>
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

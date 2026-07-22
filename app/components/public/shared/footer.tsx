"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import LinkedIn from "@mui/icons-material/LinkedIn";
import YouTube from "@mui/icons-material/YouTube";
import X from "@mui/icons-material/X";

// Provided footer navigation links
const FOOTER_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Consultant", href: "/booking" },
  { label: "Contact", href: "/contact" },
  { label: "Sitemap", href: "/sitemap" },
] as const;

// Social Links (using # as placeholder before launch)
const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: LinkedIn, href: "#", label: "LinkedIn" },
  { icon: YouTube, href: "#", label: "YouTube" },
  { icon: X, href: "#", label: "X" },
] as const;

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter logic here
  };

  return (
    <footer className="relative text-white">
      <Image
        src="/virtualOffice.jpg"
        alt="Digital Resolution Logo"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 z-10 bg-brand/80" />
      {/* Main Footer Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Company Branding & Socials */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Digital Resolution Logo"
                width={56}
                height={56}
                className="h-14 w-14 object-contain rounded-md"
                priority
              />
            </Link>
            <p className="text-sm text-gray-200 leading-relaxed">
              Digital Resolution — a full-service digital marketing and web
              development agency dedicated to scaling your online footprint.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-brand-dark rounded-full hover:bg-brand-light transition-colors duration-200 group"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
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
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-light shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">
                    Bangladesh Office
                  </span>
                  Software Technology Park, 6th Floor, Singapore Bangkok Market,
                  Agrabad, Chattogram
                </div>
              </div>

              {/* UAE Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-light shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">
                    UAE Office
                  </span>
                  Al Qouz, Street No. 21A, Villa 30, Dubai, UAE
                </div>
              </div>

              {/* Phone & Email */}
              <div className="pt-2 border-t border-brand-dark space-y-2">
                <a
                  href="https://wa.me/8801840930768"
                  className="flex items-center space-x-3 hover:text-brand-light transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 text-brand-light shrink-0" />
                  <span>+880 1840-930768</span>
                </a>
                <a
                  href="mailto:info@digitalresolution.demo"
                  className="flex items-center space-x-3 hover:text-brand-light transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 text-brand-light shrink-0" />
                  <span>info@digitalresolution.demo</span>
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
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 pr-12 text-sm text-brand-muted bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light transition-all placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 p-2 bg-brand hover:bg-brand-dark text-white rounded-md transition-colors duration-200"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Legal Info & Copyright */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-brand-dark flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-300">
          <div>
            &copy; {currentYear} Digital Resolution. All rights reserved.
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

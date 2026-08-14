"use client";

import Link from "next/link";
import Image from "next/image";
import { sendGTMEvent } from "@next/third-parties/google";
import { Phone, CalendarClock, ArrowRight } from "lucide-react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { phoneStr } from "@/lib/constant";

interface Service {
  _id?: string;
  name?: string;
}

interface ServiceCTAProps {
  service?: Service;
  contactNo?: string;
  whatsappNo?: string;
  imageUrl?: string;
  styleCall?: string;
  styleWhatsApp?: string;
}

export default function CTA({
  service,
  contactNo = "+880123456789",
  whatsappNo = "+880123456789",
  imageUrl = "/api/placeholder/600/400",
  styleCall = "",
  styleWhatsApp = "",
}: ServiceCTAProps) {
  // Handlers for Google Tag Manager
  const handleBookingClick = () => {
    sendGTMEvent({
      event: "Book_Consultation_Clicked",
      value: service?.name,
      click_id: "book_consultation",
      click_text: "Book a Free Consultation",
    });
  };

  const handleCallClick = () => {
    sendGTMEvent({
      event: "Call_us_ButtonClicked",
      value: "Call_us",
      click_id: "Call_us",
      click_text: "Call Us",
    });
  };

  const handleWhatsAppClick = () => {
    sendGTMEvent({
      event: "WhatsApp_ButtonClicked",
      value: "WhatsApp",
      click_id: "WhatsApp",
      click_text: "WhatsApp Us",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-16 px-4">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row">
        {/* Left Side: Content & Actions */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
          <div className="mb-8">
            <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-[#FF3131] text-xs font-bold tracking-wider uppercase mb-4">
              Take the next step
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Ready to get started with{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-pink-500">
                {service?.name}?
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-xl">
              Connect with the Databist team today. Schedule a free,
              zero-obligation consultation or reach out directly to discuss how
              we can tailor our solutions to your specific needs.
            </p>
          </div>

          {/* Action Buttons Container */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
            {/* Primary Action */}
            <Button
              asChild
              size="lg"
              onClick={handleBookingClick}
              className="w-full sm:w-auto bg-linear-to-r from-indigo-500 to-pink-500 hover:opacity-90 transition-opacity text-white font-semibold rounded-xl h-14 px-8 shadow-md shadow-indigo-500/20 group"
            >
              {service?._id ? (
                <Link
                  href={`/booking?serviceId=${encodeURIComponent(service?._id)}`}
                >
                  <CalendarClock className="w-5 h-5 mr-2" />
                  Book a Free Consultation
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link href="/booking">
                  <CalendarClock className="w-5 h-5 mr-2" />
                  Book a Free Consultation
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </Button>

            <div className="flex w-full sm:w-auto gap-4">
              {/* Phone Action */}
              <Button
                asChild
                variant="outline"
                size="lg"
                onClick={handleCallClick}
                className={cn(
                  "flex-1 sm:flex-none h-14 rounded-xl border-slate-300 hover:bg-slate-50 hover:text-[#FF3131] hover:border-[#FF3131]/30 transition-all",
                  styleCall,
                )}
              >
                <a href={`tel:${contactNo}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us: {phoneStr}
                </a>
              </Button>

              {/* WhatsApp Action */}
              <Button
                asChild
                variant="outline"
                size="lg"
                onClick={handleWhatsAppClick}
                className={cn(
                  "flex-1 sm:flex-none h-14 rounded-xl border-slate-300 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30 transition-all",
                  styleWhatsApp,
                )}
              >
                <a
                  href={`https://wa.me/${whatsappNo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="w-5 h-5 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Image/Graphic */}
        <div className="hidden md:block w-2/5 relative min-h-100 bg-slate-100">
          <div className="absolute inset-0 bg-linear-to-r from-white via-transparent to-transparent z-10" />
          <Image
            src={imageUrl}
            alt={`${service?.name} consultation`}
            fill
            className="object-cover"
            sizes="(max-w-768px) 100vw, 40vw"
          />
        </div>
      </div>
    </div>
  );
}

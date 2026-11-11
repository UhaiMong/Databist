"use client";

import WhatsApp from "@mui/icons-material/WhatsApp";
import { toWhatsAppNumber } from "@/lib/site";

type WhatsAppButtonProps = {
  phone?: string | null;
};

export default function WhatsAppButton({ phone }: WhatsAppButtonProps) {
  const digits = toWhatsAppNumber(phone);
  if (!digits) return null;

  const message = "Hello, I'd like to know more!";
  const whatsappUrl = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition z-50"
      aria-label="Chat on WhatsApp"
    >
      <WhatsApp className="w-5 h-5" />
    </a>
  );
}

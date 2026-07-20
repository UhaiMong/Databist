"use client";

import WhatsApp from "@mui/icons-material/WhatsApp";
export default function WhatsAppButton() {
  const message = "Hello, I'd like to know more!";
  const phone = "+8801516341885";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

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

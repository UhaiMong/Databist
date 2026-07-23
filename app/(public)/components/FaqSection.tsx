"use client";

import { useState } from "react";
import Link from "next/link";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import { Plus } from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export default function FaqSection({ faqs }: { faqs: any }) {
  const [openId, setOpenId] = useState<string | number | null>(null);

  if (!faqs?.length) return null;

  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} relative py-24 px-4 sm:px-6`}
      style={{ background: "#101014" }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-14 md:mb-16">
          <span
            className="block text-[11px] tracking-[0.25em] text-[#8A8779] uppercase"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            Questions — Answered
          </span>
          <h2
            className="mt-3 text-4xl sm:text-5xl text-[#EDEAE2] italic"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Before you ask
          </h2>
        </div>

        {/* Index */}
        <div className="divide-y divide-[#2A2B31] border-t border-[#2A2B31]">
          {faqs.map((faq: any, idx: number) => {
            const id = faq._id ?? idx;
            const isOpen = openId === id;

            return (
              <div key={id} className="py-6">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : id)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start gap-5 text-left"
                >
                  <span
                    className="mt-1.5 w-14 shrink-0 text-[11px] tracking-[0.2em] text-[#5C5A50]"
                    style={{ fontFamily: "var(--font-plex-mono)" }}
                  >
                    No. {String(idx + 1).padStart(2, "0")}
                  </span>

                  <span
                    className="flex-1 text-lg sm:text-xl leading-snug text-[#EDEAE2] italic"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {faq.question}
                  </span>

                  <span
                    className={`relative mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 transition-colors ${
                      isOpen
                        ? "ring-[#C9A15A] text-[#C9A15A]"
                        : "ring-[#2A2B31] text-[#8A8779] group-hover:ring-[#C9A15A]/60"
                    }`}
                  >
                    <Plus
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </span>
                </button>

                <div
                  className="grid overflow-hidden transition-all duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? "1rem" : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl pl-19 text-sm leading-relaxed text-[#8A8779]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/faq"
            className="group inline-flex items-center gap-2 border-b border-[#2A2B31] pb-1 text-xs tracking-[0.2em] uppercase text-[#EDEAE2] transition-colors hover:border-[#C9A15A] hover:text-[#C9A15A]"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            View all questions
          </Link>
        </div>
      </div>
    </section>
  );
}

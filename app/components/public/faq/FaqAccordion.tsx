"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Accordion
        type="single"
        collapsible
        // Switched from a standard column to a responsive 2-column grid
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start"
      >
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            // Removed default bottom border, added a floating card style with active states
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/2 shadow-sm transition-all duration-300 ease-in-out",
              "hover:shadow-md hover:border-slate-300",
              "data-[state=open]:border-[#FF3131]/40 data-[state=open]:shadow-md data-[state=open]:shadow-[#FF3131]/5 data-[state=open]:bg-slate-800",
            )}
          >
            {/* Subtle left-border highlight effect when active */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF3131] opacity-0 transition-opacity duration-300 group-data-[state=open]:opacity-100" />

            <AccordionTrigger className="text-left hover:no-underline py-6 font-semibold text-slate-300 transition-colors group-data-[state=open]:text-[#FF3131]">
              <div className="flex items-center gap-3 pr-4">
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-slate-300 transition-colors duration-300 group-data-[state=open]:bg-[#FF3131]/10 group-data-[state=open]:text-[#FF3131]">
                  <MessageCircleQuestion className="w-4 h-4" />
                </div>
                <span className="leading-snug text-[18px]">
                  {item.question}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-slate-300 leading-relaxed pb-6 pl-11 pr-2 text-[16px]">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

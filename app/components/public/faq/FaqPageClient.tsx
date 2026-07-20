"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

interface FaqPageClientProps {
  faqs: Faq[];
}

export default function FaqPageClient({ faqs }: FaqPageClientProps) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const filtered = faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(query.toLowerCase()) ||
        f.answer.toLowerCase().includes(query.toLowerCase()),
    );

    return filtered.reduce<Record<string, Faq[]>>((acc, faq) => {
      acc[faq.category] = acc[faq.category]
        ? [...acc[faq.category], faq]
        : [faq];
      return acc;
    }, {});
  }, [faqs, query]);

  const categories = Object.keys(grouped);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No questions match your search.
        </p>
      ) : (
        categories.map((category) => (
          <div key={category} className="mb-10">
            <h2 className="mb-3 text-lg font-semibold">{category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {grouped[category].map((faq) => (
                <AccordionItem key={faq._id} value={faq._id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))
      )}

      <div className="mt-10 rounded-lg border bg-muted/40 p-8 text-center">
        <p className="font-medium">Still have a question?</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/booking">Book a Consultation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import FaqAccordion from "@/app/components/public/faq/FaqAccordion";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FaqSection({ faqs }: { faqs: any }) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <FaqAccordion items={faqs} />
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/faq">
              View All FAQs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

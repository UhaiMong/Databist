import { Button } from "@/app/components/ui/button";
import { Heading } from "./DynamicHeading";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Engagement() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <Heading
          title="How We Work"
          titleClassName="text-center"
          subTitleClassName="text-center"
          subTitle="We price by project, not by the hour — so you know the full cost
                    upfront. Need more than one service? Our Combo/All-in-One Package
                    bundles Website, Social Media, SEO, and Content Writing at a
                    discounted combined rate."
          className="mx-auto"
        />
        <Button
          asChild
          variant="link"
          size="lg"
          className="mt-6 bg-brand text-slate-50"
        >
          <Link href="/services">
            Explore Packages <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

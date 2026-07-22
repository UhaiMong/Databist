import Image from "next/image";
import { Heading } from "./DynamicHeading";
import Link from "next/link";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PortfolioShowcase({
  portfolioItems,
}: {
  portfolioItems: any;
}) {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <Heading
          title="Recent Work"
          titleClassName="text-center tracking-tight"
          className="mx-auto"
        />
        {portfolioItems.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-3">
            {portfolioItems.map((item: any) => (
              <Link
                key={item.slug}
                href={`/portfolio/${item.slug}`}
                className="group overflow-hidden rounded-lg border bg-background"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {item.serviceType}
                  </Badge>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Button asChild variant="link" className="bg-brand text-slate-50">
            <Link href="/portfolio">
              View All Work <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

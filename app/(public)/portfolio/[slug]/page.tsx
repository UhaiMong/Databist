import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db/connectDB";
import { Portfolio } from "@/lib/models";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getItem(slug: string) {
  await connectDB();
  const item = await Portfolio.findOne({ slug, status: "published" }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) return { title: "Case Study Not Found | Digital Resolution" };

  return {
    title: `${item.title} | Digital Resolution Portfolio`,
    description: item.summary,
  };
}

export const revalidate = 60;

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) notFound();

  return (
    <article className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/portfolio"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{item.serviceType}</Badge>
          <Badge variant="outline">{item.industry}</Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {item.title}
        </h1>

        <div className="relative mt-6 aspect-video overflow-hidden rounded-lg bg-muted">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="whitespace-pre-line text-muted-foreground">
            {item.summary}
          </p>
        </div>

        {item.resultsSummary && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {item.resultsSummary}
            </p>
          </div>
        )}

        <div className="mt-12 rounded-lg border bg-muted/40 p-8 text-center">
          <h2 className="text-xl font-semibold">
            Want results like this for your business?
          </h2>
          <Button asChild size="lg" className="mt-4">
            <Link href="/booking">
              Book a Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

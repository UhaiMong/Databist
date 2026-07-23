import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db/connectDB";
import { Blog } from "@/lib/models";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import HeaderBannerSection from "../components/HeaderBannerSection";

export const metadata: Metadata = {
  title: "Blog | Digital Resolution",
  description:
    "Insights on web development, design, SEO, and digital marketing from Digital Resolution.",
};

export const revalidate = 60;

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

const LIMIT = 9;

async function getPosts(page: number, category?: string) {
  await connectDB();

  const filter: Record<string, unknown> = { status: "published" };
  if (category) filter.category = category;

  const [posts, total, categories] = await Promise.all([
    Blog.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT)
      .lean(),
    Blog.countDocuments(filter),
    Blog.distinct("category", { status: "published" }),
  ]);

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    totalPages: Math.ceil(total / LIMIT),
    categories,
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam, category } = await searchParams;
  const page = parseInt(pageParam ?? "1", 10);
  const { posts, totalPages, categories } = await getPosts(page, category);

  return (
    <section className="mt-16">
      <HeaderBannerSection
        title="Our Insights"
        subtitle="A global impact of techlogies is the part of Databist"
        imageSrc="/blogBanner.jpg"
        overlayClass="bg-linear-to-b from-brand/30 via-brand-dark/40 to-brand/70"
      />
      <div className="mx-auto mb-10 max-w-2xl text-center mt-4 py-3.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl inline-block bg-linear-to-r from-indigo-600 via-pink-500 to-indigo-700 bg-clip-text text-transparent">
          Recent Article
        </h1>
        <p className="mt-3 text-muted-foreground">
          Insights on web development, design, SEO, and digital marketing.
        </p>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Link href="/blog">
            <Badge variant={!category ? "default" : "outline"}>All</Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`}>
              <Badge variant={category === cat ? "default" : "outline"}>
                {cat}
              </Badge>
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No articles found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-lg border"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {post.featuredImage && (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {post.category}
                  </Badge>
                  <h2 className="font-semibold leading-snug">{post.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString()} ·{" "}
                    {post.readingTimeMinutes} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              asChild
              variant={p === page ? "default" : "outline"}
              size="sm"
            >
              <Link
                href={`/blog?page=${p}${category ? `&category=${category}` : ""}`}
              >
                {p}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}

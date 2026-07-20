import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db/connectDB";
import { Blog } from "@/lib/models";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import ShareButtons from "@/app/components/public/blog/ShareButtons";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  await connectDB();
  const post = await Blog.findOne({ slug, status: "published" }).lean();
  if (!post) return { post: null, related: [] };

  const related = await Blog.find({
    slug: { $ne: slug },
    status: "published",
    $or: [
      { category: (post as any).category },
      { tags: { $in: (post as any).tags ?? [] } },
    ],
  })
    .limit(3)
    .select("title slug excerpt featuredImage")
    .lean();

  return {
    post: JSON.parse(JSON.stringify(post)),
    related: JSON.parse(JSON.stringify(related)),
  };
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPost(slug);

  if (!post) return { title: "Article Not Found | Digital Resolution" };

  return {
    title: `${post.title} | Digital Resolution Blog`,
    description: post.excerpt,
  };
}

export const revalidate = 60;

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const { post, related } = await getPost(slug);

  if (!post) notFound();

  return (
    <article className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Badge variant="secondary" className="mb-3">
          {post.category}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author?.name}</span>
          {post.author?.role && <span>· {post.author.role}</span>}
          <span>· {new Date(post.publishedAt).toLocaleDateString()}</span>
          <span>· {post.readingTimeMinutes} min read</span>
        </div>

        {post.featuredImage && (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-lg bg-muted">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        <ShareButtons title={post.title} />

        {related.length > 0 && (
          <div className="mt-16 border-t pt-10">
            <h2 className="mb-6 text-xl font-semibold">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((r: any) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                    {r.featuredImage && (
                      <Image
                        src={r.featuredImage}
                        alt={r.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 rounded-lg border bg-muted/40 p-8 text-center">
          <h2 className="text-xl font-semibold">
            Ready to grow your business?
          </h2>
          <Button asChild size="lg" className="mt-4">
            <Link href="/booking">Book a Free Consultation</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

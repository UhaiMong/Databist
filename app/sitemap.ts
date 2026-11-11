import type { MetadataRoute } from "next";
import connectDB from "@/lib/db/connectDB";
import { Blog, Portfolio, ServicePackage } from "@/lib/models";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/blog",
  "/faq",
  "/contact",
  "/booking",
  "/privacy-policy",
  "/terms-of-service",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/booking" || path === "/contact" ? 0.9 : 0.7,
  }));

  try {
    await connectDB();

    const [services, posts, portfolioItems] = await Promise.all([
      ServicePackage.find({ status: "published" })
        .select("slug updatedAt")
        .lean(),
      Blog.find({ status: "published" }).select("slug updatedAt publishedAt").lean(),
      Portfolio.find({ status: "completed" }).select("slug updatedAt").lean(),
    ]);

    const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: (service as { updatedAt?: Date }).updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified:
        (post as { updatedAt?: Date; publishedAt?: Date }).updatedAt ??
        (post as { publishedAt?: Date }).publishedAt ??
        new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const portfolioEntries: MetadataRoute.Sitemap = portfolioItems.map(
      (item) => ({
        url: `${baseUrl}/portfolio/${item.slug}`,
        lastModified: (item as { updatedAt?: Date }).updatedAt ?? new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }),
    );

    return [
      ...staticEntries,
      ...serviceEntries,
      ...blogEntries,
      ...portfolioEntries,
    ];
  } catch (error) {
    console.error("sitemap generation error:", error);
    return staticEntries;
  }
}

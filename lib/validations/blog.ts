import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(3).max(150),
  slug: z
    .string()
    .min(3)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase, alphanumeric, hyphens only",
    ),
  excerpt: z.string().min(10).max(300),
  body: z.array(z.record(z.string(), z.unknown())).min(1, "Blog body cannot be empty"),
  featuredImage: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  author: z.object({
    name: z.string().min(1),
    role: z.string().optional(),
    avatar: z.string().optional(),
  }),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  publishedAt: z.string().datetime().optional(),
});

export type BlogPostValues = z.infer<typeof blogPostSchema>;

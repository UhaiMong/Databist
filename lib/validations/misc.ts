import { z } from "zod";

export const testimonialSchema = z.object({
  clientName: z.string().min(2).max(100),
  clientRole: z.string().optional(),
  companyName: z.string().optional(),
  quote: z.string().min(10).max(1000),
  avatar: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  relatedService: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
});

// Portfolio
export const portfolioSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase, alphanumeric, hyphens only",
    ),
  thumbnail: z.string().min(1),
  serviceType: z.string().min(1),
  industry: z.string().min(1),
  summary: z.string().min(10).max(500),
  resultsSummary: z.string().optional(),
  description: z.string().optional(),
  externalLink: z.string().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  status: z.enum(["under-development", "completed"]).default("completed"),
});

export const faqGlobalSchema = z.object({
  question: z.string().min(5).max(300),
  answer: z.string().min(5),
  category: z.string().min(1),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

import { z } from "zod";

export const processStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const servicePackageSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase, alphanumeric, hyphens only",
    ),
  priceLabel: z.string().min(1),
  shortDescription: z.string().min(5).max(300),
  longDescription: z.string().min(10),
  inclusions: z
    .array(z.string().min(1))
    .min(1, "At least one inclusion required"),
  processSteps: z.array(processStepSchema).optional().default([]),
  faqs: z.array(faqItemSchema).optional().default([]),
  heroImage: z.string().optional(),
  isCombo: z.boolean().optional().default(false),
  order: z.number().int().default(0),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type ServicePackageValues = z.infer<typeof servicePackageSchema>;

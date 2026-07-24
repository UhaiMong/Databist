import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required").max(150),
  message: z.string().min(10, "Message is too short").max(2000),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: z.email("Invalid email address"),
});

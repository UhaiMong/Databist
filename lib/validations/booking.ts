import { z } from "zod";

export const bookingFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone/WhatsApp number is required").max(20),
  company: z.string().max(100).optional().or(z.literal("")),
  serviceOfInterest: z.string().max(100).optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time slot"),
  timezone: z.string().min(1, "Timezone is required"),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "no-show"]),
});

export const availabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  slotLengthMinutes: z.number().min(5).max(240),
  bufferMinutes: z.number().min(0).max(120),
  isActive: z.boolean(),
});

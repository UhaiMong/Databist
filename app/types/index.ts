export type ServiceStatus = "draft" | "published";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";
export type UserRole = "admin" | "staff";

export interface IServicePackage {
  _id?: string;
  name: string;
  slug: string;
  priceLabel: string; // e.g. "From $350"
  shortDescription: string;
  longDescription: string;
  inclusions: string[];
  processSteps?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  heroImage?: string;
  isCombo?: boolean;
  order: number;
  status: ServiceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceOfInterest?: string;
  message?: string;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "HH:mm"
  timezone: string;
  status: BookingStatus;
  assignedTo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAvailability {
  _id?: string;
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  slotLengthMinutes: number;
  bufferMinutes: number;
  isActive: boolean;
}

export interface IBlackoutDate {
  _id?: string;
  date: string;
  reason?: string;
}

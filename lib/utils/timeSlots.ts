import { IAvailability } from "@/app/types";

interface GenerateSlotsParams {
  date: string; // "YYYY-MM-DD"
  availability: IAvailability[]; // for the matching dayOfWeek
  bookedSlots: string[]; // existing "HH:mm" slots for this date (pending/confirmed)
  isBlackout: boolean;
}

/**
 * Returns "YYYY-MM-DD" for a Date using LOCAL calendar components
 * (never use toISOString() for this — it converts to UTC and silently
 * shifts the date for any timezone ahead of UTC, e.g. Dhaka/UAE).
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function generateTimeSlots({
  date,
  availability,
  bookedSlots,
  isBlackout,
}: GenerateSlotsParams): string[] {
  if (isBlackout || availability.length === 0) return [];

  const bookedSet = new Set(bookedSlots);
  const slots: string[] = [];

  const isToday = date === getLocalDateString();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const rule of availability) {
    if (!rule.isActive) continue;

    const start = toMinutes(rule.startTime);
    const end = toMinutes(rule.endTime);
    const step = rule.slotLengthMinutes + rule.bufferMinutes;

    for (let t = start; t + rule.slotLengthMinutes <= end; t += step) {
      const slot = toTimeString(t);

      if (isToday && t <= nowMinutes) continue;
      if (bookedSet.has(slot)) continue;

      slots.push(slot);
    }
  }

  return slots;
}

export function isPastDate(date: string): boolean {
  return date < getLocalDateString();
}

/**
 * Returns day of week (0-6, Sunday-Saturday) for a "YYYY-MM-DD" date string.
 * Treated as a plain calendar date, not a timezone-aware instant.
 */
export function getDayOfWeek(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

// import { IAvailability } from "@/app/types";

// interface GenerateSlotsParams {
//   date: string;
//   availability: IAvailability[];
//   bookedSlots: string[];
//   isBlackout: boolean;
// }

// function toMinutes(time: string): number {
//   const [h, m] = time.split(":").map(Number);
//   return h * 60 + m;
// }

// function toTimeString(minutes: number): string {
//   const h = Math.floor(minutes / 60)
//     .toString()
//     .padStart(2, "0");
//   const m = (minutes % 60).toString().padStart(2, "0");
//   return `${h}:${m}`;
// }

// export function generateTimeSlots({
//   date,
//   availability,
//   bookedSlots,
//   isBlackout,
// }: GenerateSlotsParams): string[] {
//   if (isBlackout || availability.length === 0) return [];

//   const bookedSet = new Set(bookedSlots);
//   const slots: string[] = [];

//   const isToday = date === new Date().toISOString().split("T")[0];
//   const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

//   for (const rule of availability) {
//     if (!rule.isActive) continue;

//     const start = toMinutes(rule.startTime);
//     const end = toMinutes(rule.endTime);
//     const step = rule.slotLengthMinutes + rule.bufferMinutes;

//     for (let t = start; t + rule.slotLengthMinutes <= end; t += step) {
//       const slot = toTimeString(t);

//       if (isToday && t <= nowMinutes) continue;
//       if (bookedSet.has(slot)) continue;

//       slots.push(slot);
//     }
//   }

//   return slots;
// }

// export function isPastDate(date: string): boolean {
//   const today = new Date().toISOString().split("T")[0];
//   return date < today;
// }

// export function getDayOfWeek(date: string): number {
//   return new Date(`${date}T00:00:00Z`).getUTCDay();
// }

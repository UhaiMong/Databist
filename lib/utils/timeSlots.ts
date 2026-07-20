import { IAvailability } from "@/app/types";

interface GenerateSlotsParams {
  date: string;
  availability: IAvailability[];
  bookedSlots: string[];
  isBlackout: boolean;
}

/**
 * Converts "HH:mm" to minutes since midnight.
 */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Converts minutes since midnight back to "HH:mm".
 */
function toTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Generates available time slots for a given date based on
 * the day's availability rule(s), existing bookings, and blackout status.
 */
export function generateTimeSlots({
  date,
  availability,
  bookedSlots,
  isBlackout,
}: GenerateSlotsParams): string[] {
  if (isBlackout || availability.length === 0) return [];

  const bookedSet = new Set(bookedSlots);
  const slots: string[] = [];

  const isToday = date === new Date().toISOString().split("T")[0];
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

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

/**
 * Returns true if the given date string is in the past (before today).
 */
export function isPastDate(date: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return date < today;
}

/**
 * Returns day of week (0-6, Sunday-Saturday) for a "YYYY-MM-DD" date string,
 * evaluated in UTC to stay consistent with stored date strings.
 */
export function getDayOfWeek(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

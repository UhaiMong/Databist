import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import {
  generateTimeSlots,
  getDayOfWeek,
  isPastDate,
} from "@/lib/utils/timeSlots";
import { Availability, BlackoutDate, Booking } from "@/lib/models";

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date");

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, message: "Valid date (YYYY-MM-DD) is required" },
        { status: 400 },
      );
    }

    if (isPastDate(date)) {
      return NextResponse.json({ success: true, slots: [] });
    }

    await connectDB();

    const dayOfWeek = getDayOfWeek(date);

    const [availabilityRules, blackout, existingBookings] = await Promise.all([
      Availability.find({ dayOfWeek, isActive: true }).lean(),
      BlackoutDate.findOne({ date }).lean(),
      Booking.find({ date, status: { $in: ["pending", "confirmed"] } })
        .select("timeSlot")
        .lean(),
    ]);

    const bookedSlots = existingBookings.map((b: any) => b.timeSlot);

    const slots = generateTimeSlots({
      date,
      availability: availabilityRules as any,
      bookedSlots,
      isBlackout: !!blackout,
    });

    return NextResponse.json({ success: true, slots });
  } catch (error) {
    console.error("GET /api/booking/availability error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch availability" },
      { status: 500 },
    );
  }
}

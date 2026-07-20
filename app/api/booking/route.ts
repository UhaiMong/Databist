import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Booking } from "@/lib/models";
import { bookingFormSchema } from "@/lib/validations/booking";
import { isPastDate } from "@/lib/utils/timeSlots";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { honeypot, ...data } = parsed.data;

    // Spam protection: honeypot field must be empty
    if (honeypot) {
      return NextResponse.json(
        { success: false, message: "Spam detected" },
        { status: 400 },
      );
    }

    if (isPastDate(data.date)) {
      return NextResponse.json(
        { success: false, message: "Cannot book a past date" },
        { status: 400 },
      );
    }

    await connectDB();

    try {
      const booking = await Booking.create({
        ...data,
        status: "pending",
      });

      // TODO: send confirmation email / WhatsApp notification here
      // TODO: trigger GA4 conversion event

      return NextResponse.json({ success: true, booking }, { status: 201 });
    } catch (err: any) {
      // Duplicate key = slot was taken by a concurrent request
      if (err.code === 11000) {
        return NextResponse.json(
          {
            success: false,
            message: "This time slot was just booked. Please choose another.",
          },
          { status: 409 },
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("POST /api/booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const status = req.nextUrl.searchParams.get("status");
    const filter = status ? { status } : {};

    const bookings = await Booking.find(filter)
      .sort({ date: -1, timeSlot: 1 })
      .lean();

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("GET /api/booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

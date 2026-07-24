import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/connectDB";
import { Booking } from "@/lib/models";
import { bookingStatusUpdateSchema } from "@/lib/validations/booking";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const booking = await Booking.findById(id).lean();

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("GET /api/booking/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking ID" },
        { status: 400 },
      );
    }

    const body = await req.json();
    await connectDB();

    // Reschedule: date + timeSlot provided
    if (body.date && body.timeSlot) {
      const conflict = await Booking.findOne({
        _id: { $ne: id },
        date: body.date,
        timeSlot: body.timeSlot,
        status: { $in: ["pending", "confirmed"] },
      });

      if (conflict) {
        return NextResponse.json(
          { success: false, message: "Selected slot is already booked" },
          { status: 409 },
        );
      }

      const updated = await Booking.findByIdAndUpdate(
        id,
        { date: body.date, timeSlot: body.timeSlot },
        { new: true },
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Booking not found" },
          { status: 404 },
        );
      }

      // TODO: trigger re-notification email/WhatsApp

      return NextResponse.json({ success: true, booking: updated });
    }

    // Status update
    const parsed = bookingStatusUpdateSchema.safeParse(body);

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

    const updated = await Booking.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 },
      );
    }

    // TODO: trigger re-notification email/WhatsApp on status change

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("PATCH /api/booking/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update booking" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const cancelled = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true },
    );

    if (!cancelled) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 },
      );
    }

    // TODO: trigger cancellation notification

    return NextResponse.json({ success: true, booking: cancelled });
  } catch (error) {
    console.error("DELETE /api/booking/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel booking" },
      { status: 500 },
    );
  }
}

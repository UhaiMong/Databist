import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/connectDB";
import { Booking } from "@/lib/models";
import { bookingStatusUpdateSchema } from "@/lib/validations/booking";
import { sendEmail } from "@/lib/email/config/resend.config";
import {
  bookingRescheduledTemplate,
  bookingStatusUpdateTemplate,
} from "@/lib/email/templates";

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

// Booking update trigger
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

      try {
        const agencyEmail = process.env.AGENCY_NOTIFY_EMAIL;

        const emailTasks = [
          // 1. Notify Client
          sendEmail({
            to: updated.email,
            subject: "Your Booking Has Been Rescheduled — Digital Resolution",
            html: bookingRescheduledTemplate(updated),
          }),
        ];

        // 2. Notify Agency
        if (agencyEmail) {
          emailTasks.push(
            sendEmail({
              to: agencyEmail,
              replyTo: updated.email,
              subject: `Booking Rescheduled: ${updated.name}`,
              html: bookingRescheduledTemplate(updated),
            }),
          );
        }

        const results = await Promise.allSettled(emailTasks);
        results.forEach((res, i) => {
          if (res.status === "rejected") {
            console.error(`Reschedule email task [${i}] failed:`, res.reason);
          }
        });
      } catch (emailError) {
        console.error("Reschedule email execution error:", emailError);
      }

      return NextResponse.json({ success: true, booking: updated });
    }

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

    // Best-effort Status Update Email Notification via Resend
    try {
      const agencyEmail = process.env.AGENCY_NOTIFY_EMAIL;

      const emailTasks = [
        // 1. Notify Client
        sendEmail({
          to: updated.email,
          subject: `Booking Status Updated: ${updated.status.toUpperCase()} — Digital Resolution`,
          html: bookingStatusUpdateTemplate(updated),
        }),
      ];

      // 2. Notify Agency
      if (agencyEmail) {
        emailTasks.push(
          sendEmail({
            to: agencyEmail,
            replyTo: updated.email,
            subject: `Booking Status Changed (${updated.status}): ${updated.name}`,
            html: bookingStatusUpdateTemplate(updated),
          }),
        );
      }

      const results = await Promise.allSettled(emailTasks);
      results.forEach((res, i) => {
        if (res.status === "rejected") {
          console.error(`Status update email task [${i}] failed:`, res.reason);
        }
      });
    } catch (emailError) {
      console.error("Status update email execution error:", emailError);
    }

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

    return NextResponse.json({ success: true, booking: cancelled });
  } catch (error) {
    console.error("DELETE /api/booking/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel booking" },
      { status: 500 },
    );
  }
}

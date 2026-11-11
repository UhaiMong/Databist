import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Booking } from "@/lib/models";
import { bookingFormSchema } from "@/lib/validations/booking";
import { isPastDate } from "@/lib/utils/timeSlots";
import {
  bookingConfirmationTemplate,
  bookingNotificationTemplate,
} from "@/lib/email/templates";
import { sendGA4Event } from "@/lib/ga4";
import { sendEmail } from "@/lib/email/config/nodemail.config";
import { requireAuth } from "@/lib/auth/apiAuth";
import { verifyRecaptcha } from "@/lib/security/recaptcha";
import {
  getClientIp,
  rateLimit,
  tooManyRequests,
} from "@/lib/security/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = rateLimit(`booking:${ip}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limited.success) return tooManyRequests(limited.retryAfterSec);

    const body = await req.json();

    const { recaptchaToken, ...formData } = body;

    const parsed = bookingFormSchema.safeParse(formData);

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

    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification required" },
        { status: 400 },
      );
    }

    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 400 },
      );
    }

    await connectDB();

    try {
      const booking = await Booking.create({
        ...data,
        serviceOfInterest: data.serviceOfInterest || undefined,
        status: "pending",
      });

      try {
        const agencyEmail = process.env.AGENCY_NOTIFY_EMAIL;
        const sideEffects: Promise<unknown>[] = [
          sendEmail({
            to: data.email,
            subject: "Your Booking Request Received - Databist",
            html: bookingConfirmationTemplate(
              data.name,
              data.date,
              data.timeSlot,
              data.timezone,
            ),
          }),
          sendGA4Event({
            clientId: data.email,
            eventName: "generate_lead",
            params: {
              currency: "USD",
              value: 1,
              service: data.serviceOfInterest || "General consultation",
              booking_id: booking._id ? booking._id.toString() : "unknown",
            },
          }),
        ];

        if (agencyEmail) {
          sideEffects.push(
            sendEmail({
              to: agencyEmail,
              replyTo: data.email,
              subject: `New Booking Request: ${data.name} (${data.timeSlot})`,
              html: bookingNotificationTemplate(data),
            }),
          );
        }
        const results = await Promise.allSettled(sideEffects);

        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(`Side effect task [${index}] failed:`, result.reason);
          }
        });
      } catch (sideEffectError) {
        console.error("Booking error: ", sideEffectError);
      }

      return NextResponse.json({ success: true, booking }, { status: 201 });
    } catch (err: any) {
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
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    await connectDB();

    const status = req.nextUrl.searchParams.get("status");
    const filter = status ? { status } : {};

    const bookings = await Booking.find(filter)
      .populate("serviceOfInterest", "name slug")
      .sort({ date: 1, timeSlot: 1 })
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

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Booking, ServicePackage } from "@/lib/models";
import { bookingFormSchema } from "@/lib/validations/booking";
import { isPastDate } from "@/lib/utils/timeSlots";
import {
  bookingConfirmationTemplate,
  bookingNotificationTemplate,
} from "@/lib/email/templates";
import { sendGA4Event } from "@/lib/ga4";
import { sendEmail } from "@/lib/email/config/nodemail.config";
// import { sendEmail } from "@/lib/email/config/resend.config";

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) return true;

  try {
    const params = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    });

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await res.json();

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"]);
    } else if (typeof data.score === "number" && data.score < 0.5) {
      console.warn("reCAPTCHA low score:", data.score);
      return false;
    }

    return data.success === true;
  } catch (err) {
    console.error("reCAPTCHA verification request error:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
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

      // Confirmation mail sending and GA4 analytics
      try {
        const agencyEmail = process.env.AGENCY_NOTIFY_EMAIL;
        const sideEffects: Promise<unknown>[] = [
          // client confirmation mailing
          sendEmail({
            to: data.email,
            subject: "Your Booking Request Received - Digital Resolution",
            html: bookingConfirmationTemplate(
              data.name,
              data.date,
              data.timeSlot,
              data.timezone,
            ),
          }),
          // GA conversion event
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

        // to agency notification
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
          } else {
            console.log(`Side effect task [${index}] succeeded`, result.value);
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

// Get booking list
export async function GET(req: NextRequest) {
  try {
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

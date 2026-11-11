import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { newsletterSchema } from "@/lib/validations/contact";
import Subscriber from "@/lib/models/Subscriber";
import { verifyRecaptcha } from "@/lib/security/recaptcha";
import {
  getClientIp,
  rateLimit,
  tooManyRequests,
} from "@/lib/security/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = rateLimit(`newsletter:${ip}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limited.success) return tooManyRequests(limited.retryAfterSec);

    const body = await req.json();
    const { recaptchaToken, ...formData } = body;
    const parsed = newsletterSchema.safeParse(formData);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 },
      );
    }

    if (parsed.data.honeypot) {
      return NextResponse.json(
        { success: false, message: "Spam detected" },
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
      await Subscriber.create({ email: parsed.data.email });
    } catch (err: any) {
      if (err.code === 11000) {
        return NextResponse.json(
          { success: true, message: "You're already subscribed" },
          { status: 200 },
        );
      }
      throw err;
    }

    return NextResponse.json(
      { success: true, message: "Subscribed successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe" },
      { status: 500 },
    );
  }
}

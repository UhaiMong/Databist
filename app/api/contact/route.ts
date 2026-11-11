import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import connectDB from "@/lib/db/connectDB";
import Contact from "@/lib/models/contact";
import {
  contactAcknowledgementTemplate,
  contactNotificationTemplate,
} from "@/lib/email/templates";
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
    const limited = rateLimit(`contact:${ip}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limited.success) return tooManyRequests(limited.retryAfterSec);

    const body = await req.json();
    const { recaptchaToken, ...formData } = body;

    const parsed = contactFormSchema.safeParse(formData);

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

    const submission = await Contact.create(data);

    try {
      const agencyEmail = process.env.AGENCY_NOTIFY_EMAIL;
      const emailPromise: Promise<unknown>[] = [
        sendEmail({
          to: data?.email,
          subject: "We've received your message - Databist",
          html: contactAcknowledgementTemplate(data.name),
        }),
      ];

      if (agencyEmail) {
        emailPromise.push(
          sendEmail({
            to: agencyEmail,
            replyTo: data.email,
            subject: `New Contact: ${data.subject}`,
            html: contactNotificationTemplate(data),
          }),
        );
      }
      const results = await Promise.allSettled(emailPromise);

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Side effect task [${index}] failed:`, result.reason);
        }
      });
    } catch (emailError) {
      console.error(
        "Contact email sending failed (submission still saved):",
        emailError,
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully", submission },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
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

    const submissions = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}

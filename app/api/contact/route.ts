import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import connectDB from "@/lib/db/connectDB";
import Contact from "@/lib/models/contact";
import { sendEmail } from "@/lib/email/sendEmail";
import {
  contactAcknowledgementTemplate,
  contactNotificationTemplate,
} from "@/lib/email/templates";

// async function verifyRecaptcha(token: string): Promise<boolean> {
//   if (!process.env.RECAPTCHA_SECRET_KEY) return true;

//   try {
//     const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
//     });
//     const data = await res.json();
//     return data.success === true;
//   } catch {
//     return false;
//   }
// }

// for debug

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

    const agencyEmail = process.env.AGENCY_NOTIFY_EMAIL;
    // to owner
    if (agencyEmail) {
      await sendEmail({
        to: agencyEmail,
        subject: `New Contact: ${data.subject}`,
        html: contactNotificationTemplate(data),
      });
    }
    // to requester
    await sendEmail({
      to: data.email,
      subject: "We've received your message — Digital Resolution",
      html: contactAcknowledgementTemplate(data.name),
    });

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

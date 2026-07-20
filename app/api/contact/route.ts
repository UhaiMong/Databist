import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";

async function verifyRecaptcha(token: string): Promise<boolean> {
  // TODO:
  if (!process.env.RECAPTCHA_SECRET_KEY) return true;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    const data = await res.json();
    return data.success === true;
  } catch {
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

    if (recaptchaToken) {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return NextResponse.json(
          { success: false, message: "reCAPTCHA verification failed" },
          { status: 400 },
        );
      }
    }

    // TODO: send notification email to agency inbox
    // TODO: send auto-acknowledgement email to sender
    console.log("New contact submission:", data);

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
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

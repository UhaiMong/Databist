import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations/contact";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 },
      );
    }

    // TODO: add to newsletter provider (Mailchimp, Brevo, etc.) or a Subscriber collection
    console.log("Newsletter signup:", parsed.data.email);

    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
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

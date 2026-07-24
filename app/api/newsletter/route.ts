import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
// import { Subscriber } from "@/lib/models";
import { newsletterSchema } from "@/lib/validations/contact";
import Subscriber from "@/lib/models/Subscriber";

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

    await connectDB();

    try {
      await Subscriber.create({ email: parsed.data.email });
    } catch (err: any) {
      if (err.code === 11000) {
        // Already subscribed — treat as success, don't leak that info as an error
        return NextResponse.json(
          { success: true, message: "You're already subscribed" },
          { status: 200 },
        );
      }
      throw err;
    }

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

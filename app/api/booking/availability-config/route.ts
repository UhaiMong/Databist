import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Availability } from "@/lib/models";
import { availabilitySchema } from "@/lib/validations/booking";

export async function GET() {
  try {
    await connectDB();

    const rules = await Availability.find()
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();

    return NextResponse.json({ success: true, rules });
  } catch (error) {
    console.error("GET /api/booking/availability-config error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch availability rules" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = availabilitySchema.safeParse(body);

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

    if (parsed.data.startTime >= parsed.data.endTime) {
      return NextResponse.json(
        { success: false, message: "startTime must be before endTime" },
        { status: 400 },
      );
    }

    await connectDB();

    const rule = await Availability.create(parsed.data);

    return NextResponse.json({ success: true, rule }, { status: 201 });
  } catch (error) {
    console.error("POST /api/booking/availability-config error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create availability rule" },
      { status: 500 },
    );
  }
}

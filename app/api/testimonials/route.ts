import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Testimonial } from "@/lib/models";
import { testimonialSchema } from "@/lib/validations/misc";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const featured = req.nextUrl.searchParams.get("featured");
    const filter: Record<string, unknown> = {};
    if (featured === "true") filter.isFeatured = true;

    const testimonials = await Testimonial.find(filter)
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = testimonialSchema.safeParse(body);

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

    await connectDB();

    const testimonial = await Testimonial.create(parsed.data);

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 },
    );
  }
}

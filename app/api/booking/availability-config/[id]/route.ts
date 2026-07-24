import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/connectDB";
import { Availability } from "@/lib/models";
import { availabilitySchema } from "@/lib/validations/booking";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid rule ID" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsed = availabilitySchema.partial().safeParse(body);

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

    const updated = await Availability.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Rule not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, rule: updated });
  } catch (error) {
    console.error("PATCH /api/booking/availability-config/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update rule" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid rule ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const deleted = await Availability.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Rule not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Rule deleted" });
  } catch (error) {
    console.error("DELETE /api/booking/availability-config/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete rule" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/connectDB";
import { FaqGlobal } from "@/lib/models";
import { faqGlobalSchema } from "@/lib/validations/misc";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsed = faqGlobalSchema.partial().safeParse(body);

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

    const updated = await FaqGlobal.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, faq: updated });
  } catch (error) {
    console.error("PATCH /api/faq/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update FAQ" },
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
        { success: false, message: "Invalid ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const deleted = await FaqGlobal.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    console.error("DELETE /api/faq/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete FAQ" },
      { status: 500 },
    );
  }
}

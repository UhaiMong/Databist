import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/connectDB";
import { Subscriber } from "@/lib/models";
import { requireAuth } from "@/lib/auth/apiAuth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const deleted = await Subscriber.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Subscriber not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Subscriber removed" });
  } catch (error) {
    console.error("DELETE /api/newsletter/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove subscriber" },
      { status: 500 },
    );
  }
}

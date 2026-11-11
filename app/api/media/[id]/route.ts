import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/connectDB";
import { Media } from "@/lib/models";
import { requireAuth } from "@/lib/auth/apiAuth";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";

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
        { success: false, message: "Invalid media ID" },
        { status: 400 },
      );
    }

    await connectDB();
    const media = await Media.findById(id);

    if (!media) {
      return NextResponse.json(
        { success: false, message: "Media not found" },
        { status: 404 },
      );
    }

    try {
      await deleteCloudinaryAsset(
        media.publicId,
        (media.resourceType as "image" | "video" | "raw" | "auto") || "image",
      );
    } catch (cloudErr) {
      console.error("Cloudinary delete failed:", cloudErr);
      // Continue removing DB record so the library stays consistent
    }

    await Media.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Media deleted",
    });
  } catch (error) {
    console.error("DELETE /api/media/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete media" },
      { status: 500 },
    );
  }
}

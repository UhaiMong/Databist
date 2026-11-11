import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Media } from "@/lib/models";
import { requireAuth } from "@/lib/auth/apiAuth";
import {
  assertCloudinaryConfig,
  uploadImageBuffer,
} from "@/lib/cloudinary";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    await connectDB();

    const q = req.nextUrl.searchParams.get("q")?.trim();
    const page = Math.max(
      1,
      parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10) || 1,
    );
    const limit = Math.min(
      48,
      Math.max(
        1,
        parseInt(req.nextUrl.searchParams.get("limit") ?? "24", 10) || 24,
      ),
    );

    const filter: Record<string, unknown> = { resourceType: "image" };
    if (q) {
      filter.$or = [
        { originalFilename: { $regex: q, $options: "i" } },
        { alt: { $regex: q, $options: "i" } },
        { publicId: { $regex: q, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Media.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch media" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    try {
      assertCloudinaryConfig();
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 503 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const alt = String(formData.get("alt") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "A file is required" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported file type. Use JPG, PNG, WebP, GIF, AVIF, or SVG.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, message: "File too large. Max size is 8MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadImageBuffer(buffer, {
      filename: file.name,
    });

    await connectDB();

    const media = await Media.create({
      publicId: uploaded.public_id,
      url: uploaded.url,
      secureUrl: uploaded.secure_url,
      resourceType: uploaded.resource_type || "image",
      format: uploaded.format,
      width: uploaded.width,
      height: uploaded.height,
      bytes: uploaded.bytes,
      originalFilename: uploaded.original_filename || file.name,
      folder: uploaded.folder,
      alt,
      uploadedBy: auth.session.user.id,
    });

    return NextResponse.json({ success: true, media }, { status: 201 });
  } catch (error) {
    console.error("POST /api/media error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload media" },
      { status: 500 },
    );
  }
}

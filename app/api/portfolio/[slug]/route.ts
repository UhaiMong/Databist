import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Portfolio } from "@/lib/models";
import { portfolioSchema } from "@/lib/validations/misc";

interface RouteParams {
  params: { slug: string };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const { slug } = await params;
    const item = await Portfolio.findOne({ slug }).lean();

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Portfolio item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("GET /api/portfolio/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch portfolio item" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const body = await req.json();
    const parsed = portfolioSchema.partial().safeParse(body);
    const { slug } = await params;
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

    const updated = await Portfolio.findOneAndUpdate({ slug }, parsed.data, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Portfolio item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("PATCH /api/portfolio/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update portfolio item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const { slug } = await params;
    const deleted = await Portfolio.findOneAndDelete({ slug });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Portfolio item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio item deleted",
    });
  } catch (error) {
    console.error("DELETE /api/portfolio/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete portfolio item" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Blog } from "@/lib/models";
import { blogPostSchema } from "@/lib/validations/blog";

interface RouteParams {
  params: { slug: string };
}

function estimateReadingTime(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const post = await Blog.findOne({ slug: params.slug }).lean();

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    const related = await Blog.find({
      slug: { $ne: params.slug },
      status: "published",
      $or: [
        { category: (post as any).category },
        { tags: { $in: (post as any).tags ?? [] } },
      ],
    })
      .limit(3)
      .select("title slug excerpt featuredImage category publishedAt")
      .lean();

    return NextResponse.json({ success: true, post, related });
  } catch (error) {
    console.error("GET /api/blog/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json();
    const parsed = blogPostSchema.partial().safeParse(body);

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

    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.body)
      data.readingTimeMinutes = estimateReadingTime(parsed.data.body);
    if (parsed.data.status === "published" && !parsed.data.publishedAt)
      data.publishedAt = new Date();

    try {
      const updated = await Blog.findOneAndUpdate({ slug: params.slug }, data, {
        new: true,
      });

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Post not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true, post: updated });
    } catch (err: any) {
      if (err.code === 11000) {
        return NextResponse.json(
          { success: false, message: "A post with this slug already exists" },
          { status: 409 },
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("PATCH /api/blog/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const deleted = await Blog.findOneAndDelete({ slug: params.slug });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("DELETE /api/blog/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete post" },
      { status: 500 },
    );
  }
}

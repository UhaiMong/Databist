import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Blog } from "@/lib/models";
import { blogPostSchema } from "@/lib/validations/blog";
import { requireAuth } from "@/lib/auth/apiAuth";

function estimateReadingTime(content: unknown): number {
  let plainText = "";
  if (typeof content === "string") {
    if (content.startsWith("[") || content.startsWith("{")) {
      try {
        const parsed = JSON.parse(content);
        plainText = extractTextFromPlate(parsed);
      } catch {
        plainText = content.replace(/<[^>]*>/g, " ");
      }
    } else {
      plainText = content.replace(/<[^>]*>/g, " ");
    }
  } else if (
    Array.isArray(content) ||
    (typeof content === "object" && content !== null)
  ) {
    plainText = extractTextFromPlate(content);
  }

  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function extractTextFromPlate(nodes: unknown): string {
  if (!nodes) return "";

  if (typeof nodes === "string") return nodes;

  if (Array.isArray(nodes)) {
    return nodes.map(extractTextFromPlate).join(" ");
  }

  if (typeof nodes === "object" && nodes !== null) {
    const node = nodes as { text?: string; children?: unknown[] };

    if (typeof node.text === "string") {
      return node.text;
    }

    if (Array.isArray(node.children)) {
      return node.children.map(extractTextFromPlate).join(" ");
    }
  }

  return "";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    await connectDB();

    const post = await Blog.findOne({ slug }).lean();

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    if ((post as { status?: string }).status !== "published") {
      const auth = await requireAuth();
      if (auth.error) return auth.error;
    }

    const related = await Blog.find({
      slug: { $ne: slug },
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { slug } = await params;
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
    if (parsed.data.body !== undefined) {
      data.readingTimeMinutes = estimateReadingTime(parsed.data.body);
    }
    if (parsed.data.status === "published" && !parsed.data.publishedAt) {
      data.publishedAt = new Date();
    }

    try {
      const post = await Blog.findOneAndUpdate({ slug }, data, { new: true });

      if (!post) {
        return NextResponse.json(
          { success: false, message: "Post not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true, post });
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
      { success: false, message: "Failed to update blog post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { slug } = await params;
    await connectDB();

    const deleted = await Blog.findOneAndDelete({ slug });

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
      { success: false, message: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Blog } from "@/lib/models";
import { blogPostSchema } from "@/lib/validations/blog";

function estimateReadingTime(content: unknown): number {
  let plainText = "";
  if (typeof content === "string") {
    // If it's HTML or plain text string
    if (content.startsWith("[") || content.startsWith("{")) {
      try {
        // Handle stringified JSON
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
    // If it's already a Plate.js JSON array/object
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

    // If it's a leaf node containing text
    if (typeof node.text === "string") {
      return node.text;
    }

    // If it has children nodes (paragraphs, headings, lists, etc.)
    if (Array.isArray(node.children)) {
      return node.children.map(extractTextFromPlate).join(" ");
    }
  }

  return "";
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const status = req.nextUrl.searchParams.get("status") ?? "published";
    const category = req.nextUrl.searchParams.get("category");
    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10);
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "9", 10);

    const filter: Record<string, unknown> = status === "all" ? {} : { status };
    if (category) filter.category = category;

    const [posts, total] = await Promise.all([
      Blog.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = blogPostSchema.safeParse(body);

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

    const data = {
      ...parsed.data,
      readingTimeMinutes: estimateReadingTime(parsed.data.body),
      publishedAt:
        parsed.data.status === "published"
          ? (parsed.data.publishedAt ?? new Date())
          : parsed.data.publishedAt,
    };

    try {
      const post = await Blog.create(data);
      return NextResponse.json({ success: true, post }, { status: 201 });
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
    console.error("POST /api/blog error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create blog post" },
      { status: 500 },
    );
  }
}

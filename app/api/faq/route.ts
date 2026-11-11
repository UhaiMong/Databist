import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { FaqGlobal } from "@/lib/models";
import { faqGlobalSchema } from "@/lib/validations/misc";
import { requireAuth } from "@/lib/auth/apiAuth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const published = req.nextUrl.searchParams.get("published") ?? "true";

    if (published === "all") {
      const auth = await requireAuth();
      if (auth.error) return auth.error;
    }

    const filter = published === "all" ? {} : { isPublished: true };

    const faqs = await FaqGlobal.find(filter)
      .sort({ category: 1, order: 1 })
      .lean();

    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error("GET /api/faq error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch FAQs" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const parsed = faqGlobalSchema.safeParse(body);

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

    const faq = await FaqGlobal.create(parsed.data);

    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error) {
    console.error("POST /api/faq error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create FAQ" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { Portfolio } from "@/lib/models";
import { portfolioSchema } from "@/lib/validations/misc";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const status = req.nextUrl.searchParams.get("status") ?? "published";
    const serviceType = req.nextUrl.searchParams.get("serviceType");
    const industry = req.nextUrl.searchParams.get("industry");

    const filter: Record<string, unknown> = status === "all" ? {} : { status };
    if (serviceType) filter.serviceType = serviceType;
    if (industry) filter.industry = industry;

    const items = await Portfolio.find(filter).sort({ order: 1 }).lean();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch portfolio items" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = portfolioSchema.safeParse(body);

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

    try {
      const item = await Portfolio.create(parsed.data);
      return NextResponse.json({ success: true, item }, { status: 201 });
    } catch (err: any) {
      if (err.code === 11000) {
        return NextResponse.json(
          {
            success: false,
            message: "A portfolio item with this slug already exists",
          },
          { status: 409 },
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create portfolio item" },
      { status: 500 },
    );
  }
}

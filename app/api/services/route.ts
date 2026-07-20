import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { ServicePackage } from "@/lib/models";
import { servicePackageSchema } from "@/lib/validations/servicePackage";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const status = req.nextUrl.searchParams.get("status") ?? "published";
    const filter = status === "all" ? {} : { status };

    const services = await ServicePackage.find(filter)
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = servicePackageSchema.safeParse(body);

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
      const service = await ServicePackage.create(parsed.data);
      return NextResponse.json({ success: true, service }, { status: 201 });
    } catch (err: any) {
      if (err.code === 11000) {
        return NextResponse.json(
          {
            success: false,
            message: "A service with this slug already exists",
          },
          { status: 409 },
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create service" },
      { status: 500 },
    );
  }
}

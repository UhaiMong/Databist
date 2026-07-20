import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { ServicePackage } from "@/lib/models";
import { servicePackageSchema } from "@/lib/validations/servicePackage";

interface RouteParams {
  params: { slug: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const service = await ServicePackage.findOne({ slug: params.slug }).lean();

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("GET /api/services/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch service" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json();
    const parsed = servicePackageSchema.partial().safeParse(body);

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
      const updated = await ServicePackage.findOneAndUpdate(
        { slug: params.slug },
        parsed.data,
        { new: true },
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Service not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true, service: updated });
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
    console.error("PATCH /api/services/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update service" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const deleted = await ServicePackage.findOneAndDelete({
      slug: params.slug,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("DELETE /api/services/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete service" },
      { status: 500 },
    );
  }
}

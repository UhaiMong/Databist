import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { BlackoutDate } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const dates = await BlackoutDate.find().sort({ date: 1 }).lean();
    return NextResponse.json({ success: true, dates });
  } catch (error) {
    console.error("GET /api/booking/blackout-dates error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blackout dates" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      return NextResponse.json(
        { success: false, message: "Valid date (YYYY-MM-DD) is required" },
        { status: 400 },
      );
    }

    await connectDB();

    try {
      const blackout = await BlackoutDate.create({
        date: body.date,
        reason: body.reason,
      });
      return NextResponse.json({ success: true, blackout }, { status: 201 });
    } catch (err: any) {
      if (err.code === 11000) {
        return NextResponse.json(
          { success: false, message: "This date is already blacked out" },
          { status: 409 },
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("POST /api/booking/blackout-dates error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add blackout date" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const deleted = await BlackoutDate.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Blackout date not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blackout date removed",
    });
  } catch (error) {
    console.error("DELETE /api/booking/blackout-dates error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove blackout date" },
      { status: 500 },
    );
  }
}

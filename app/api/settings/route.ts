import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connectDB";
import { SiteSettings } from "@/lib/models";

const DEFAULT_SETTINGS = {
  key: "global",
  companyName: "Digital Resolution",
  contactEmail: "",
  phone: "+880 1840-930768",
  whatsapp: "+880 1840-930768",
  offices: [
    {
      label: "Bangladesh",
      address:
        "Software Technology Park, 6th Floor, Singapore Bangkok Market, Agrabad, Chattogram",
    },
    {
      label: "UAE",
      address: "Al Qouz, Street No. 21A, Villa 30, Dubai, UAE",
    },
  ],
  socialLinks: {},
};

export async function GET() {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne({ key: "global" }).lean();

    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    delete body.key; // key is immutable

    await connectDB();

    const updated = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      { $set: body },
      { new: true, upsert: true },
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 },
    );
  }
}

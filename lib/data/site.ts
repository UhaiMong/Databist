import { cache } from "react";
import connectDB from "@/lib/db/connectDB";
import { Portfolio, ServicePackage, SiteSettings } from "@/lib/models";

export const getSiteSettings = cache(async () => {
  await connectDB();
  const settings = await SiteSettings.findOne({ key: "global" }).lean();
  return settings ? JSON.parse(JSON.stringify(settings)) : null;
});

export const getNavServices = cache(async (limit = 8) => {
  await connectDB();
  const services = await ServicePackage.find({ status: "published" })
    .sort({ order: 1 })
    .limit(limit)
    .select("name slug")
    .lean();

  return services.map((s) => ({
    _id: s._id.toString(),
    title: s.name,
    slug: s.slug,
  }));
});

export const getNavPortfolio = cache(async (limit = 12) => {
  await connectDB();
  const items = await Portfolio.find({ status: "completed" })
    .sort({ order: 1 })
    .limit(limit)
    .select("title slug")
    .lean();

  return items.map((w) => ({
    _id: w._id.toString(),
    title: w.title,
    slug: w.slug,
  }));
});

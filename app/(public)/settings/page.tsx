import connectDB from "@/lib/db/connectDB";
import { SiteSettings } from "@/lib/models";

export async function getSiteSettings() {
  await connectDB();
  const settings = await SiteSettings.find();
  return JSON.parse(JSON.stringify(settings));
}

import connectDB from "@/lib/db/connectDB";
import { SiteSettings } from "@/lib/models";
import SettingsForm from "@/app/components/dashboard/settings/SettingsForm";

export const metadata = {
  title: "Site Settings | Digital Resolution",
};

const DEFAULT_SETTINGS = {
  companyName: "Digital Resolution",
  contactEmail: "",
  phone: "",
  whatsapp: "",
  offices: [
    { label: "Bangladesh", address: "" },
    { label: "UAE", address: "" },
  ],
  socialLinks: {},
  ga4MeasurementId: "",
};

async function getSettings() {
  await connectDB();
  const settings = await SiteSettings.findOne({ key: "global" }).lean();
  return settings ? JSON.parse(JSON.stringify(settings)) : DEFAULT_SETTINGS;
}

export default async function DashboardSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground">
          Contact details, office addresses, and social links used across the
          site.
        </p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  );
}

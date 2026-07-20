"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { CheckCircle2 } from "lucide-react";

interface Office {
  label: string;
  address: string;
}

interface SettingsData {
  companyName: string;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  offices: Office[];
  socialLinks: Record<string, string>;
  ga4MeasurementId?: string;
}

interface SettingsFormProps {
  initialData: SettingsData;
}

const SOCIAL_PLATFORMS = [
  "facebook",
  "instagram",
  "x",
  "pinterest",
  "linkedin",
  "youtube",
];

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateOffice(index: number, field: keyof Office, value: string) {
    const offices = [...form.offices];
    offices[index] = { ...offices[index], [field]: value };
    setForm({ ...form, offices });
  }

  function updateSocial(platform: string, value: string) {
    setForm({
      ...form,
      socialLinks: { ...form.socialLinks, [platform]: value },
    });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (data.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={form.contactEmail}
              onChange={(e) =>
                setForm({ ...form, contactEmail: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp Number</Label>
            <Input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>GA4 Measurement ID</Label>
            <Input
              value={form.ga4MeasurementId ?? ""}
              onChange={(e) =>
                setForm({ ...form, ga4MeasurementId: e.target.value })
              }
              placeholder="G-XXXXXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Office Locations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.offices.map((office, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_2fr]"
            >
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={office.label}
                  onChange={(e) => updateOffice(i, "label", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={office.address}
                  onChange={(e) => updateOffice(i, "address", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform} className="space-y-2">
              <Label className="capitalize">{platform}</Label>
              <Input
                value={form.socialLinks[platform] ?? ""}
                onChange={(e) => updateSocial(platform, e.target.value)}
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

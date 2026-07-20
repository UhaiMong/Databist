import { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    companyName: { type: String, default: "Digital Resolution" },
    contactEmail: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    offices: [
      {
        label: { type: String, required: true }, // "Bangladesh" | "UAE"
        address: { type: String, required: true },
        mapLat: { type: Number },
        mapLng: { type: Number },
      },
    ],
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      x: { type: String },
      pinterest: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
    },
    ga4MeasurementId: { type: String },
  },
  { timestamps: true },
);

export const SiteSettings =
  models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

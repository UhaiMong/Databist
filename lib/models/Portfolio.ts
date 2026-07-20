import { Schema, model, models } from "mongoose";

const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    thumbnail: { type: String, required: true },
    serviceType: { type: String, required: true },
    industry: { type: String, required: true },
    summary: { type: String, required: true },
    resultsSummary: { type: String },
    externalLink: { type: String },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true },
);

PortfolioSchema.index({ serviceType: 1, industry: 1 });

export const Portfolio =
  models.Portfolio || model("Portfolio", PortfolioSchema);

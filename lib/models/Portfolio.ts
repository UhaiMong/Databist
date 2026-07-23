import mongoose, { Schema, model, models } from "mongoose";
import slugify from "slugify";

const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    thumbnail: { type: String, required: true },
    serviceType: { type: String, required: true },
    industry: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, default: "" },
    resultsSummary: { type: String, default: "" },
    externalLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["under-development", "completed"],
      default: "completed",
    },
  },
  { timestamps: true },
);

PortfolioSchema.index({ serviceType: 1, industry: 1 });

// pre save slug function
PortfolioSchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await mongoose.models.Portfolio.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  this.slug = slug;
});

export const Portfolio =
  models.Portfolio || model("Portfolio", PortfolioSchema);

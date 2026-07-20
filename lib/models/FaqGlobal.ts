import { Schema, model, models } from "mongoose";

const FaqGlobalSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "Services & Pricing"
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

FaqGlobalSchema.index({ category: 1, order: 1 });

export const FaqGlobal =
  models.FaqGlobal || model("FaqGlobal", FaqGlobalSchema);

import mongoose, { Schema, model, models } from "mongoose";
import slugify from "slugify";

const ProcessStepSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false },
);

const ServicePackageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    priceLabel: { type: String, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    inclusions: { type: [String], default: [] },
    processSteps: { type: [ProcessStepSchema], default: [] },
    faqs: { type: [FaqSchema], default: [] },
    heroImage: { type: String },
    isCombo: { type: Boolean, default: false },
    order: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true },
);

// Pre-save slug auto generate
ServicePackageSchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  let baseSlug = slugify(this.name, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await mongoose.models.ServicePackage.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  this.slug = slug;
});

ServicePackageSchema.index({ order: 1 });

export const ServicePackage =
  models.ServicePackage || model("ServicePackage", ServicePackageSchema);

export default ServicePackage;

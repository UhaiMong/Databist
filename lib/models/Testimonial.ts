import { Schema, model, models } from "mongoose";

const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true },
    clientRole: { type: String },
    companyName: { type: String },
    quote: { type: String, required: true },
    avatar: { type: String },
    videoUrl: { type: String },
    relatedService: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Testimonial =
  models.Testimonial || model("Testimonial", TestimonialSchema);

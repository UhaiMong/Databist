import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: { type: String, required: true },
    body: { type: String, required: true }, // rich text HTML
    featuredImage: { type: String },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    author: {
      name: { type: String, required: true },
      role: { type: String },
      avatar: { type: String },
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    publishedAt: { type: Date },
    readingTimeMinutes: { type: Number, default: 1 },
  },
  { timestamps: true },
);

BlogSchema.index({ category: 1, status: 1 });
BlogSchema.index({ publishedAt: -1 });

export const Blog = models.Blog || model("Blog", BlogSchema);

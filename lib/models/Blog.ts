import mongoose, { Schema, model, models } from "mongoose";
import slugify from "slugify";

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
    body: { type: Schema.Types.Mixed, required: true },
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

// pre save slug function
BlogSchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await mongoose.models.Blog.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  this.slug = slug;
});

BlogSchema.index({ category: 1, status: 1 });
BlogSchema.index({ publishedAt: -1 });

export const Blog = models.Blog || model("Blog", BlogSchema);

import { Schema, model, models } from "mongoose";

const MediaSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    resourceType: {
      type: String,
      enum: ["image", "video", "raw", "auto"],
      default: "image",
    },
    format: { type: String },
    width: { type: Number },
    height: { type: Number },
    bytes: { type: Number },
    originalFilename: { type: String },
    folder: { type: String },
    alt: { type: String, default: "" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

MediaSchema.index({ createdAt: -1 });
MediaSchema.index({ originalFilename: "text", alt: "text" });

export const Media = models.Media || model("Media", MediaSchema);

export default Media;

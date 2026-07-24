import { Schema, model, models } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },
  },
  { timestamps: true },
);

export const Subscriber =
  models.Subscriber || model("Subscriber", SubscriberSchema);

export default Subscriber;

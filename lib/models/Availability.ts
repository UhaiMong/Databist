import { Schema, model, models } from "mongoose";

const AvailabilitySchema = new Schema(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true }, // "17:00"
    slotLengthMinutes: { type: Number, required: true, default: 30 },
    bufferMinutes: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Availability =
  models.Availability || model("Availability", AvailabilitySchema);

const BlackoutDateSchema = new Schema(
  {
    date: { type: String, required: true, unique: true },
    reason: { type: String },
  },
  { timestamps: true },
);

export const BlackoutDate =
  models.BlackoutDate || model("BlackoutDate", BlackoutDateSchema);

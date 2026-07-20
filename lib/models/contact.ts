import { model, models, Schema } from "mongoose";

const ContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    honeypot: { type: String },
  },
  { timestamps: true },
);

const Contact = models.Contact || model("Contact", ContactSchema);

export default Contact;

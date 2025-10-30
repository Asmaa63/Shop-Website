import mongoose, { Schema, model, models } from "mongoose";

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "unread",
      enum: ["unread", "read", "replied"],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = models.Contact || model("Contact", ContactSchema);

export default Contact;
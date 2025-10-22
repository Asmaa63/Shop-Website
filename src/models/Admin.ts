// models/Admin.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev (Next.js hot reload)
const Admin = models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
export default Admin;

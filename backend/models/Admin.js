import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      default: "Exam Department",
    },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      dailySummary: { type: Boolean, default: true },
      urgentAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);

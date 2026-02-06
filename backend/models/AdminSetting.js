import mongoose from "mongoose";

const AdminSettingSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", unique: true },

  fullName: String,
  email: String,
  department: String,

  emailNotifications: { type: Boolean, default: true },
  dailySummary: { type: Boolean, default: true },
  urgentAlerts: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export default mongoose.model("AdminSetting", AdminSettingSchema);

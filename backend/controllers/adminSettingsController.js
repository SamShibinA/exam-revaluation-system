import AdminSetting from "../models/AdminSetting.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

// GET ADMIN SETTINGS
export const getAdminSettings = async (req, res) => {
  try {
    const adminId = req.user.id;

    let settings = await AdminSetting.findOne({ adminId });

    if (!settings) {
      settings = new AdminSetting({
        adminId,
        fullName: req.user.name,
        email: req.user.email,
        department: "Exam Department",
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { fullName, email, department } = req.body;

    const settings = await AdminSetting.findOneAndUpdate(
      { adminId },
      { fullName, email, department, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    await Admin.findByIdAndUpdate(adminId, { name: fullName, email });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE NOTIFICATIONS
export const updateNotifications = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { emailNotifications, dailySummary, urgentAlerts } = req.body;

    const settings = await AdminSetting.findOneAndUpdate(
      { adminId },
      { emailNotifications, dailySummary, urgentAlerts, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

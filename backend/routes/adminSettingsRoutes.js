import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAdminSettings,
  updateProfile,
  updateNotifications,
  changePassword,
  getDashboardStats,
} from "../controllers/adminSettingsController.js";

const router = express.Router();

router.get("/admin/settings", authMiddleware, adminMiddleware, getAdminSettings);
router.get("/admin/stats", authMiddleware, adminMiddleware, getDashboardStats);
router.put("/admin/settings/profile", authMiddleware, adminMiddleware, updateProfile);
router.put("/admin/settings/notifications", authMiddleware, adminMiddleware, updateNotifications);
router.put("/admin/settings/password", authMiddleware, adminMiddleware, changePassword);

export default router;

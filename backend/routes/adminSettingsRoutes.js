import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAdminSettings,
  updateProfile,
  updateNotifications,
  changePassword,
  getDashboardStats,
} from "../controllers/adminSettingsController.js";

const router = express.Router();

router.get("/admin/settings", authMiddleware, getAdminSettings);
router.get("/admin/stats", authMiddleware, getDashboardStats);
router.put("/admin/settings/profile", authMiddleware, updateProfile);
router.put("/admin/settings/notifications", authMiddleware, updateNotifications);
router.put("/admin/settings/password", authMiddleware, changePassword);

export default router;

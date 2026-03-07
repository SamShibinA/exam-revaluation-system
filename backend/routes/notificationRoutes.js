import express from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Normalize userId from JWT (can be string or ObjectId) for consistent query
const getUserId = (req) => {
    const id = req.user?.id;
    if (!id) return null;
    return mongoose.Types.ObjectId.isValid(id) ? (typeof id === "string" ? new mongoose.Types.ObjectId(id) : id) : null;
};

// Get all notifications for the authenticated user
router.get("/notifications", authMiddleware, async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Invalid user" });
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50); // limit to recent 50 for performance
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Mark all notifications as read (must be before :id/read to avoid matching "read-all" as id)
router.put("/notifications/read-all", authMiddleware, async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Invalid user" });
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Mark a specific notification as read
router.put("/notifications/:id/read", authMiddleware, async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Invalid user" });
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId },
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

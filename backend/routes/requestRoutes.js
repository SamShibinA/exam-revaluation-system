import express from "express";
import {
  getMyRequests,
  createRequest,
  getAllRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/requests/my/:studentId", authMiddleware, getMyRequests);
router.post("/requests", authMiddleware, createRequest);
router.get("/requests", authMiddleware, adminMiddleware, getAllRequests);
router.patch("/requests/:id/status", authMiddleware, adminMiddleware, updateRequestStatus);

export default router;

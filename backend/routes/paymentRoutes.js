import express from "express";
import { verifyPayment } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Mock payment verification endpoint
router.post("/verify-payment", authMiddleware, verifyPayment);

export default router;

import express from "express";
import { getStudentMarks, getStudentStats } from "../controllers/marksController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/marks/:studentId", authMiddleware, getStudentMarks);
router.get("/student/stats/:studentId", authMiddleware, getStudentStats);

export default router;

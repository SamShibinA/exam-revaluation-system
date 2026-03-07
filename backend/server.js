import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import marksRoutes from "./routes/markRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import adminSettingsRoutes from "./routes/adminSettingsRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api", marksRoutes);
app.use("/api", requestRoutes);
app.use("/api", adminSettingsRoutes);
app.use("/api/students", studentRoutes);

app.use("/api", uploadRoutes);
app.use("/api", notificationRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
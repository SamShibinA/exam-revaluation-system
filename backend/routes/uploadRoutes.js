import express from "express";
import multer from "multer";
import Upload from "../models/Upload.js";
import Request from "../models/Request.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/uploads",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const { requestId, documentType } = req.body;
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const newUpload = new Upload({
        requestId,
        documentType,
        filename: req.file.filename,
        fileUrl: `${baseUrl}/uploads/${req.file.filename}`,
        uploadedBy: req.user.id,
      });

      await newUpload.save();

      if (documentType === "response_sheet") {
        await Request.findByIdAndUpdate(requestId, {
          responseSheet: newUpload.fileUrl,
          status: "completed",
          updatedAt: new Date(),
        });
      }

      res.status(201).json(newUpload);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

router.get("/uploads", authMiddleware, async (req, res) => {
  const uploads = await Upload.find().sort({ createdAt: -1 }).limit(10);
  res.json(uploads);
});

export default router;

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

      // Update request status to 'completed' when any document is uploaded
      const updateData = {
        status: "completed",
        updatedAt: new Date(),
      };

      if (documentType === "response_sheet") {
        updateData.responseSheet = newUpload.fileUrl;
      }

      await Request.findByIdAndUpdate(requestId, updateData);

      res.status(201).json(newUpload);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

router.get("/uploads", authMiddleware, async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    // If limit is 0 or very large, treat as "All"
    const isAll = limit <= 0;

    let query = Upload.find().sort({ createdAt: -1 });

    if (!isAll) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const uploads = await query;
    const total = await Upload.countDocuments();

    res.json({
      data: uploads,
      total,
      page,
      limit: isAll ? total : limit,
      totalPages: isAll ? 1 : Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
});

router.delete("/uploads/:id", authMiddleware, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    // Optionally you could use fs.unlinkSync to delete the physical file
    await Upload.findByIdAndDelete(req.params.id);

    res.json({ message: "Upload deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete upload" });
  }
});

export default router;

import express from "express";
import multer from "multer";
import Upload from "../models/Upload.js";
import Request from "../models/Request.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post(
  "/uploads",
  authMiddleware,
  adminMiddleware,
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

      // Update request status to 'approved' when any document is uploaded
      const request = await Request.findById(requestId).populate("studentId", "email");
      if (request) {
        request.status = "approved";
        request.updatedAt = new Date();
        if (documentType === "response_sheet") {
          request.responseSheet = newUpload.fileUrl;
        }
        await request.save();

        if (request.studentId && request.studentId.email) {
          const studentUser = await User.findOne({ email: request.studentId.email });
          if (studentUser) {
            await Notification.create({
              userId: studentUser._id,
              title: "Document Uploaded",
              message: "A response sheet or document has been uploaded for your request.",
              type: "success",
            });
          }
        }
      }

      res.status(201).json(newUpload);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

router.get("/uploads", authMiddleware, adminMiddleware, async (req, res) => {
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

router.delete("/uploads/:id", authMiddleware, adminMiddleware, async (req, res) => {
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

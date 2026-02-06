import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema({
  requestId: String,
  documentType: String,
  filename: String,
  fileUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Upload", UploadSchema);

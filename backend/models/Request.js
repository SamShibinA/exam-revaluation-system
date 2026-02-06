import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  requestType: String,
  reason: String,
  currentMarks: Number,
  updatedMarks: Number,
  adminRemarks: String,
  status: { 
    type: String, 
    enum: ["pending", "in_review", "approved", "rejected", "completed"],
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export default mongoose.model("Request", RequestSchema);

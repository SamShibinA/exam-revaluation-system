import mongoose from "mongoose";

const MarkSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  internalMarks: Number,
  externalMarks: Number,
  totalMarks: Number,
  grade: String,
  semester: Number,
  academicYear: String,
});

export default mongoose.model("Mark", MarkSchema);

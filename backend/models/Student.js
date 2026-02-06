import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "student" },
  studentId: String,
  department: String,
  currentSemester: Number,
  cgpa: Number,
});

export default mongoose.model("Student", StudentSchema);

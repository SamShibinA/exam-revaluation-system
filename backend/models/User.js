import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], required: true },
    studentId: String,
    department: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

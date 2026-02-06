import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  code: String,
  name: String,
  semester: Number,
  credits: Number,
});

export default mongoose.model("Subject", SubjectSchema);

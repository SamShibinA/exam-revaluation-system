import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Request from "./models/Request.js";
import Mark from "./models/Mark.js";

dotenv.config();

async function checkMarkData() {
  await connectDB();
  const requests = await Request.find({ requestType: "revaluation" }).limit(5);
  for (const req of requests) {
    console.log(`Request ${req._id} for student ${req.studentId} subject ${req.subjectId}`);
    const mark = await Mark.findOne({ studentId: req.studentId, subjectId: req.subjectId });
    if (mark) {
      console.log(`  Found Mark: ID ${mark._id}, Total: ${mark.totalMarks}, External: ${mark.externalMarks}`);
    } else {
      console.log(`  No Mark found for this student and subject combo!`);
    }
  }
  process.exit(0);
}

checkMarkData();

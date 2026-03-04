/**
 * Add marks for a student by their email (e.g. sam@bit.in).
 * Run from backend folder: node add_marks_by_email.js
 * Or with custom email: EMAIL=sam@bit.in node add_marks_by_email.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Mark from "./models/Mark.js";
import Subject from "./models/Subject.js";
import Student from "./models/Student.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const addMarksByEmail = async () => {
  try {
    await connectDB();

    const email = process.env.EMAIL || "sam@bit.in";
    console.log(`Looking up student by email: ${email}...`);

    const student = await Student.findOne({ email });
    if (!student) {
      console.error(`❌ No student found with email: ${email}`);
      process.exit(1);
    }

    console.log(`Found student: ${student.name} (${student.studentId || student._id})`);

    const subjects = await Subject.find();
    if (subjects.length === 0) {
      console.error("❌ No subjects in database. Run seed.js first.");
      process.exit(1);
    }

    // Remove existing marks for this student to avoid duplicates
    await Mark.deleteMany({ studentId: student._id });

    const marksData = subjects.map((subject) => {
      const internalMarks = Math.floor(Math.random() * 21) + 20; // 20-40
      const externalMarks = Math.floor(Math.random() * 31) + 30; // 30-60
      const totalMarks = internalMarks + externalMarks;
      let grade = "F";
      if (totalMarks >= 90) grade = "A+";
      else if (totalMarks >= 80) grade = "A";
      else if (totalMarks >= 70) grade = "B+";
      else if (totalMarks >= 60) grade = "B";
      else if (totalMarks >= 50) grade = "C";
      else if (totalMarks >= 40) grade = "D";

      return {
        studentId: student._id,
        subjectId: subject._id,
        internalMarks,
        externalMarks,
        totalMarks,
        grade,
        semester: subject.semester,
        academicYear: "2024-25",
      };
    });

    await Mark.insertMany(marksData);
    console.log(`✅ Added ${marksData.length} marks for ${student.name} (${email})`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

addMarksByEmail();

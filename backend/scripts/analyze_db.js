/**
 * Analyze current DB: students, subjects, marks for a given student.
 * Run: node scripts/analyze_db.js
 * Or: STUDENT_ID=69895b1401dcf21ac4fa241b node scripts/analyze_db.js
 */
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Mark from "../models/Mark.js";

dotenv.config();

const TARGET_STUDENT_ID = process.env.STUDENT_ID || "69895b1401dcf21ac4fa241b";

async function analyze() {
  await connectDB();

  console.log("========== DATABASE ANALYSIS ==========\n");

  // Students
  const studentCount = await Student.countDocuments();
  const targetStudent = await Student.findById(TARGET_STUDENT_ID);
  console.log("STUDENTS:");
  console.log(`  Total count: ${studentCount}`);
  if (targetStudent) {
    console.log(`  Target student (${TARGET_STUDENT_ID}):`);
    console.log(`    name: ${targetStudent.name}`);
    console.log(`    email: ${targetStudent.email}`);
    console.log(`    studentId (roll): ${targetStudent.studentId}`);
    console.log(`    department: ${targetStudent.department}`);
    console.log(`    currentSemester: ${targetStudent.currentSemester}`);
    console.log(`    cgpa: ${targetStudent.cgpa}`);
  } else {
    console.log(`  Target student ${TARGET_STUDENT_ID}: NOT FOUND`);
  }

  // Subjects
  const subjects = await Subject.find().sort({ semester: 1, code: 1 });
  console.log(`\nSUBJECTS: total ${subjects.length}`);
  subjects.forEach((s) => {
    console.log(`  [${s.code}] ${s.name} | sem ${s.semester} | credits ${s.credits ?? "—"}`);
  });

  // Marks for target student
  const marks = await Mark.find({ studentId: TARGET_STUDENT_ID })
    .populate("subjectId", "code name semester credits")
    .sort({ semester: 1 });
  console.log(`\nMARKS for student ${TARGET_STUDENT_ID}: total ${marks.length}`);
  marks.forEach((m) => {
    const subj = m.subjectId || {};
    console.log(
      `  ${subj.code} | ${subj.name} | internal ${m.internalMarks} external ${m.externalMarks} total ${m.totalMarks} grade ${m.grade}`
    );
  });

  console.log("\n========== END ==========");
  process.exit(0);
}

analyze().catch((err) => {
  console.error(err);
  process.exit(1);
});

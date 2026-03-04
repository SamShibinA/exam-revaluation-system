/**
 * Add/update subjects and marks for student 69895b1401dcf21ac4fa241b.
 * Run from backend: node scripts/seed_marks_for_student.js
 */
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Mark from "../models/Mark.js";

dotenv.config();

const STUDENT_ID = "69895b1401dcf21ac4fa241b";
const ACADEMIC_YEAR = "2024-25";

// Grade -> (internal out of 40, external out of 60) for 100 total
function gradeToMarks(grade) {
  const g = (grade || "").toUpperCase().trim();
  if (g === "A+") return { internal: 38, external: 56, total: 94 };
  if (g === "A") return { internal: 35, external: 50, total: 85 };
  if (g === "B+") return { internal: 32, external: 44, total: 76 };
  if (g === "B") return { internal: 28, external: 38, total: 66 };
  if (g === "C") return { internal: 22, external: 32, total: 54 };
  if (g === "O") return { internal: 38, external: 58, total: 96 }; // Outstanding
  if (g === "COMPLETED") return { internal: 30, external: 42, total: 72 };
  return { internal: 30, external: 42, total: 72 };
}

// Course list: code, name, semester, grade, credits (assigned)
const COURSES = [
  { code: "22IT017", name: "SOFTWARE DEFINED NETWORKS", semester: 5, grade: "A", credits: 3 },
  { code: "22IT501", name: "PRINCIPLES OF COMMUNICATION", semester: 5, grade: "A", credits: 4 },
  { code: "22IT502", name: "COMPUTER NETWORKS", semester: 5, grade: "A", credits: 4 },
  { code: "22IT503", name: "INFORMATION CODING TECHNIQUES", semester: 5, grade: "B+", credits: 4 },
  { code: "22IT504", name: "INTERNET OF THINGS", semester: 5, grade: "A", credits: 3 },
  { code: "22IT507", name: "MINI PROJECT I", semester: 5, grade: "A+", credits: 2 },
  { code: "22OAG01", name: "RAINWATER HARVESTING TECHNIQUES", semester: 5, grade: "A", credits: 1 },
  { code: "22IT401", name: "DISCRETE MATHEMATICS", semester: 4, grade: "A", credits: 4 },
  { code: "22IT402", name: "DATA STRUCTURES II", semester: 4, grade: "A+", credits: 4 },
  { code: "22IT403", name: "OPERATING SYSTEMS", semester: 4, grade: "B+", credits: 4 },
  { code: "22IT404", name: "WEB TECHNOLOGY AND FRAMEWORKS", semester: 4, grade: "A+", credits: 4 },
  { code: "22IT405", name: "DATABASE MANAGEMENT SYSTEM", semester: 4, grade: "A+", credits: 4 },
  { code: "22HS007", name: "ENVIRONMENTAL SCIENCE", semester: 4, grade: "Completed", credits: 2 },
  { code: "22HS008", name: "ADVANCED ENGLISH AND TECHNICAL EXPRESSION", semester: 4, grade: "A", credits: 2 },
  { code: "22IT008", name: "UI AND UX DESIGN", semester: 4, grade: "A", credits: 3 },
  { code: "22CT0XA", name: "MEAN STACK FOR DYNAMIC WEB APP DEVELOPMENT", semester: 3, grade: "O", credits: 3 },
  { code: "22HS004", name: "HUMAN VALUES AND ETHICS", semester: 3, grade: "A", credits: 2 },
  { code: "22HS005", name: "SOFT SKILLS AND EFFECTIVE COMMUNICATION", semester: 3, grade: "A+", credits: 2 },
  { code: "22IT301", name: "PROBABILITY, STATISTICS AND QUEUING THEORY", semester: 3, grade: "A", credits: 4 },
  { code: "22IT302", name: "DATA STRUCTURES I", semester: 3, grade: "A", credits: 4 },
  { code: "22IT303", name: "COMPUTER ORGANIZATION AND ARCHITECTURE", semester: 3, grade: "A", credits: 4 },
  { code: "22IT304", name: "PRINCIPLES OF PROGRAMMING LANGUAGE", semester: 3, grade: "A", credits: 4 },
  { code: "22IT305", name: "SOFTWARE ENGINEERING", semester: 3, grade: "A+", credits: 4 },
  { code: "22CH203", name: "ENGINEERING CHEMISTRY II", semester: 2, grade: "A+", credits: 3 },
  { code: "22GE002", name: "COMPUTATIONAL PROBLEM SOLVING", semester: 2, grade: "A+", credits: 4 },
  { code: "22GE003", name: "BASICS OF ELECTRICAL ENGINEERING", semester: 2, grade: "A", credits: 3 },
  { code: "22HS006", name: "TAMILS AND TECHNOLOGY", semester: 2, grade: "A", credits: 2 },
  { code: "22HS201", name: "COMMUNICATIVE ENGLISH II", semester: 2, grade: "A", credits: 2 },
  { code: "22IT206", name: "DIGITAL COMPUTER ELECTRONICS", semester: 2, grade: "A+", credits: 4 },
  { code: "22MA201", name: "ENGINEERING MATHEMATICS II", semester: 2, grade: "A+", credits: 4 },
  { code: "22PH202", name: "ELECTROMAGNETISM AND MODERN PHYSICS", semester: 2, grade: "A", credits: 4 },
  { code: "22MA101", name: "ENGINEERING MATHEMATICS I", semester: 1, grade: "A+", credits: 4 },
  { code: "22PH102", name: "ENGINEERING PHYSICS", semester: 1, grade: "A", credits: 4 },
  { code: "22CH103", name: "ENGINEERING CHEMISTRY I", semester: 1, grade: "A", credits: 3 },
  { code: "22GE001", name: "FUNDAMENTALS OF COMPUTING", semester: 1, grade: "A", credits: 4 },
  { code: "22GE004", name: "BASICS OF ELECTRONICS ENGINEERING", semester: 1, grade: "A", credits: 3 },
  { code: "22HS002", name: "STARTUP MANAGEMENT", semester: 1, grade: "A+", credits: 2 },
  { code: "22HS001", name: "FOUNDATIONAL ENGLISH", semester: 1, grade: "C", credits: 2 },
  { code: "22HS003", name: "HERITAGE OF TAMILS", semester: 1, grade: "A+", credits: 2 },
];

async function run() {
  await connectDB();

  const student = await Student.findById(STUDENT_ID);
  if (!student) {
    console.error("Student not found:", STUDENT_ID);
    process.exit(1);
  }
  console.log("Student:", student.name, student.email);

  // Ensure all subjects exist (upsert by code)
  const subjectIds = [];
  for (const c of COURSES) {
    let sub = await Subject.findOneAndUpdate(
      { code: c.code },
      { $set: { name: c.name, semester: c.semester, credits: c.credits } },
      { new: true, upsert: true }
    );
    subjectIds.push(sub._id);
  }
  console.log("Subjects ensured:", subjectIds.length);

  // Delete existing marks for this student
  const deleted = await Mark.deleteMany({ studentId: STUDENT_ID });
  console.log("Deleted existing marks:", deleted.deletedCount);

  // Build marks from COURSES (we have subjectIds in same order as COURSES)
  const marksData = COURSES.map((c, i) => {
    const { internal, external, total } = gradeToMarks(c.grade);
    return {
      studentId: STUDENT_ID,
      subjectId: subjectIds[i],
      internalMarks: internal,
      externalMarks: external,
      totalMarks: total,
      grade: c.grade === "Completed" ? "P" : c.grade,
      semester: c.semester,
      academicYear: ACADEMIC_YEAR,
    };
  });

  await Mark.insertMany(marksData);
  console.log("Inserted marks:", marksData.length);

  // Optional: update student currentSemester and CGPA
  const maxSem = Math.max(...COURSES.map((c) => c.semester));
  const totalCredits = COURSES.reduce((s, c) => s + c.credits, 0);
  const weightedSum = COURSES.reduce((s, c) => {
    const m = gradeToMarks(c.grade);
    return s + m.total * c.credits;
  }, 0);
  const cgpa = totalCredits > 0 ? (weightedSum / totalCredits / 10).toFixed(2) : 0;
  await Student.findByIdAndUpdate(STUDENT_ID, {
    currentSemester: maxSem,
    cgpa: parseFloat(cgpa),
  });
  console.log("Updated student: currentSemester =", maxSem, ", cgpa =", cgpa);

  console.log("Done.");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

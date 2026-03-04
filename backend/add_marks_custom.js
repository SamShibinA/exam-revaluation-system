import mongoose from "mongoose";
import dotenv from "dotenv";
import Mark from "./models/Mark.js";
import Subject from "./models/Subject.js";
import Student from "./models/Student.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const addMarksForStudent = async () => {
    try {
        await connectDB();
        const studentId = "69895b1401dcf21ac4fa241b"; // The ID provided by user

        console.log(`Adding marks for student ID: ${studentId}...`);

        // Fetch subjects
        const subjects = await Subject.find();
        if (subjects.length === 0) {
            console.log("No subjects found. Please seed subjects first.");
            process.exit(1);
        }

        const marksData = [];
        for (const subject of subjects) {
            // Random marks for Internal (out of 40) and External (out of 60)
            const internalMarks = Math.floor(Math.random() * 20) + 20; // 20 to 40
            const externalMarks = Math.floor(Math.random() * 30) + 30; // 30 to 60
            const totalMarks = internalMarks + externalMarks;

            let grade = "F";
            if (totalMarks >= 90) grade = "A+";
            else if (totalMarks >= 80) grade = "A";
            else if (totalMarks >= 70) grade = "B";
            else if (totalMarks >= 60) grade = "C";
            else if (totalMarks >= 50) grade = "D";

            marksData.push({
                studentId: studentId, // Using the provided ID directly
                subjectId: subject._id,
                internalMarks,
                externalMarks,
                totalMarks,
                grade,
                semester: subject.semester,
                examType: "Regular",
                academicYear: "2024-25"
            });
        }

        // Insert marks
        await Mark.deleteMany({ studentId: studentId }); // Clear existing marks for this ID to avoid dupes
        await Mark.insertMany(marksData);

        console.log(`✅ Successfully added ${marksData.length} marks entries for student ${studentId}`);
        process.exit();
    } catch (error) {
        console.error("❌ Error adding marks:", error);
        process.exit(1);
    }
};

addMarksForStudent();

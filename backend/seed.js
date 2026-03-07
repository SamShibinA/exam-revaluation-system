import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Student from "./models/Student.js";
import Admin from "./models/Admin.js";
import Subject from "./models/Subject.js";
import Mark from "./models/Mark.js";
import Request from "./models/Request.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log("Cleaning existing data...");
        await Student.deleteMany({});
        await Admin.deleteMany({});
        await Subject.deleteMany({});
        await Mark.deleteMany({});
        await Request.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const commonPassword = await bcrypt.hash("password123", salt); // Common password for generated users
        const studentPassword = await bcrypt.hash("student123", salt);
        const adminPassword = await bcrypt.hash("admin123", salt);
        const samPassword = await bcrypt.hash("sam123", salt);

        // --- Create Subjects ---
        console.log("Seeding Subjects...");
        const subjects = await Subject.insertMany([
            { code: "CS101", name: "Introduction to CS", semester: 1, credits: 4 },
            { code: "CS102", name: "Data Structures", semester: 2, credits: 4 },
            { code: "CS103", name: "Algorithms", semester: 3, credits: 4 },
            { code: "CS104", name: "Operating Systems", semester: 4, credits: 4 },
            { code: "CS105", name: "Database Systems", semester: 5, credits: 4 },
        ]);

        // --- Create Admins ---
        console.log("Seeding Admins...");
        await Admin.insertMany([
            {
                name: "Sam Shibin",
                email: "samshibin1125@gmail.com",
                password: samPassword,
                department: "Exam Department",
            },
        ]);

        // --- Create Comprehensive Student List ---
        console.log("Seeding Students...");
        const studentsData = [
            {
                name: "Sam Shibin",
                email: "samshibin.it23@bitsathy.ac.in",
                password: studentPassword, // student123
                role: "student",
                studentId: "STU1000",
                department: "Computer Science",
                currentSemester: 5,
                cgpa: 9.0,
            },
        ];

        const students = await Student.insertMany(studentsData);

        // --- (Skipping Marks and Requests as requested) ---

        console.log(`✅ Database Seeded Successfully!`);
        console.log(`- ${students.length} Students`);
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedData();

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
                name: "Demo Admin",
                email: "admin@university.edu",
                password: adminPassword,
                department: "Exam Controller",
            },
            {
                name: "Postman Admin",
                email: "postman_admin@university.edu",
                password: adminPassword,
                department: "IT Support",
            },
            {
                name: "sam",
                email: "sam@gmail.com",
                password: samPassword,
                department: "Exam Department",
            },
        ]);

        // --- Create Comprehensive Student List ---
        console.log("Seeding Students...");
        const studentsData = [
            {
                name: "Demo Student",
                email: "student@university.edu",
                password: studentPassword, // student123
                role: "student",
                studentId: "STU1001",
                department: "Computer Science",
                currentSemester: 5,
                cgpa: 8.5,
            },
            {
                name: "Postman Student",
                email: "postman_student@university.edu",
                password: studentPassword, // student123
                role: "student",
                studentId: "STU1002",
                department: "Computer Science",
                currentSemester: 3,
                cgpa: 7.9,
            },
        ];

        // Generate 10 Random Students
        for (let i = 1; i <= 10; i++) {
            studentsData.push({
                name: `Student ${i}`,
                email: `student${i}@university.edu`,
                password: commonPassword, // password123
                role: "student",
                studentId: `STU${2000 + i}`,
                department: i % 2 === 0 ? "Computer Science" : "Mechanical Engineering",
                currentSemester: Math.floor(Math.random() * 8) + 1,
                cgpa: (Math.random() * (10 - 6) + 6).toFixed(2),
            });
        }

        const students = await Student.insertMany(studentsData);

        // --- Create Marks and Requests ---
        console.log("Seeding Marks & Requests...");
        const marksData = [];
        const requestsData = [];

        for (const student of students) {
            // Assign marks for random subjects
            const numSubjects = Math.floor(Math.random() * 3) + 2; // 2 to 4 subjects
            const shuffledSubjects = subjects.sort(() => 0.5 - Math.random()).slice(0, numSubjects);

            for (const subject of shuffledSubjects) {
                const internalMarks = Math.floor(Math.random() * 25) + 15; // 15 to 40
                const externalMarks = Math.floor(Math.random() * 40) + 20; // 20 to 60
                const totalMarks = internalMarks + externalMarks;

                let grade = "F";
                if (totalMarks >= 90) grade = "A+";
                else if (totalMarks >= 80) grade = "A";
                else if (totalMarks >= 70) grade = "B";
                else if (totalMarks >= 60) grade = "C";
                else if (totalMarks >= 50) grade = "D";

                marksData.push({
                    studentId: student._id,
                    subjectId: subject._id,
                    internalMarks,
                    externalMarks,
                    totalMarks,
                    grade,
                    semester: subject.semester,
                    academicYear: "2024-25"
                });

                // Randomly create a request for some low marks
                if (totalMarks < 75 && Math.random() > 0.5) {
                    const statusOptions = ["pending", "approved", "rejected", "in_review"];
                    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

                    let updatedMarks = undefined;
                    let adminRemarks = undefined;

                    if (status === "approved") {
                        updatedMarks = totalMarks + Math.floor(Math.random() * 10) + 1;
                        adminRemarks = "Verified calculation error. Marks updated.";
                    } else if (status === "rejected") {
                        adminRemarks = "No discrepancy found.";
                    }

                    requestsData.push({
                        studentId: student._id,
                        subjectId: subject._id,
                        requestType: Math.random() > 0.5 ? "revaluation" : "recheck",
                        reason: "Not satisfied with the grade.",
                        currentMarks: totalMarks,
                        status: status,
                        updatedMarks,
                        adminRemarks,
                        createdAt: new Date(new Date() - Math.floor(Math.random() * 1000000000)), // Random time in past
                    });
                }
            }
        }

        await Mark.insertMany(marksData);
        await Request.insertMany(requestsData);

        console.log(`✅ Database Seeded Successfully!`);
        console.log(`- ${students.length} Students`);
        console.log(`- ${marksData.length} Marks`);
        console.log(`- ${requestsData.length} Requests`);
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedData();

import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./models/Student.js";
import Subject from "./models/Subject.js";
import Mark from "./models/Mark.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const rawData = `22IT017
SOFTWARE DEFINED NETWORKS
5
A
PASS
22IT501
PRINCIPLES OF COMMUNICATION
5
A
PASS
22IT502
COMPUTER NETWORKS
5
A
PASS
22IT503
INFORMATION CODING TECHNIQUES
5
B+
PASS
22IT504
INTERNET OF THINGS
5
A
22IT507
MINI PROJECT I
5
A+
PASS
22OAG01
RAINWATER HARVESTING TECHNIQUES
5
A
PASS
22IT401
DISCRETE MATHEMATICS
4
A
PASS
22IT402
DATA STRUCTURES II
4
A+
PASS
22IT403
OPERATING SYSTEMS
4
B+
PASS
22IT404
WEB TECHNOLOGY AND FRAMEWORKS
4
A+
PASS
22IT405
DATABASE MANAGEMENT SYSTEM
4
A+
PASS
22HS007
ENVIRONMENTAL SCIENCE
4
Completed
PASS
22HS008
ADVANCED ENGLISH AND TECHNICAL EXPRESSION
4
A
PASS
22IT008
UI AND UX DESIGN
4
A
22CT0XA
MEAN STACK FOR DYNAMIC WEB APP DEVELOPMENT
3
O
PASS
22HS004
HUMAN VALUES AND ETHICS
3
A
PASS
22HS005
SOFT SKILLS AND EFFECTIVE COMMUNICATION
3
A+
PASS
22IT301
PROBABILITY, STATISTICS AND QUEUING THEORY
3
A
PASS
22IT302
DATA STRUCTURES I
3
A
PASS
22IT303
COMPUTER ORGANIZATION AND ARCHITECTURE
3
A
PASS
22IT304
PRINCIPLES OF PROGRAMMING LANGUAGE
3
A
PASS
22IT305
SOFTWARE ENGINEERING
3
A+
PASS
22CH203
ENGINEERING CHEMISTRY II
2
A+
PASS
22GE002
COMPUTATIONAL PROBLEM SOLVING
2
A+
PASS
22GE003
BASICS OF ELECTRICAL ENGINEERING
2
A
PASS
22HS006
TAMILS AND TECHNOLOGY
2
A
PASS
22HS201
COMMUNICATIVE ENGLISH II
2
A
PASS
22IT206
DIGITAL COMPUTER ELECTRONICS
2
A+
PASS
22MA201
ENGINEERING MATHEMATICS II
2
A+
PASS
22PH202
ELECTROMAGNETISM AND MODERN PHYSICS
2
A
PASS
22MA101
ENGINEERING MATHEMATICS I
1
A+
PASS
22PH102
ENGINEERING PHYSICS
1
A
PASS
22CH103
ENGINEERING CHEMISTRY I
1
A
PASS
22GE001
FUNDAMENTALS OF COMPUTING
1
A
PASS
22GE004
BASICS OF ELECTRONICS ENGINEERING
1
A
PASS
22HS002
STARTUP MANAGEMENT
1
A+
PASS
22HS001
FOUNDATIONAL ENGLISH
1
C
PASS
22HS003
HERITAGE OF TAMILS
1
A+
PASS`;

const parseData = (data) => {
    const lines = data.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed = [];

    let i = 0;
    while (i < lines.length) {
        // Skip header words if pasted by accident
        if (lines[i] === "Course Code" || lines[i] === "Course Name" || lines[i] === "Semester" || lines[i] === "Grade" || lines[i] === "Result") {
            i++;
            continue;
        }

        const code = lines[i++];
        const name = lines[i++];
        const semester = parseInt(lines[i++], 10);
        const grade = lines[i++];

        // optional pass/fail parsing
        let result = "PASS";
        if (i < lines.length && (lines[i] === "PASS" || lines[i] === "FAIL" || lines[i] === "Completed")) {
            result = lines[i++]; // advance past Result
        }

        // In the data, "Completed" was given as Grade for ENVIRONMENTAL SCIENCE, and PASS as Result. 
        // Let's handle special cases if parsing went a bit off:
        // if grade is not a typical letter grade, maybe just store it

        parsed.push({ code, name, semester, grade });
    }
    return parsed;
}

const getMarksForGrade = (grade) => {
    if (grade === "O") return { t: 95, i: 38, e: 57 };
    if (grade === "A+") return { t: 90, i: 36, e: 54 };
    if (grade === "A") return { t: 85, i: 34, e: 51 };
    if (grade === "B+") return { t: 75, i: 30, e: 45 };
    if (grade === "B") return { t: 65, i: 26, e: 39 };
    if (grade === "C") return { t: 55, i: 22, e: 33 };
    if (grade === "D") return { t: 45, i: 18, e: 27 };
    return { t: 60, i: 24, e: 36 }; // default for things like "Completed"
};

const run = async () => {
    try {
        await connectDB();

        const email = "samshibin.it23@bitsathy.ac.in";
        const student = await Student.findOne({ email });

        if (!student) {
            console.error("Student with email", email, "not found!");
            process.exit(1);
        }

        const courseRecords = parseData(rawData);

        for (const record of courseRecords) {
            // Check if subject exists
            let subject = await Subject.findOne({ code: record.code });
            if (!subject) {
                subject = await Subject.create({
                    code: record.code,
                    name: record.name,
                    semester: record.semester,
                    credits: 3 // default
                });
            }

            const m = getMarksForGrade(record.grade);

            // Upsert mark
            await Mark.findOneAndUpdate(
                { studentId: student._id, subjectId: subject._id },
                {
                    internalMarks: m.i,
                    externalMarks: m.e,
                    totalMarks: m.t,
                    grade: record.grade,
                    semester: record.semester,
                    academicYear: "2023-24" // Arbitrary default
                },
                { upsert: true, new: true }
            );
        }

        console.log("Successfully seeded", courseRecords.length, "marks for student", email);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

run();

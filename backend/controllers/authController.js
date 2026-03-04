import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check Student
    let user = await Student.findOne({ email });
    let role = "student";

    // If not student, check Admin
    if (!user) {
      user = await Admin.findOne({ email });
      role = "admin";
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate Token
    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        studentId: user.studentId, // Only for students
        department: user.department, // Only for students
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, role, studentId, department } = req.body;

    // Check if user already exists in either collection
    const studentExists = await Student.findOne({ email });
    const adminExists = await Admin.findOne({ email });

    if (studentExists || adminExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === "student") {
      await Student.create({
        email,
        password: hashedPassword,
        name,
        role: "student",
        studentId,
        department,
        currentSemester: 1, // Default value
        cgpa: 0, // Default value
      });
    } else if (role === "admin") {
      await Admin.create({
        email,
        password: hashedPassword,
        name,
        // Admin schema doesn't have role field, it's implicit or checked by collection
        department,
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

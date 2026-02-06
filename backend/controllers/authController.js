import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { loginService } from "../services/authService.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    res.json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, role, studentId, department } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      studentId,
      department,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);  // 👈 IMPORTANT DEBUG LINE
    res.status(500).json({ message: "Server Error" });
  }
};

import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils/generateToken.js";

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured in server .env");
  }
  return new OAuth2Client(clientId);
};

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
    const token = generateToken(user._id, role);

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

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const googleClient = getGoogleClient();
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email not provided by Google" });
    }

    // Check Admin first (admins may use Google if email matches)
    let user = await Admin.findOne({ email });
    let role = "admin";

    // If not admin, check Student
    if (!user) {
      user = await Student.findOne({ email });
      role = "student";
    }

    // If user is not found in either collection, reject login
    if (!user) {
      return res.status(403).json({ message: "Access denied. Your email is not registered in the system." });
    }

    const token = generateToken(user._id, role);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        studentId: user.studentId,
        department: user.department,
        picture: user.picture || picture,
      },
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    const msg = String(error?.message || "Google sign-in failed");
    if (msg.includes("GOOGLE_CLIENT_ID is not configured")) {
      return res.status(500).json({ message: msg });
    }
    // Common verifyIdToken errors: wrong audience, token expired, etc.
    if (
      msg.toLowerCase().includes("wrong recipient") ||
      msg.toLowerCase().includes("audience") ||
      msg.toLowerCase().includes("token used too late") ||
      msg.toLowerCase().includes("invalid token") ||
      msg.toLowerCase().includes("jwt")
    ) {
      return res.status(401).json({ message: "Invalid Google token (check Client ID and authorized origin)" });
    }
    return res.status(500).json({ message: "Google sign-in failed. Please try again." });
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

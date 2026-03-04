import mongoose from "mongoose";
import Mark from "../models/Mark.js";
import Request from "../models/Request.js";
import Student from "../models/Student.js";

export const getStudentMarks = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Students can only fetch their own marks
    if (req.user?.id && req.user.id !== studentId) {
      return res.status(403).json({ message: "Not allowed to view another student's marks" });
    }

    const marks = await Mark.find({ studentId })
      .populate("subjectId", "code name semester credits");

    res.json(marks);
  } catch (err) {
    console.error("getStudentMarks error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Students can only fetch their own stats
    if (req.user?.id && req.user.id !== studentId) {
      return res.status(403).json({ message: "Not allowed to view another student's stats" });
    }

    let targetStudent = await Student.findById(studentId);
    if (!targetStudent) {
      targetStudent = await Student.findOne({ studentId: studentId });
    }

    if (!targetStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const dbId = targetStudent._id;

    const totalSubjects = await Mark.countDocuments({ studentId: dbId });
    const pending = await Request.countDocuments({ studentId: dbId, status: "pending" });
    const approved = await Request.countDocuments({ studentId: dbId, status: "approved" });
    const rejected = await Request.countDocuments({ studentId: dbId, status: "rejected" });
    const inReview = await Request.countDocuments({ studentId: dbId, status: "in_review" });

    res.json({
      totalSubjects,
      currentSemester: targetStudent.currentSemester ?? 0,
      cgpa: targetStudent.cgpa ?? 0,
      totalRequests: pending + approved + rejected + inReview,
      pendingRequests: pending,
      approvedRequests: approved,
      rejectedRequests: rejected,
      inReviewRequests: inReview,
    });
  } catch (err) {
    console.error("getStudentStats error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

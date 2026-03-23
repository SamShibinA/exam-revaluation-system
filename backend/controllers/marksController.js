import mongoose from "mongoose";
import Mark from "../models/Mark.js";
import Request from "../models/Request.js";
import Student from "../models/Student.js";

export const getStudentMarks = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Students can only fetch their own marks
    if (req.user?.id && req.user.id !== studentId) {
      // Note: req.user.id is the MongoDB _id. If studentId parameter is a custom string ID,
      // we need to make sure we don't block valid requests. But typically req.user.id is used here.
      // We will allow if req.user.id == studentId OR req.user.studentId == studentId
      if (req.user.studentId !== studentId) {
        return res.status(403).json({ message: "Not allowed to view another student's marks" });
      }
    }

    // Fetch marks by db ObjectId or custom studentId
    // Standard schema usually uses DB ObjectId for studentId ref in Marks
    // We try to find target student to get their _id
    let dbId = studentId;
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      dbId = studentId;
    } else {
      const student = await Student.findOne({ studentId: studentId });
      if (!student) return res.status(404).json({ message: "Student not found" });
      dbId = student._id;
    }

    const marks = await Mark.find({ studentId: dbId })
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

    // Students can only fetch their own stats
    if (req.user?.id && req.user.id !== studentId) {
      if (req.user.studentId !== studentId) {
        return res.status(403).json({ message: "Not allowed to view another student's stats" });
      }
    }

    let targetStudent = null;
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      targetStudent = await Student.findById(studentId);
    }
    
    if (!targetStudent) {
      targetStudent = await Student.findOne({ studentId: studentId });
    }

    if (!targetStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const dbId = targetStudent._id;

    const currentSemester = targetStudent.currentSemester ?? 1;

    const marks = await Mark.find({ studentId: dbId }).populate("subjectId", "credits semester");

    const getGradePoints = (grade) => {
      switch (grade?.trim().toUpperCase()) {
        case "O": return 10;
        case "A+": return 9;
        case "A": return 8;
        case "B+": return 7;
        case "B": return 6;
        case "C": return 5;
        default: return 0;
      }
    };

    let totalCredits = 0;
    let totalPoints = 0;
    
    let sgpaCredits = 0;
    let sgpaPoints = 0;

    marks.forEach(mark => {
      const credits = mark.subjectId?.credits || 0;
      const points = getGradePoints(mark.grade);
      
      totalCredits += credits;
      totalPoints += (credits * points);

      if (mark.subjectId?.semester === currentSemester) {
        sgpaCredits += credits;
        sgpaPoints += (credits * points);
      }
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    const sgpa = sgpaCredits > 0 ? (sgpaPoints / sgpaCredits) : 0;

    const totalSubjects = marks.length;
    const pending = await Request.countDocuments({ studentId: dbId, status: "pending" });
    const approved = await Request.countDocuments({ studentId: dbId, status: "approved" });
    const rejected = await Request.countDocuments({ studentId: dbId, status: "rejected" });
    const inReview = await Request.countDocuments({ studentId: dbId, status: "in_review" });

    res.json({
      totalSubjects,
      currentSemester,
      cgpa,
      sgpa,
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

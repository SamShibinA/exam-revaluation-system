import Mark from "../models/Mark.js";
import Request from "../models/Request.js";

export const getStudentMarks = async (req, res) => {
  try {
    const marks = await Mark.find({ studentId: req.params.studentId })
      .populate("subjectId");

    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const totalSubjects = await Mark.countDocuments({
      studentId: req.params.studentId,
    });

    const pending = await Request.countDocuments({
      studentId: req.params.studentId,
      status: "pending",
    });

    const approved = await Request.countDocuments({
      studentId: req.params.studentId,
      status: "approved",
    });

    const rejected = await Request.countDocuments({
      studentId: req.params.studentId,
      status: "rejected",
    });

    res.json({
      totalSubjects,
      currentSemester: 3,
      cgpa: 8.5,
      totalRequests: pending + approved + rejected,
      pendingRequests: pending,
      approvedRequests: approved,
      rejectedRequests: rejected,
      inReviewRequests: 1,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

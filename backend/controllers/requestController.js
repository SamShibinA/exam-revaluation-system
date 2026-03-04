import mongoose from "mongoose";
import Request from "../models/Request.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";

// ✅ Get requests of a particular student
export const getMyRequests = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Students can only fetch their own requests
    if (req.user?.id && req.user.id !== studentId) {
      return res.status(403).json({ message: "Not allowed to view another student's requests" });
    }

    const requests = await Request.find({ studentId })
      .populate("subjectId", "code name semester credits")
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map((r) => ({
      id: r._id,
      studentId: r.studentId,
      subjectId: r.subjectId?._id ?? r.subjectId,
      subject: r.subjectId || {},
      requestType: r.requestType,
      reason: r.reason,
      currentMarks: r.currentMarks,
      status: r.status,
      updatedMarks: r.updatedMarks,
      adminRemarks: r.adminRemarks,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error("getMyRequests error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create new request
export const createRequest = async (req, res) => {
  try {
    const { studentId, subjectId, requestType, reason, currentMarks } = req.body;

    if (!studentId || !subjectId || !requestType || !reason) {
      return res.status(400).json({ message: "studentId, subjectId, requestType and reason are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: "Invalid studentId or subjectId" });
    }

    // Students can only create requests for themselves
    if (req.user?.id && req.user.id !== studentId) {
      return res.status(403).json({ message: "Not allowed to create request for another student" });
    }

    const newRequest = new Request({
      studentId,
      subjectId,
      requestType,
      reason,
      currentMarks: currentMarks ?? null,
      status: "pending",
    });

    await newRequest.save();

    const populatedRequest = await Request.findById(newRequest._id)
      .populate("subjectId", "code name semester credits");

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error("createRequest error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all requests (Admin)
export const getAllRequests = async (req, res) => {
  try {
    let { page = 1, limit = 10, status, search } = req.query;

    page = Number(page);
    limit = Number(limit);

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      const students = await Student.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { studentId: { $regex: search, $options: "i" } },
        ]
      }).select("_id");

      const studentIds = students.map(s => s._id);
      filter.studentId = { $in: studentIds };
    }

    let query = Request.find(filter)
      .populate("subjectId", "code name semester credits")
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    const total = await Request.countDocuments(filter);

    const requests = await query
      .skip((page - 1) * limit)
      .limit(limit);

    const formatted = requests.map((r) => ({
      id: r._id,
      studentId: r.studentId?._id || "N/A",
      studentName: r.studentId?.name || "Unknown Student",
      studentEmail: r.studentId?.email || "N/A",
      subjectId: r.subjectId?._id || "N/A",
      subject: r.subjectId || { code: "N/A", name: "Unknown Subject" },
      requestType: r.requestType,
      reason: r.reason,
      currentMarks: r.currentMarks,
      updatedMarks: r.updatedMarks,
      adminRemarks: r.adminRemarks,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    res.json({
      data: formatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update request status (Admin)
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, updatedMarks, adminRemarks } = req.body;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status || request.status;
    request.updatedMarks = updatedMarks ?? request.updatedMarks;
    request.adminRemarks = adminRemarks ?? request.adminRemarks;
    request.updatedAt = new Date();

    await request.save();

    const updatedRequest = await Request.findById(id)
      .populate("subjectId", "code name semester credits")
      .populate("studentId", "name email");

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

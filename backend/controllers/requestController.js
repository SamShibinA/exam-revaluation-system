import mongoose from "mongoose";
import Request from "../models/Request.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Notification from "../models/Notification.js";
import Admin from "../models/Admin.js";
import Transaction from "../models/Transaction.js";
import Mark from "../models/Mark.js";

// ✅ Get requests of a particular student
// ... (rest of the file remains same until createRequest)
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
      amountPaid: r.amountPaid,
      paymentStatus: r.paymentStatus,
      updatedMarks: r.updatedMarks,
      adminRemarks: r.adminRemarks,
      responseSheet: r.responseSheet,
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
    const { studentId, subjectId, requestType, reason, currentMarks, amountPaid, paymentStatus, studentEmail, transactionId } = req.body;

    if (!studentId || !subjectId || !requestType || !reason || !transactionId) { // Updated required fields check
      return res.status(400).json({ message: "studentId, subjectId, requestType, transactionId and reason are required" }); // Updated message
    }

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: "Invalid studentId or subjectId" });
    }

    if (paymentStatus !== "success") {
      return res.status(400).json({ message: "Payment must be successful to submit a request" });
    }

    // Students can only create requests for themselves
    if (req.user?.id && req.user.id !== studentId) {
      return res.status(403).json({ message: "Not allowed to create request for another student" });
    }

    // Prevent duplicate review/revaluation requests for the same subject
    const existingRequest = await Request.findOne({ studentId, subjectId, requestType });
    if (existingRequest) {
      return res.status(400).json({ message: `You have already applied for ${requestType} for this subject.` });
    }

    const newRequest = new Request({
      studentId,
      subjectId,
      studentEmail,
      requestType,
      reason,
      currentMarks: currentMarks ?? null,
      amountPaid,
      paymentStatus: "success",
      transactionId: transactionId || "N/A",
      status: "pending",
    });

    await newRequest.save();

    // Link the transaction to this request if transactionId is provided
    if (transactionId) {
      await Transaction.findOneAndUpdate(
        { transactionId: transactionId },
        { requestId: newRequest._id }
      );
    }

    const populatedRequest = await Request.findById(newRequest._id)
      .populate("subjectId", "code name semester credits");

    // Notify all admins
    const admins = await Admin.find({});
    const notifications = admins.map((admin) => ({
      userId: admin._id,
      title: "New Request Submitted",
      message: `A new ${requestType} request has been submitted by ${studentEmail} for subject ${populatedRequest.subjectId?.code || "Unknown"}.`,
      type: "info",
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

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
      studentEmail: r.studentEmail || r.studentId?.email || "N/A",
      subjectId: r.subjectId?._id || "N/A",
      subject: r.subjectId || { code: "N/A", name: "Unknown Subject" },
      requestType: r.requestType,
      reason: r.reason,
      currentMarks: r.currentMarks,
      updatedMarks: r.updatedMarks,
      adminRemarks: r.adminRemarks,
      responseSheet: r.responseSheet,
      amountPaid: r.amountPaid,
      paymentMethod: r.paymentMethod,
      paymentStatus: r.paymentStatus,
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

    if (request.requestType === "revaluation" && status === "approved") {
      if (updatedMarks === undefined || updatedMarks === null || String(updatedMarks).trim() === "") {
        return res.status(400).json({ message: "Updated marks are required for approving revaluation requests" });
      }

      const markDoc = await Mark.findOne({ studentId: request.studentId, subjectId: request.subjectId });
      if (markDoc) {
        markDoc.totalMarks = Number(updatedMarks);
        if (markDoc.internalMarks !== undefined && markDoc.internalMarks !== null) {
          markDoc.externalMarks = Number(updatedMarks) - markDoc.internalMarks;
        } else {
          markDoc.externalMarks = Number(updatedMarks);
        }
        await markDoc.save();
      }
    }

    request.status = status || request.status;
    request.updatedMarks = updatedMarks ?? request.updatedMarks;
    request.adminRemarks = adminRemarks ?? request.adminRemarks;
    request.updatedAt = new Date();

    await request.save();

    const updatedRequest = await Request.findById(id)
      .populate("subjectId", "code name semester credits")
      .populate("studentId", "name email");

    // Notify the student (auth uses Student model; request.studentId is Student._id from frontend)
    const studentUserId = request.studentId;
    if (studentUserId) {
      const newStatus = status || request.status;
      await Notification.create({
        userId: studentUserId,
        title: "Request Status Updated",
        message: `Your request for ${updatedRequest.subjectId?.name || "subject"} has been updated to: ${newStatus}.${adminRemarks ? ` Remarks: ${adminRemarks}` : ""}`,
        type: newStatus === "approved" || newStatus === "completed" ? "success" : newStatus === "rejected" ? "error" : "info",
      });
    }

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

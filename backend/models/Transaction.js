import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  studentEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  paymentMethod: { type: String, default: "Google Pay" },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  requestType: { type: String, required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" }, // Will be linked after request creation
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", TransactionSchema);

import Transaction from "../models/Transaction.js";

// ✅ Payment Simulation Controller
// For this project, we are simulating a Google Pay transaction.

export const verifyPayment = async (req, res) => {
  try {
    const { amount, studentEmail, requestType, studentId } = req.body;

    if (!amount || !studentEmail || !requestType || !studentId) {
      return res.status(400).json({ message: "Amount, studentEmail, studentId and requestType are required" });
    }

    // Simulate verification (always success for this training project)
    const transactionId = `GPAY_${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    // Save transaction to database
    const newTransaction = new Transaction({
      transactionId,
      studentId,
      studentEmail,
      amount,
      requestType,
      paymentStatus: "success",
      paymentMethod: "Google Pay"
    });

    await newTransaction.save();

    const paymentData = {
      transactionId,
      status: "success",
      amount,
      studentEmail,
      requestType,
      paymentMethod: "Google Pay",
      timestamp: newTransaction.createdAt
    };

    res.status(200).json({
      message: "Payment successfully verified and recorded (Simulation)",
      paymentData
    });
  } catch (error) {
    console.error("verifyPayment error:", error);
    res.status(500).json({ message: "Internal Server Error during payment verification" });
  }
};

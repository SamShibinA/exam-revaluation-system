import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from '../models/Transaction.js';
import Request from '../models/Request.js';

dotenv.config();

const verifyDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/revaluation_system');
    console.log('Connected to MongoDB');

    // Find the latest transaction
    const latestTransaction = await Transaction.findOne().sort({ createdAt: -1 });
    if (!latestTransaction) {
      console.log('No transactions found.');
    } else {
      console.log('Latest Transaction:', {
        id: latestTransaction._id,
        transactionId: latestTransaction.transactionId,
        studentEmail: latestTransaction.studentEmail,
        amount: latestTransaction.amount,
        requestId: latestTransaction.requestId,
        paymentStatus: latestTransaction.paymentStatus
      });

      if (latestTransaction.requestId) {
        const linkedRequest = await Request.findById(latestTransaction.requestId);
        if (linkedRequest) {
          console.log('Linked Request Found:', {
            id: linkedRequest._id,
            requestType: linkedRequest.requestType,
            transactionId: linkedRequest.transactionId,
            paymentStatus: linkedRequest.paymentStatus
          });

          if (linkedRequest.transactionId === latestTransaction.transactionId) {
            console.log('SUCCESS: Transaction and Request are correctly linked!');
          } else {
            console.log('FAILURE: transactionId mismatch between Transaction and Request.');
          }
        } else {
          console.log('FAILURE: Linked Request ID exists but record not found.');
        }
      } else {
        console.log('PENDING: Transaction exists but no requestId linked yet.');
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Verification error:', error);
  }
};

verifyDatabase();

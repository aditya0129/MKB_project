const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId;



const walletSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      amount: { type: Number, required: true },
      type: { type: String, enum: ['credit', 'debit'], required: true },
      date: { type: Date, default: Date.now },
      referenceId: { type: String }, // For payment gateway reference
    },
  ],
});

module.exports = mongoose.model('Wallet', walletSchema);
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const transactionSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "UserData" },
  amount: Number,
  type: String,
  date: Date,
});

module.exports = mongoose.model("Transaction", transactionSchema);

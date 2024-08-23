const userModel = require("../models/userModel");
const Wallet_Model = require("../models/Wallet_Model");
const Transaction_Model = require("../models/Transaction_Model");

// Get user wallet balance

const wallet = async (req, res) => {
  try {
    const { userId } = req.token;
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res.status(201).json({ status: false, MSg: "user not Find" });
    }
    return res
      .status(201)
      .json({ status: true, data: { walletBalance: user.walletBalance } });
  } catch (error) {
    return res.status(500).json({ status: false, MSG: error.message });
  }
};

const add_amount = async (req, res) => {
  try {
    const { userId } = req.token;
    const { amount } = req.body;
    const user = await userModel.findById({ _id: userId });
    user.walletBalance += amount;
    await user.save();
    const transaction = new Transaction_Model({
      userId: user._id,
      amount,
      type: "credit",
    });
    await transaction.save();
    res.json({ success: true, message: "Amount added to wallet" });
  } catch (error) {
    return res.status(500).json({ status: false, MSG: error.message });
  }
};

const deduct_amount = async (req, res) => {
  try {
    const { userId } = req.token;
    const { amount } = req.body;
    const user = await userModel.findById({ _id: userId });
    if (user.walletBalance >= amount) {
      user.walletBalance -= amount;
      await user.save();
      const transaction = new Transaction_Model({
        userId: user._id,
        amount,
        type: "debit",
      });
      await transaction.save();
      res.json({ success: true, message: "Amount deducted from wallet" });
    } else {
      res.json({ success: false, message: "Insufficient balance" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, MSG: error.message });
  }
};

module.exports = {
  wallet,
  add_amount,
  deduct_amount,
};

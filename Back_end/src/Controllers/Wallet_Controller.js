const userModel = require("../models/userModel");
const Advisor_Model = require("../models/Advisor_Model");
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

// GET: Notify user if balance left only for 2 minutes

const check_balance_warning = async (req, res) => {
  try {
    const { userId, advisorId } = req.params;
    console.log("this one")

    const user = await userModel.findById({_id: userId });
    const advisor = await Advisor_Model.findById({_id: advisorId });

    if (!user || !advisor) {
      return res.status(404).json({ message: "User or Advisor not found" });
    }

    const minutesLeft = Math.floor(user.wallet / advisor.ratePerMinute);

    if (minutesLeft <= 2) {
      return res.json({
        warning: true,
        message: `⚠️ Your wallet balance is low. You have only ${minutesLeft} minutes left.`,
        minutesLeft,
        balance: user.wallet,
      });
    }

    res.json({
      warning: false,
      message: `✅ You have ${minutesLeft} minutes available.`,
      minutesLeft,
      balance: user.wallet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  wallet,
  add_amount,
  deduct_amount,
  check_balance_warning,
};

const mongoose = require("mongoose");
const Call_Model = require("../models/Call_CostCutting_Model");
const UserModel = require("../models/userModel");

// 1. Start Call API
const start_call = async (req, res) => {
  try {
    const { callerId, calleeId, startTime } = req.body;

    const newCall = new Call_Model({
      callerId,
      calleeId,
      startTime,
    });

    await newCall.save();
    res.status(201).json({ message: "Call started", callId: newCall._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to start call", err: error.message });
  }
};

// 2. Update Call API
const update_call = async (req, res) => {
  try {
    const { callId, endTime, duration } = req.body;

    const updatedCall = await Call_Model.findByIdAndUpdate(
      callId,
      {
        endTime,
        duration,
      },
      { new: true }
    );

    if (!updatedCall) {
      return res.status(404).json({ error: "Call not found" });
    }

    res.status(200).json({ message: "Call updated", Data: updatedCall });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update call", err: error.message });
  }
};

// 3. Calculate Cost API
const calculate_cost = async (req, res) => {
  try {
    const { callId, costPerMinute } = req.body;

    const call = await Call_Model.findById(callId);
    if (!call || !call.duration) {
      return res
        .status(404)
        .json({ error: "Call not found or duration missing" });
    }

    const totalCost = (call.duration / 60) * costPerMinute;
    call.totalCost = totalCost;

    await call.save();

    res.status(200).json({ message: "Cost calculated", Data: totalCost });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to calculate cost", err: error.message });
  }
};

// 4. Retrieve Call Data API
const retrieve_calls = async (req, res) => {
  try {
    const calls = await Call_Model.find();
    res.status(200).json({ status: true, Data: calls });
  } catch (error) {
    res.status(500).json({
      Status: false,
      error: "Failed to retrieve call data",
      err: error.message,
    });
  }
};

const deduct_call_amount = async (req, res) => {
  try {
    let { userId, timerText } = req.body;

    if (!userId || !timerText) {
      return res
        .status(400)
        .json({ message: "userId and timerText are required" });
    }

    // Ensure timerText is always a string
    if (typeof timerText !== "string") {
      timerText = String(timerText);
    }

    console.log("Received timerText:", timerText);

    // ✅ Parse timerText ("hh:mm:ss")
    const parts = timerText.split(":");
    if (parts.length !== 3) {
      return res
        .status(400)
        .json({ message: "Invalid timerText format. Expected hh:mm:ss" });
    }

    const [hours, minutes, seconds] = parts.map((num) => parseInt(num, 10) || 0);

    // ✅ Total duration in seconds
    const durationInSeconds = hours * 3600 + minutes * 60 + seconds;

    // ✅ Rate logic (₹5 per minute => per second rate)
    const ratePerMinute = 5;
    const ratePerSecond = ratePerMinute / 60;

    // ✅ Total deduction
    const totalDeduction = parseFloat((durationInSeconds * ratePerSecond).toFixed(2));

    // ✅ Update wallet
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.walletBalance < totalDeduction) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    user.walletBalance -= totalDeduction;
    await user.save();

    return res.json({
      message: `Call ended. Deducted ₹${totalDeduction} for ${timerText}`,
      wallet: user.walletBalance,
      durationInSeconds,
      timerText: `User talked for ${timerText}`,
    });
  } catch (err) {
    console.error("Error in deductCallAmount:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deduct_wallet = async (req, res) => {
  try {
    const { userId, timerText } = req.body;

    // basic validation
    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!timerText) return res.status(400).json({ message: "timerText is required" });

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // ensure timerText is string and parse hh:mm:ss
    const t = typeof timerText === "string" ? timerText : String(timerText);
    const parts = t.split(":");
    if (parts.length !== 3) {
      return res.status(400).json({ message: "Invalid timerText format. Expected hh:mm:ss" });
    }
    const [hh, mm, ss] = parts.map((p) => parseInt(p, 10) || 0);
    const totalSeconds = hh * 3600 + mm * 60 + ss;

    // find user
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ensure lastDeductedSeconds exists on the user model (initialize if missing)
    if (typeof user.lastDeductedSeconds !== "number") {
      user.lastDeductedSeconds = 0;
    }

    // new seconds since last deduction (prevents double-deduct)
    const newSeconds = totalSeconds - user.lastDeductedSeconds;
    if (newSeconds <= 0) {
      return res.json({
        message: "No new time to deduct",
        wallet: user.walletBalance,
        popup: user.walletBalance <= 10,
        durationInSeconds: totalSeconds,
      });
    }

    // rate per second — use 0.08 as requested (or change to 5/60 for exact ₹5/min)
    const ratePerSecond = 0.08;
    const deduction = Number((newSeconds * ratePerSecond).toFixed(2));

    // check balance
    if (user.walletBalance < deduction) {
      return res.status(400).json({
        message: "Insufficient wallet balance. Please recharge.",
        wallet: user.walletBalance,
        popup: true,
      });
    }

    // subtract only the incremental deduction and store checkpoint
    user.walletBalance = Number((user.walletBalance - deduction).toFixed(2));
    user.lastDeductedSeconds = totalSeconds;

    await user.save();

    return res.json({
      message: `Deducted ₹${deduction} for ${newSeconds} seconds (total ${totalSeconds}s)`,
      wallet: user.walletBalance,
      durationInSeconds: totalSeconds,
      popup: user.walletBalance <= 10,
    });
  } catch (err) {
    console.error("Error in deduct_wallet:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const end_call = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Reset only at call end
    user.lastDeductedSeconds = 0;
    await user.save();

    return res.json({ message: "Call ended. lastDeductedSeconds reset to 0." });
  } catch (err) {
    console.error("Error in end_call:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { start_call, update_call, calculate_cost, retrieve_calls, deduct_call_amount, deduct_wallet, end_call };

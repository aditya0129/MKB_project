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
    const { userId, durationInMinutes } = req.body;

    if (!userId || !durationInMinutes) {
      return res
        .status(400)
        .json({ message: "userId and durationInMinutes are required" });
    }

    const user = await UserModel.findById({_id:userId});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Logic: 1 min = ₹5
    const ratePerMinute = 5;
    const deduction = durationInMinutes * ratePerMinute;

    if (user.walletBalance < deduction) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    user.walletBalance -= deduction;
    await user.save();

    return res.json({
      message: `Deducted ₹${deduction} for ${durationInMinutes} minutes`,
      remainingBalance: user.walletBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { start_call, update_call, calculate_cost, retrieve_calls,deduct_call_amount };

const mongoose = require("mongoose");

// for forget password using Nodemailer

const Advisor_Otp_schema = new mongoose.Schema({
  advisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Advisor",
  },
  Email: {
    type: String,
    required: true,
  },
  Otp: {
    type: String,
    required: true,
  },
  timestamps: {
    type: Date,
    default: Date.now,
    get: (otpExpiration) => otpExpiration.getTime(),
    set: (otpExpiration) => new Date(otpExpiration),
  },
});

module.exports = mongoose.model("Advisor_Otp_Data", Advisor_Otp_schema);

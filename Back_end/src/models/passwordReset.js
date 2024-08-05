const mongoose = require("mongoose");

// for forget password using Nodemailer

const PasswordResetSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: "UserData",
  },

  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PasswordReset", PasswordResetSchema);

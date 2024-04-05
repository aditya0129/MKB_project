const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      uniue: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLen: 8,
      maxLen: 15,
    },
    number: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Lgbtq"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserData", UserSchema);
 
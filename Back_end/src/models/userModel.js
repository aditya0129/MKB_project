const mongoose = require("mongoose");
const { Number } = require("twilio/lib/twiml/VoiceResponse");

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
    birthdate: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
    },
    place: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Lgbtq", "male", "female"],
      required: true,
    },
    is_verified:{
      type:Number,
      default:0
    },
    image:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserData", UserSchema);

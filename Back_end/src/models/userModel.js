const mongoose = require("mongoose");
const { Number } = require("twilio/lib/twiml/VoiceResponse");
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, uniue: true, trim: true },

    password: {
      type: String,
      required: true,
      trim: true,
      minLen: 8,
      maxLen: 15,
    },

    number: { type: Number, required: true, unique: true, trim: true },

    birthdate: { type: Date, required: true },

    age: { type: Number },

    place: { type: String, required: true },

    gender: {
      type: String,
      enum: ["Male", "Female", "Lgbtq", "male", "female"],
      required: true,
    },

    is_verified: { type: Number, default: 0 },

    image: { type: String, required: true },

    category: { type: String, required: true },

    sub_category: { type: String },

    walletBalance: {
      type: Number,
      default: 0,
    },

    transactions: [{ type: ObjectId, ref: "Transaction" }],

    profasion: {
      type: String,
    },

    advisor_history: {
      type: String,
      default: "in future here we will be show a Advisor History",
    },

    review: {
      type: String,
      default:
        "in future we will give a feature here will be shown a all user review_history by given the user",
    },

    notification: {
      type: String,
      default: "",
    },

    advisorDetails: {
      advisorId: { type: mongoose.Schema.Types.ObjectId, ref: "Advisor" },
      Name: { type: String },
      Gender: { type: String },
      Image: { type: String },
      Expertise: { type: String },
      Experience: { type: String },
    },

    category_strength: {
      type: String,
      default: "",
    },

    subcategory_strength: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("UserData", UserSchema);

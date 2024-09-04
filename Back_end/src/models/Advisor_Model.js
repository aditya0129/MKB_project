const mongoose = require("mongoose");

const advisorSchema = new mongoose.Schema(
  {
    Name: { type: String },

    Number: { type: Number },

    Email: { type: String },

    Password: { type: String },

    Expertise: { type: String },

    Image: { type: String },

    DOB: { type: Date },

    Age: { type: Number },

    Gender: { type: String, enum: ["Male", "Female", "Other"] },

    Experience: { type: String },

    City: { type: String },

    State: { type: String },

    Language: { type: String },

    Notification: { type: String, default: "" },

    created_at: { type: Date, default: Date.now },

    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advisor", advisorSchema);

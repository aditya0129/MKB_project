const mongoose = require("mongoose");

const advisorSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },

    Number: { type: Number, required: true },

    Email: { type: String, required: true },

    Password: { type: String, required: true },

    Expertise: { type: String, required: true },

    Image: { type: String },

    DOB: { type: Date },

    Age: { type: Number },

    Gender: { type: String, enum: ["Male", "Female", "Other"] },

    Experience: { type: String },
    City: { type: String },

    State: { type: String },

    Language: { type: String },

    created_at: { type: Date, default: Date.now },

    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advisor", advisorSchema);

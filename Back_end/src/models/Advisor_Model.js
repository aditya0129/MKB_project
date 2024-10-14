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

    userDetails: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
      name: { type: String },
      image: { type: String },
      gender: { type: String },
      category: { type: String },
      sub_category: { type: String },
    },

    About: { type: String, default: "" },

    Analytical_Strength: { type: String, default: "" },

    Problem_Solving_Strength: { type: String, default: "" },

    Public_Speaking_Strength: { type: String, default: "" },

    Adaptable_Strength: { type: String, default: "" },

    Communication_Strength: { type: String, default: "" },

    P_S_Strength: { type: String, default: "" },

    Leadership_Experience_Strength: { type: String, default: "" },

    Goal: { type: String, default: "" },

    is_verified: { type: Number, default: 0 },

    created_at: { type: Date, default: Date.now },

    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advisor", advisorSchema);

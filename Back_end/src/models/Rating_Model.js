const mongoose = require("mongoose");

const Object_Id = mongoose.Schema.Types.ObjectId;

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: Object_Id,
      ref: "UserData",
      required: true,
    },
    advisorId: {
      type: Object_Id,
      ref: "Advisor",
      required: true,
    },
    stars: { type: Number, min: 1, max: 5, required: true }, // 1-5 stars
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);

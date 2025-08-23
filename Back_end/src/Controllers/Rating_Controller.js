const Rating_Model = require("../models/Rating_Model.js");
const Advisor_model = require("../models/Advisor_Model.js");

// POST: Submit rating
// const Rating = async (req, res) => {
//   try {
//     const { userId, advisorId, stars, feedback } = req.body;

//     if (!userId || !advisorId || !stars) {
//       return res
//         .status(400)
//         .json({ message: "userId, advisorId & stars are required" });
//     }

//     // Save rating
//     const rating = new Rating_Model({ userId, advisorId, stars, feedback });
//     await rating.save();

//     // Update advisor average rating
//     const ratings = await Rating_Model.find({ advisorId });
//     const avgRating =
//       ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;

//     await Advisor_model.findByIdAndUpdate(advisorId, {
//       avgRating: avgRating.toFixed(1),
//     });

//     res.json({ message: "Rating submitted", avgRating });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const Rating = async (req, res) => {
  try {
    const { userId, advisorId, stars, feedback } = req.body;

    if (!userId || !advisorId || !stars) {
      return res
        .status(400)
        .json({ message: "userId, advisorId & stars are required" });
    }

    // ⭐ Validate stars range
    if (stars < 1 || stars > 5) {
      return res
        .status(400)
        .json({ message: "Invalid rating. You can give 1 to 5 stars only." });
    }

    // Check if rating already exists
    let rating = await Rating_Model.findOne({ userId, advisorId });

    if (rating) {
      // Update old rating
      rating.stars = stars;
      rating.feedback = feedback;
      await rating.save();
    } else {
      // Create new rating
      rating = new Rating_Model({ userId, advisorId, stars, feedback });
      await rating.save();
    }

    // Recalculate advisor average rating
    const ratings = await Rating_Model.find({ advisorId });
    const avgRating =
      ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;

    await Advisor_model.findByIdAndUpdate(advisorId, {
      avgRating: avgRating.toFixed(1),
    });

    res.json({ message: "Rating submitted/updated", avgRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET: fetch ratings of an advisor
const Ratings_Get = async (req, res) => {
  try {
    const { advisorId } = req.params;
    const ratings = await Rating_Model.find({ advisorId }).populate(
      "userId",
      "name"
    );
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Rating, Ratings_Get };

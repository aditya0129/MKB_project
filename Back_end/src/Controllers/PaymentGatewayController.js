const Payment_Model = require("../models/PaymentModel.js");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const userModel = require("../models/userModel.js");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// const checkout = async (req, res) => {
//   try {
//     const { userId } = req.token;
//     const options = {
//       amount: Number(req.body.amount * 100),
//       currency: "INR",
//     };
//     const order = await instance.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     return res.status(500).json({ status: false, MSG: error.message });
//   }
// };

const checkout = async (req, res) => {
  try {
    const { amount } = req.body;
    const { userId } = req.token; // Assuming you're using authentication middleware that adds user info to req

    // Create order options for Razorpay
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };

    // Create a new order with Razorpay
    const order = await instance.orders.create(options);
    order.amount += Number(amount / 100);

    // Assuming you have a User model and want to update the wallet balance
    // Fetch the user by ID
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    // Update the user's wallet balance

    user.walletBalance += Number(amount);
    //user.walletBalance / 100;

    // Increase the balance by the order amount
    await user.save(); // Save the updated user document

    // Respond with order and success message
    res.status(200).json({
      success: true,
      order,
      Data: user,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ status: false, MSG: error.message });
  }
};

const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Create the body string for HMAC validation
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Calculate the expected signature using the Razorpay secret
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET) // Ensure this is the correct env variable
      .update(body.toString())
      .digest("hex");

    // Check if the signatures match
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Save the payment details to the database
      await Payment_Model.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // Redirect to the frontend with the payment reference
      res.redirect(
        `https://myvideochat.space/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, MSG: error.message });
  }
};

const Razor_Key = function (req, res) {
  return res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};

module.exports = { checkout, paymentVerification, Razor_Key };

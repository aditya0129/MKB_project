const Payment_Model = require("../models/PaymentModel.js");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
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
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
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

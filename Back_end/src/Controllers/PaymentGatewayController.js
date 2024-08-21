/* const Razorpay = require("razorpay");
const usermodel=require('../models/userModel')

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

async function addAmountToWallet(userId, amount) {
  try {
    // Create an order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: "INR",
      payment_capture: 1, // Auto capture
    });

    const paymentId = "PAYMENT_ID_FROM_CLIENT";
    const payment = await razorpay.payments.fetch(paymentId);

    // Check if payment was successful
    if (payment.status === "captured") {
      // Add amount to wallet
      const user = await usermodel.findById(userId);
      user.walletBalance += amount;
      await user.save();
      return { success: true, message: "Amount added to wallet successfully" };
    } else {
      return { success: false, message: "Payment failed" };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error adding amount to wallet: ${error.message}`,
    };
  }
}

//You can call this function by passing the user ID and amount as arguments, like this:
addAmountToWallet("USER_ID", 10.99);
 */

/* const Razorpay = require("razorpay");
const usermodel = require("../models/userModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

// Function to create an order
async function createOrder(req, res) {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: "INR",
      payment_capture: 1, // Auto capture
    });

    res.status(201).json({ data: { orderId: order.id }, order_Data: order });
  } catch (error) {
    return res.status(500).send({ status: false, Msg: error.message });
  }
}

// Function to add amount to wallet
async function addAmountToWallet(req, res) {
  try {
    const { userId, paymentId } = req.body;
    console.log("userid:"+userId,  "paymentId :"+paymentId)

    const payment = await razorpay.payments.fetch(paymentId);
    console.log(payment);

    if (payment.status === "captured") {
      const amount = payment.amount / 100; // Convert amount from paise to INR
      const user = await usermodel.findById(userId);
      user.walletBalance += amount;
      await user.save();

      res.status(200).json({ data: { walletBalance: user.walletBalance } });
    } else {
      res.status(500).json({ message: "Payment failed" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, Msg: error.message });
  }
}

module.exports = {
  createOrder,
  addAmountToWallet,
}; */

/* import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js"; */
//const { instance } = require("../index.js");
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

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database comes here

      await Payment_Model.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, MSG: error.message });
  }
};



const Razor_Key= function(req,res){
   return res.status(200).json({key: process.env.RAZORPAY_API_KEY })
}

module.exports = { checkout, paymentVerification ,Razor_Key};

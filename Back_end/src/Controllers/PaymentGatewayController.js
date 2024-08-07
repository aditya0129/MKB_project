const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY_ID",
  key_secret: "YOUR_RAZORPAY_KEY_SECRET",
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
      const user = await User.findById(userId);
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

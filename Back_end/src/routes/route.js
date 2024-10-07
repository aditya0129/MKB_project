require("dotenv").config();

const express = require("express");
const router = express.Router();
const {
  Register_User,
  Login_user,
  get_Users,
  Update_User,
  Get_All_User,
  forgotPassword,
  resetPassword,
  User_Home,
  forget_password,
  sendNotification,
  update_Password,
  updateProfile,
} = require("../Controllers/UserControllers");
const { sendOtp, VerifyOtp } = require("../Controllers/OtpVerfy");
const {
  Advisor_register,
  Advisor_Login,
  get_Advisor,
  Get_All_Advisor,
  Edit_Advisor_Profile,
  acceptNotification,
  rejectNotification,
  busyNotification,
  advisor_send_otp_fp,
  advisor_verify_otp_fp,
  Advisor_Update_Password,
  Advisor_Update_Profile,
} = require("../Controllers/Advisor_controller");
//const {createOrder,addAmountToWallet}=require('../Controllers/PaymentGatewayController')
const { isAuthenticated, isAuthorized } = require("../Auth/Middi");
const {
  otpmailvalidator,
  verifymailvalidator,
  advisorotpmailvalidator,
  advisorverifymailvalidator,
} = require("../Validation/Validate");
const {
  send_otp_fp,
  verify_otp_fp,
} = require("../Controllers/UserControllers");

const {
  wallet,
  add_amount,
  deduct_amount,
} = require("../Controllers/Wallet_Controller");

const {
  checkout,
  paymentVerification,
  Razor_Key,
} = require("../Controllers/PaymentGatewayController");
//----------------------------------------------Multer function for uploding Files/Images----------------------------------------------//
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, "public/images");
      console.log(req.file);
    }
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uplode = multer({ storage: storage, fileFilter: fileFilter });
//-------------------------------------------------------------------------------------//

// User_APIS
router.post("/Register", uplode.single("image"), Register_User);
router.post("/Login", Login_user);
router.post("/Notification/:advisorId", isAuthenticated, sendNotification);
router.get("/User_Home/Advisor_detail", isAuthenticated, User_Home);
router.get("/get_user/profile", isAuthenticated, get_Users);
router.put("/user/:userId/profile", Update_User);
router.get("/User_All_Data", Get_All_User);
router.post("/UpdatePassword/:user_id", update_Password);
router.patch(
  "/UpdateProfile",
  uplode.single("image"),
  isAuthenticated,
  updateProfile
);
//router.post("/User_Wallet/:User_id",User_Wallet)

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/forget_password", forget_password);
// router.get('/generateOTP/:userId',generate_Otp)
// router.get('/verifyOTP/:userId/:otp',Verify_Otp)

//user wallet api's
router.get("/wallet", isAuthenticated, wallet);
//Add amount to wallet
router.post("/add_amount", isAuthenticated, add_amount);
// Deduct amount from wallet
router.post("/deduct_amount", isAuthenticated, deduct_amount);

//payment-intigration by razorpay*
// Route to create an order
//router.post("/create-order", createOrder);

// Route to add amount to wallet
//router.post("/add-to-wallet", addAmountToWallet);

// router.route("/checkout").post(checkout);
// router.route("/paymentverification").post(paymentVerification);

router.post("/checkout", isAuthenticated, checkout);
router.post("/paymentverification", paymentVerification);
router.get("/getkey", Razor_Key);

//OTP_APIS
router.post("/sendOtp", sendOtp);
router.post("/VerifyOtp", VerifyOtp);

///Advisor Apis
router.post("/Advisor_register", uplode.single("Image"), Advisor_register);
router.post("/Advisor_login", Advisor_Login);
router.post("/Accept", isAuthenticated, acceptNotification);
router.post("/Reject", isAuthenticated, rejectNotification);
router.post("/Busy", isAuthenticated, busyNotification);
//router.get( "/user/:userId/profile", get_Advisor );
router.get("/get_Advisor/profile", isAuthenticated, get_Advisor);
router.get("/Advisor_All_Data", Get_All_Advisor);
router.put("/Edit_Advisor_Profile", isAuthenticated, Edit_Advisor_Profile);
router.post("/AdvisorUpdatePassword/:advisor_id", Advisor_Update_Password);
router.patch(
  "/AdvisorUpdateProfile",
  uplode.single("Image"),
  isAuthenticated,
  Advisor_Update_Profile
);

// otp_verification for forgot password
router.post("/send_otp", otpmailvalidator, send_otp_fp);
router.post("/verify_otp", verifymailvalidator, verify_otp_fp);
router.post("/advisor_send_otp", advisorotpmailvalidator, advisor_send_otp_fp);
router.post(
  "/advisor_verify_otp",
  advisorverifymailvalidator,
  advisor_verify_otp_fp
);

const { mailVerification } = require("../Controllers/UserControllers");
const {
  AdvisorMailVerification,
} = require("../Controllers/Advisor_controller");
//const { forgotPassword, resetPassword } = require('../Controllers/UserControllers');

router.get("/api/user-mail-verification", mailVerification);
router.get("/api/advisor-mail-verification", AdvisorMailVerification);
router.all("/*", function (req, res) {
  res.status(400).send({ status: false, message: " Path invalid." });
});

module.exports = router;

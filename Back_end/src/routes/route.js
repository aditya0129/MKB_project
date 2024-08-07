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
  forget_password
} = require("../Controllers/UserControllers");
const { sendOtp, VerifyOtp } = require("../Controllers/OtpVerfy");
const {
  Advisor_register,
  Advisor_Login,
  get_Advisor,
  Get_All_Advisor,
} = require("../Controllers/Advisor_controller");
const { isAuthenticated, isAuthorized } = require("../Auth/Middi");
const {
  otpmailvalidator,
  verifymailvalidator,
} = require("../Validation/Validate");
const {
  send_otp_fp,
  verify_otp_fp,
} = require("../Controllers/UserControllers");

const {wallet,add_amount,deduct_amount,}= require('../Controllers/Wallet_Controller')

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
router.get("/User_Home/Advisor_detail",isAuthenticated, User_Home);
router.get("/get_user/profile", isAuthenticated, get_Users);
router.put("/user/:userId/profile",Update_User);
router.get("/User_All_Data", Get_All_User);
//router.post("/User_Wallet/:User_id",User_Wallet)

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/forget_password',forget_password)
// router.get('/generateOTP/:userId',generate_Otp)
// router.get('/verifyOTP/:userId/:otp',Verify_Otp)


//user wallet api's
router.get('/wallet' ,isAuthenticated, wallet)
//Add amount to wallet
router.post('/add_amount',isAuthenticated,add_amount)
// Deduct amount from wallet
router.post('/deduct_amount',isAuthenticated,deduct_amount)


//OTP_APIS
router.post("/sendOtp", sendOtp);
router.post("/VerifyOtp", VerifyOtp);

///Advisor Apis
router.post("/Advisor_register",uplode.single("Image") , Advisor_register);
router.post("/Advisor_login", Advisor_Login);
//router.get( "/user/:userId/profile", get_Advisor );
router.get("/get_Advisor/profile", isAuthenticated, get_Advisor);
router.get("/Advisor_All_Data", Get_All_Advisor);

// otp_verification for forgot password
router.post("/send_otp", otpmailvalidator, send_otp_fp);
router.post("/verify_otp", verifymailvalidator, verify_otp_fp);


const {mailVerification}=require('../Controllers/UserControllers')
//const { forgotPassword, resetPassword } = require('../Controllers/UserControllers');


 
router.get('/api/mail-verification',mailVerification)
router.all("/*", function (req, res) {
  res.status(400).send({ status: false, message: " Path invalid." });
});

module.exports = router;

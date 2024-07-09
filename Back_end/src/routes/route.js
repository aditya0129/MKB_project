require("dotenv").config();

const express = require("express");
const router = express.Router();
const {
  Register_User,
  Login_user,
  get_Users,
  Update_User,
  Get_All_User,
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
router.get("/user/:userId/profile", isAuthenticated, get_Users);
router.put("/user/:userId/profile", isAuthenticated, isAuthorized, Update_User);
router.get("/User_All_Data", Get_All_User);

// router.get('/generateOTP/:userId',generate_Otp)
// router.get('/verifyOTP/:userId/:otp',Verify_Otp)

//OTP_APIS
router.post("/sendOtp", sendOtp);
router.post("/VerifyOtp", VerifyOtp);

///Advisor Apis
router.post("/Advisor_register", Advisor_register);
router.post("/Advisor_login", Advisor_Login);
//router.get( "/user/:userId/profile", get_Advisor );
router.get("/user/profile", isAuthenticated, get_Advisor);
router.get("/Advisor_All_Data", Get_All_Advisor);

// otp_verification for forgot password
router.post("/send_otp", otpmailvalidator, send_otp_fp);
router.post("/verify_otp", verifymailvalidator, verify_otp_fp);

router.all("/*", function (req, res) {
  res.status(400).send({ status: false, message: " Path invalid." });
});

module.exports = router;

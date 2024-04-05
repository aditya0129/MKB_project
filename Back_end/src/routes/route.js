require('dotenv').config();

const express = require("express");
const router = express.Router();
const { Register_User, Login_user }=require('../Controllers/UserControllers')
const {  sendotp ,VerifyOtp}=require("../Controllers/OtpVerfy")


router.post('/Register',Register_User )
router.post('/Login',Login_user)

// router.get('/generateOTP/:userId',generate_Otp)
// router.get('/verifyOTP/:userId/:otp',Verify_Otp)


router.post('/send_otp',sendotp)
router.post('/Verify_otp',VerifyOtp)


router.all('/*', function ( req , res )  {
    res.status(400).send({ status: false, message: " Path invalid." });
});

module.exports=router;
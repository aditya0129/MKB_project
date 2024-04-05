require('dotenv').config();

const OtpModel = require("../models/Mobile_otp_Model");
const otpGenerator=require('otp-generator')
const twilio=require('twilio')
const{OtpVerifing}=require('../Validation/Validate')

const AccountSid=process.env.TWILIO_ACC_SID
const AuthToken=process.env.TWILIO_AUTH_TOKEN
const twilioClient = new twilio(AccountSid,AuthToken )





const sendotp = async function (req, res) {
    try {
      const { number } = req.body;
  
      // Generate OTP
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      });
  
      // Send OTP in response
     // res.status(200).send({ status: true, MSG: otp });
  
      // Save OTP to database
      const otpExpiration = new Date(Date.now());
      await OtpModel.findOneAndUpdate(

        { number },
        { otp, otpExpiration },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
              
      // Send OTP via Twilio
      await twilioClient.messages.create({
        body: `Your OTP is ${otp}`,
        to: number,
        from: process.env.TWILIO_PHONE_NUMBER
      });
      return res.status(200).send({status:true,MSG:otp})

    } catch (error) {
      return res.status(500).send({ status: false, MSG: error.message });
    }
  };
  

const VerifyOtp=async function(req,res){
    try {

        const{number, otp}=req.body
        const Otp_Data=await OtpModel.findOne({
            number,otp
        })
        if(!Otp_Data) return res.status(400).send({status:false,MSG:"wrong otp"})

        const isOtpExpired=  await OtpVerifing(Otp_Data.otpExpiration)
        if(isOtpExpired){
            return res.status(200).send({status:false,MSG:"your otp has been expird"})
        }
        else{
            return res.status(200).send({status:true, otp:"otp verifide successfully"})
        }
    } catch (error) {
        return res.status(500).send({ status: false, MSG: error.message});
    }
}



module.exports={sendotp,VerifyOtp}
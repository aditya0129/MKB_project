const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const otp_model = require("../models/Otp_Model");
const mailer=require('../Validation/mailer')
const nodemailer = require("nodemailer");
const {
  validateEmail,
  validateName,
  validatePassword,
  validateMobileNo,
  validateAge,
} = require("../Validation/Validate");
const { isValidObjectId } = require("mongoose");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");

// Calculate age from birthdate
const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const Register_User = async function (req, res) {
  try {
    let data = req.body;
    let { name, email, password, birthdate, gender, number, place } = data;

    if (!name)
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide your name" });

    if (!validateName(name)) {
      return res
        .status(400)
        .send({ status: false, Msg: " Name should be in alphabate" });
    }

    if (!email)
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide your email" });

    // if (!validateEmail(email)) {
    //   return res.status(400).send({
    //     status: false,
    //     Msg: "please provide email correct formate like abc012@gmail.com",
    //   });
    // }

    let checkEmail = await UserModel.findOne({ email: email });
    if (checkEmail) {
      return res.status(400).send({
        status: false,
        msg: "email is already registered   please use nother email",
      });
    }
    // console.log(checkEmail);

    if (!password)
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide your password" });

    if (!validatePassword(password)) {
      return res.status(400).send({
        status: false,
        Msg: "Please provide valid password,it should contain uppercase,number and special character and 8-15 length",
      });
    }
    let hashing = bcrypt.hashSync(password, 8);
    data.password = hashing;

    if (!birthdate)
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide your birthdate" });

    const age = calculateAge(birthdate);
    if (age < 18) {
      return res.status(400).send({ status: false, MSG: "you should be 18+" });
    }
    if (!gender)
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide your gender" });

    if (!number)
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide your number" });
    if (!validateMobileNo(number)) {
      return res
        .status(400)
        .send({ status: false, Msg: "please provide valid Mobile Number" });
    }
    let checkNumber = await UserModel.findOne({ number: number });
    if (checkNumber) {
      return res
        .status(400)
        .send({ status: false, Msg: "this Number is already in use " });
    }
    // let savedata = await UserModel.create({data,age});
    // await savedata.save()
    // return res
    //   .status(200)
    //   .send({ Status: true, Msg: "succesful Register", Data: savedata });

    if (!place)
      return res
        .status(400)
        .send({ status: false, msg: "plcae must be required" });
    // if (!validateName(place))
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "please provide valid place name" });
    const newUser = new UserModel({
      name,
      email,
      password,
      number,
      gender,
      birthdate,
      age,
      place
    });
    await newUser.save();
    res.status(201).json({ status: true, user: newUser });
  } catch (error) {
    return res.status(500).send({ status: false, Msg: error.message });
  }
};

/////////////////////////////////////////////////////////login----User////////////////////////////////////////////////////

const Login_user = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;
    if (!email)
      return res
        .status(400)
        .send({ status: false, Msg: "please provide email" });

    let verifyUser = await UserModel.findOne({ email: email });

    if (!verifyUser) {
      return res
        .status(400)
        .send({ Status: false, MSG: "please provide correct email" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, MSG: "please provide password" });
    }
    if (!validatePassword(password)) {
      return res.status(400).send({
        status: false,
        MSG: "Please provide valid password,it should contain uppercase,number and special character and 8-15 length",
      });
    }
    let hash = verifyUser.password;

    let isCorrect = bcrypt.compareSync(password, hash);
    if (!isCorrect) {
      return res
        .status(400)
        .send({ status: false, message: "Password is incorrect" });
    }

    let token = jwt.sign(
      {
        userId: verifyUser._id.toString(),
      },
      "man-ki-baat"
    );
    res.setHeader("x-api-key", token);
    res.send({ status: true, Token: token, msg: "login successfully" });
  } catch (error) {
    return res.status(500).send({ Status: false, MSG: error.message });
  }
};

//////////////////////////////////////////////////////////////Get--User/////////////////////////////////////////////////////

const get_Users = async function (req, res) {
  try {
    let userId = req.params.userId;

    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "User is invalid" });

    let getData = await UserModel.find({ _id: userId });

    if (!getData)
      return res.status(404).send({ status: false, message: "user not found" });

    return res
      .status(200)
      .send({ status: true, message: "User profile details", data: getData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

/////////////////////////////////////---------Update-User-----------//////////////////////////////

const Update_User = async function (req, res) {
  try {
    let userId = req.param.userId;

    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "User Id is invalid." });

    let getUserId = await UserModel.findOne({ _id: userId });
    if (!getUserId)
      return res
        .status(404)
        .send({ status: false, message: "User Id not found." });

    let data = req.body;

    let { name, email, password, age, gender, number } = data;

    let updatedData = {};

    if (name) {
      if (!validateName(name)) {
        return res
          .status(400)
          .send({ status: false, message: "First name must be string." });
      }
      if (!name.trim()) {
        return res
          .status(400)
          .send({ status: false, message: "First name can not be empty." });
      }
      name = name.trim();
      updatedData.name = name;
    }

    if (email) {
      if (!validateEmail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Email id must be proper syntax." });
      }
      if (!email.trim()) {
        return res
          .status(400)
          .send({ status: false, message: "Email can not be empty." });
      }

      let checkEmailId = await UserModel.findOne({ email: email });
      if (checkEmailId) {
        return res.status(400).send({
          status: false,
          message:
            "This Email id is already used ,Please provide another Email Id.",
        });
      }
      email = email.trim();
      updatedData.email = email;
    }
    if (phone) {
      if (!validateMobileNo(phone)) {
        return res.status(400).send({
          status: false,
          message: "Mobile number must be Indian format.",
        });
      }
      if (!phone.trim()) {
        return res
          .status(400)
          .send({ status: false, message: "Phone number can not be empty." });
      }
      let checkphone = await userModel.findOne({ phone: phone });
      if (checkphone) {
        return res.status(400).send({
          status: false,
          message:
            "This phone number is already used ,Please provide another phone number.",
        });
      }
      phone = phone.trim();
      updatedData.phone = phone;
    }
    if (password) {
      if (!validatePassword(password)) {
        return res
          .status(400)
          .send({ status: false, messsage: "Please provide valid password." });
      }
      if (!password.trim()) {
        return res
          .status(400)
          .send({ status: false, message: "Password can not be empty." });
      }
      password = password.trim();
      let hashing = bcrypt.hashSync("password", 8);
      updatedData.password = hashing;
    }

    if (age) {
      if (!validateName(age)) {
        return res
          .status(400)
          .send({ status: false, message: " age must be string." });
      }
      if (!age.trim()) {
        return res
          .status(400)
          .send({ status: false, message: " age can not be empty." });
      }
      age = age.trim();
      updatedData.age = age;
    }

    if (gender) {
      if (!gender.trim()) {
        return res
          .status(400)
          .send({ status: false, message: " gender can not be empty." });
      }
      gender = gender.trim();
      updatedData.gender = gender;
    }

    if (number) {
      if (!validateMobileNo(number)) {
        return res
          .status(400)
          .send({ status: false, message: " number must be string." });
      }
      if (!number.trim()) {
        return res
          .status(400)
          .send({ status: false, message: " number can not be empty." });
      }
      number = number.trim();
      updatedData.number = number;
    }

    let updateUserData = await userModel.findOneAndUpdate(
      { _id: userId },
      updatedData,
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "User profile updated",
      data: updateUserData,
    });
  } catch (error) {
    return res.status(500).send({ Status: false, MSg: error.message });
  }
};

// for reset password

// otp generator
// function generateOTP(length) {
//   let otp = '';
//   const characters = '0123456789';
//   for (let i = 0; i < length; i++) {
//     otp += characters[Math.floor(Math.random() * characters.length)];
//   }
//   return otp;
// }

// //  const nodemailer = require('nodemailer');

// // Create a transporter
// let transporter = nodemailer.createTransport({
//   service: 'Gmail', // You can use other email services
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'your-email-password'
//   }
// });

// //////////////////////////////////////////////////////////////Get--User////////////////////////////////////////////////
// // Generate OTP
// const otp = generateOTP(6); // Generates a 6-digit OTP

// // Set up email data
// let mailOptions = {
//   from: '"Man-Ki-Baat " <MKB0129@gmail.com>',
//   to: 'user-email@example.com',
//   subject: 'Your OTP Code',
//   text: `Your OTP code is ${otp}`,
//   html: `<b>Your OTP code is ${otp}</b>`
// };

// Send email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Message sent: %s', info.messageId);
// });

//////////////////////////////////////////////////////////////send_otp////////////////////////////////////////////////
// const send_otp= async function(req,res) {
//   const userEmail = req.body.email;
//   const otp = generateOTP(6);

//   // Store OTP in session
//   req.session.otp = otp;

//   // Set up email data
//   let mailOptions = {
//     from: '"Your Company" <your-email@gmail.com>',
//     to: userEmail,
//     subject: 'Your OTP Code',
//     text: `Your OTP code is ${otp}`,
//     html: `<b>Your OTP code is ${otp}</b>`
//   };

//   // Send email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send('Error sending OTP');
//     }
//     res.send('OTP sent');
//   });
// };

// //////////////////////////////////////////////////////////////verify_otp////////////////////////////////////////////////

// const verify_otp=async function(req,res) {
//   const userOtp = req.body.otp;
//   const storedOtp = req.session.otp;

//   if (userOtp === storedOtp) {
//     res.send('OTP verified');
//   } else {
//     res.send('Invalid OTP');
//   }
// };

const genrateOtp = async () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const send_otp_fp = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }
    const { email } = req.body;
    const userData = await userModel.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        status: false,
        MSG: "email doesn't exits!",
      });
    }
    if (userData.is_verified == 1) {
      return res.status(400).json({
        status: false,
        MSG: userData.email + " mail iss allready verified !",
      });
    }


    const g_otp=await genrateOtp();

    const enter_otp= new otp_model({
      user_id:userData._id,
      otp:g_otp
    });

    await enter_otp.save();



    const msg = "<p> hii <b>" + userData.name + "<b/><br>, <h4>'+g_otp+'<h4/></p>";
    const mailerSend =  mailer.sendmail(userData.email, "otp verification", msg);

    console.log("test",mailerSend);

    if(mailerSend){
      return res.status(200).json({
        status: mailerSend,
        msg: "verifcation OTP has been send to your email addres, please Check !",
      });
    }else{
      return res.status(200).json({
        status: true,
        msg: "not send",
      });
    }

  
  } catch(error) {
    return res.status(500).send({ Status: false, MSg: error.message });
  }
};

const verify_otp_fp = async function (req, res) {};

module.exports = {
  verify_otp_fp,
  send_otp_fp,
  Register_User,
  Login_user,
  get_Users,
  Update_User,
};

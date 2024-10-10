const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const otp_model = require("../models/Otp_Model");
const mailer = require("../Validation/mailer");
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
const passwordModel = require("../models/passwordReset");
const randomstring = require("randomstring");

const {
  OneMinutExpiry,
  ThreeMinutExpiry,
} = require("../Validation/OtpValidate");
const Advisor_Model = require("../models/Advisor_Model");
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
    let {
      name,
      email,
      password,
      birthdate,
      gender,
      number,
      place,
      category,
      sub_category,
      profasion,
      walletBalance,
    } = data;

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
        msg: "email is already registered   please use another email",
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
    if (!category)
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide your category" });
    if (!sub_category)
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide your sub_category" });

    // if (!validateName(category)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, Msg: " Name should be in alphabate" });
    // }
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
    if (!profasion)
      return res
        .status(400)
        .send({ status: false, msg: "profasion must be required" });

    // if (!validateName(place))
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "please provide valid place name" });
    const newUser = new UserModel({
      name,
      email,
      password: data.password,
      number,
      gender,
      birthdate,
      age,
      place,
      category,
      sub_category,
      profasion,
      image: "images/" + req.file.filename,
      walletBalance,
    });
    const userData = await newUser.save();

    //const msg='<p> hii ,'+name+',please <a href="http://localhost:3001/api/mail-verification?id='+userData._id+'">verify</a>your mail.</p>';
    const msg = `<p>Hi ${name}, please <a href="http://localhost:3001/api/user-mail-verification?id=${userData._id}">verify</a> your email.</p>`;
    mailer.sendMail(email, "mail-verification", msg);
    //router.get('/api/mail-verification',mailVerification)
    //http://localhost:3001/api/mail-verification?id=668ce9c4bac40576be3d287a
    res.status(201).json({ status: true, user: userData });
  } catch (error) {
    return res.status(500).send({ status: false, Msg: error.message });
  }
};

/////////////////////////////////////////////////////////login----User////////////////////////////////////////////////////

// const Login_user = async function (req, res) {
//   try {
//     let data = req.body;
//     let { email, password } = data;
//     if (!email)
//       return res
//         .status(400)
//         .send({ status: false, Msg: "please provide email" });

//     let verifyUser = await UserModel.findOne({ email: email });

//     if (!verifyUser) {
//       return res
//         .status(400)
//         .send({ Status: false, MSG: "please provide correct email" });
//     }
//     if (!password) {
//       return res
//         .status(400)
//         .send({ status: false, MSG: "please provide password" });
//     }
//     if (!validatePassword(password)) {
//       return res.status(400).send({
//         status: false,
//         MSG: "Please provide valid password,it should contain uppercase,number and special character and 8-15 length",
//       });
//     }
//     let hash = verifyUser.password;

//     let isCorrect = bcrypt.compareSync(password, hash);
//     if (!isCorrect) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Password is incorrect" });
//     }

//     let token = jwt.sign(
//       {
//         userId: verifyUser._id.toString(),
//       },
//       "man-ki-baat"
//     );
//     res.setHeader("x-api-key", token);
//     res.send({ status: true, Token: token, msg: "login successfully" });
//   } catch (error) {
//     return res.status(500).send({ Status: false, MSG: error.message });
//   }
// };

const Login_user = async function (req, res) {
  try {
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: "false",
        message: "Please enter the data in request body",
      });
    }
    const { email, password } = data;

    if (!email || email == "") {
      return res.status(400).send({
        status: false,
        message: "email is mandatory and email Should not be Empty",
      });
    }
    if (!validateEmail(email.trim())) {
      return res
        .status(400)
        .send({ status: false, MSG: "Please provide valid email" });
    }
    let verifyUser = await UserModel.findOne({ email: email });
    console.log(verifyUser._id);
    if (!verifyUser) {
      return res.status(400).send({
        status: false,
        MSG: "this email is not present our data please provide email",
      });
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
        userId: verifyUser._id,
      },
      "man-ki-baat"
    );
    // res.setHeader("x-api-key", token);

    res.send({ status: true, Token: token, msg: "login successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, Msg: error.message });
  }
};

//////////////////////////////////////////////////////////////Get--User/////////////////////////////////////////////////////

const get_Users = async function (req, res) {
  try {
    //let userId = req.params.userId;

    let userId = req.token.userId;
    console.log(userId);
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
      let checkphone = await UserModel.findOne({ phone: phone });
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

    let updateUserData = await UserModel.findOneAndUpdate(
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
    // Validation and other logic...
    const { email } = req.body;
    const userData = await UserModel.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        status: false,
        MSG: "E-mail is not correct. Please try again!",
      });
    }

    // Generate and store OTP
    const g_otp = await genrateOtp();
    const user_id = userData._id; // Get the user ID

    const oldotpData = await otp_model.findOne({ user_id });
    if (oldotpData) {
      const sendNextotp = await OneMinutExpiry(oldotpData.timestamps);
      if (!sendNextotp) {
        return res.status(400).json({
          status: false,
          MSG: "Please try after some time!",
        });
      }
    }

    await otp_model.findOneAndUpdate(
      { user_id },
      { otp: g_otp, timestamps: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const msg = `<p>Hi <b>${userData.name}</b>,<br> <h4>${g_otp}</h4></p>`;
    const mailerSend = await mailer.sendMail(
      userData.email,
      "OTP verification",
      msg
    );

    return res.status(200).json({
      status: true,
      user_id: userData._id, // Include user_id in the response
      msg: "Verification OTP has been sent to your email address, please check!",
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const verify_otp_fp = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }
    const { user_id, otp } = req.body;

    const otpData = await otp_model.findOne({ user_id, otp });

    if (!otpData) {
      return res.status(400).json({ status: false, MSG: "wrong otp" });
    }

    const isotpExpired = await ThreeMinutExpiry(otpData.timestamps);
    if (isotpExpired) {
      return res.status(400).json({
        status: false,
        MSG: "your otp has been expired !",
      });
    }

    await UserModel.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          is_verified: 1,
        },
      }
    );
    return res.status(200).json({
      status: true,
      MSG: "your account verifid successfull",
    });
  } catch (error) {
    return res.status(500).send({ Status: false, MSg: error.message });
  }
};

const Get_All_User = async function (req, res) {
  try {
    const User = await UserModel.find();
    const userData = User.map((user) => {
      return {
        ...user._doc, // Spread existing user data
        userId: user._id, // Include the user's _id explicitly as userId
      };
    });
    return res.status(200).send({ status: true, Data: userData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// const mailVerification=async(req,res)=>{

//   try{

//     if(req.query.id== undefined){
//       return req.render('404');
//     }

//     const userData=await UserModel.findOne({_id:req.query.id});
//     if(userData){

//     }else{
//       return res.render('mail-verification',{message:'user not Found!'})
//     }

//   }catch (error) {
//     console.log(error.message)
//     return res.render('404')
//   }

// }

const mailVerification = async (req, res) => {
  try {
    if (req.query.id == undefined) {
      return req.render("404");
    }

    const userData = await UserModel.findOne({ _id: req.query.id });
    console.log("userData" + userData);
    console.log("queary id" + req.query.id);
    if (userData) {
      if (userData.is_verified == 1) {
        return res.render("mail-verification", {
          message: "Your mail already verified!",
        });
      }
      await UserModel.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            is_verified: 1,
          },
        }
      );
      return res.render("mail-verification", {
        message: "Mail has been verified Successfully!",
      });
    } else {
      return res.render("mail-verification", { message: "User not Found!" });
    }
  } catch (error) {
    console.log(error.message);
    return res.render("404");
  }
};

//----------------------------------------------------forgotPassword--------------------------------------------------------- //

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const email_check = await UserModel.find({ email });
    if (!email_check) {
      return res.status(400).send({
        status: "false",
        msg: `user not found with this email ${req.body.email}`,
      });
    }
    const token = jwt.sign({ email }, "forget-password", { expiresIn: "1h" });

    const msg = `You requested for a password reset. Please use the following token to reset your password: ${token}`;

    mailer.sendMail(email, "Password Reset", msg);
    res.status(200).json({ status: true, message: "Email sent", Token: token });
  } catch (error) {
    return res.status(500).send({ status: "false", Msg: error.message });
  }
};

//----------------------------------------------------resetPassword--------------------------------------------------------- //

const resetPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;

    // const decoded = await promisify(jwt.verify)(token, "Password Reset");
    // const { email } = decoded;

    jwt.verify(token, "forget-password", async function (err, decoded) {
      if (err) {
        console.log(err.message);
        return res.status(401).send({ status: false, message: err.message });
      } else {
        req.token = decoded;
        data = req.token;
      }
    });

    const { email } = data;

    const user = await UserModel.find({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    UserModel({ email }).password = hashedPassword;
    console.log({ password: UserModel.password });
    return res.status(200).send({
      status: true,
      msg: "password updated successfully",
      data: hashedPassword,
    });
  } catch (error) {
    return res.status(500).send({ status: "false", Msg: error.message });
  }
};

const User_Home = async function (req, res) {
  try {
    let userId = req.token.userId;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "User is invalid" });
    }

    let User_data = await UserModel.findById(userId); // Corrected the findById usage

    if (!User_data) {
      return res
        .status(404)
        .json({ status: false, msg: "user not found by _id" });
    }

    let category_data = User_data.category; // Accessing category directly
    if (!category_data) {
      return res
        .status(404)
        .json({ status: false, msg: "user category not found" });
    }

    let Advisor_data = await Advisor_Model.find({ Expertise: category_data });

    // i want undesstand further
    if (!Advisor_data || Advisor_data.length === 0) {
      return res.status(404).json({
        status: false,
        Api: "user_home",
        msg: "category was not found in Advisor_Model",
      });
    }

    return res.status(200).json({
      status: true,
      msg: "data found for home_pages",
      data: Advisor_data,
    });
  } catch (error) {
    return res.status(500).json({ status: false, Msg: error.message });
  }
};

// const update_Password = async function (req, res) {
//   try {
//     let { email } = req.body;
//     let find_Email = await UserModel.find({ email });
//     if (!find_Email) {
//       return res
//         .status(400)
//         .json({ status: false, msg: "email doesn't exits!" });
//     }
//   } catch (error) {
//     return res.status(500).json({ status: false, Msg: error.message });
//   }
// };

const update_Password = async function (req, res) {
  try {
    let { user_id } = req.params;
    let { newPassword, reEnterPassword } = req.body;

    // Check if the email exists in the database
    let user = await UserModel.findOne({ _id: user_id });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, msg: "User doesn't exist!" });
    }

    // Check if newPassword and reEnterPassword match
    if (newPassword !== reEnterPassword) {
      return res
        .status(400)
        .json({ status: false, msg: "Passwords do not match!" });
    }

    // Hash the new password (using bcrypt for example)
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ status: true, msg: "Password updated successfully!" });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

const Forget_Password = async function (req, res) {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .send({ status: false, msg: "error", error: error.array() });
    }
    const { email } = req.body;
    const userData = await UserModel.find({ email });
    if (!userData) {
      return res.status(400).send({
        status: false,
        Msg: "email doesn't exits",
        Api: "in User => Forget_Password",
      });
    }
  } catch (error) {
    return res.status(500).send({ Status: false, Msg: error.message });
  }
};

const forget_password = async function (req, res) {
  try {
    const { email } = req.body;

    // Find user by email
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: false, msg: "user not found!" });
    }

    // Generate random string for token
    const randomString = randomstring.generate();

    // Create the email message
    const msg = `<p>Hi ${user.name}, please click <a href="http://localhost:3001/api/reset-Password?token=${randomString}">here</a> to reset your password.</p>`;
    // const msg = `<p>Hi ${name}, please <a href="http://localhost:3001/api/mail-verification?id=${userData._id}">verify</a> your email.</p>`;

    // Create a new password reset token
    const password_Reset = new passwordModel({
      user_id: user._id,
      token: randomString,
    });

    // Save the password reset token to the database
    await password_Reset.save();

    // Send the email
    mailer.sendMail(user.email, "Reset Password", msg);

    // Send response
    return res.status(200).json({
      status: true,
      msg: "Password reset link sent to your email. Please check your email!",
    });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

const reset_password = async function (req, res) {
  try {
    if (req.query.token == undefined) {
      console.log("something");
      return res.render("404");
    }
    const resetData = await passwordModel.findOne({ token: req.query.token });
    if (!resetData) {
      console.log("here");
      return res.render("404");
    }
    return res.render("reset-Password", { resetData });
  } catch (error) {
    return res.render("404");
  }
};

/* http://localhost:3001/api/mail-verification?id=66acaa591cf13d4808bec1d6
http://localhost:3001/api/reset-Password?token=wcOh3999W8KkmX58htHqk3eCZDlZusJe */

const Update_password = async function (req, res) {
  try {
    const { user_id, password, c_password } = req.body;

    const resetData = await passwordModel.findOne({ user_id });

    if (password != c_password) {
      return res.render({
        resetData,
        error: "c_password in not matching please try again !",
      });
    }

    const User_hashedPassword = await bcrypt.hash(c_password, 8);

    await userModel.findByIdAndDelete(
      { _id: user_id },
      {
        $set: {
          password: User_hashedPassword,
        },
      }
    );

    await passwordModel.deleteMany({
      user_id,
    });

    return res.redirect("/reset-success");
  } catch (error) {
    return res.render("404");
  }
};

const resetSuccess = async function (req, res) {
  try {
    return res.render("reset-success");
  } catch (error) {
    return res.render("404");
  }
};

// const sendNotification = async function (req, res) {
//   try {
//     const { advisorId } = req.params;
//     let findAdvisor = await Advisor_Model.findById({ _id: advisorId });
//     if (!findAdvisor) {
//       return res.status(404).send({ status: false, msg: "Advisor not found" });
//     }
//     findAdvisor.Notification = "Are you available now?";
//     await findAdvisor.save();
//     return res.status(200).send({
//       status: true,
//       msg: "Notification updated successfully",
//       advisor: findAdvisor,
//     });
//   } catch (error) {
//     return res.status(500).send({ status: false, msg: error.message });
//   }
// };
// const sendNotification = async function (req, res) {
//   try {
//     let { advisorId } = req.params;
//     let { userId } = req.token;
//     let findAdvisor = await Advisor_Model.findById(advisorId);
//     if (!findAdvisor) {
//       return res.status(404).send({ status: false, msg: "Advisor not found" });
//     }
//     let findUser = await UserModel.findById(userId);
//     if (!findUser) {
//       return res.status(404).send({ status: false, msg: "User not found" });
//     }
//     findAdvisor.Notification = `Are you available now?`;
//     await findAdvisor.save();
//     return res.status(200).send({
//       status: true,
//       msg: "Notification updated successfully",
//       advisor: {
//         id: findAdvisor._id,
//         name: findAdvisor.Name,
//         notification: findAdvisor.Notification,
//       },
//       user: {
//         id: findUser._id,
//         name: findUser.name,
//         image: findUser.image,
//         category: findUser.category,
//       },
//     });
//   } catch (error) {
//     return res.status(500).send({ status: false, msg: error.message });
//   }
// };
const sendNotification = async function (req, res) {
  try {
    let { advisorId } = req.params;
    let { userId } = req.token;
    let findAdvisor = await Advisor_Model.findById(advisorId);
    if (!findAdvisor) {
      return res.status(404).send({ status: false, msg: "Advisor not found" });
    }
    let findUser = await UserModel.findById(userId);
    if (!findUser) {
      return res.status(404).send({ status: false, msg: "User not found" });
    }
    findAdvisor.Notification = `Are you available now?`;
    findAdvisor.userDetails = {
      userId: findUser._id,
      name: findUser.name,
      image: findUser.image,
      category: findUser.category,
      sub_category: findUser.sub_category,
    };
    await findAdvisor.save();
    return res.status(200).send({
      status: true,
      msg: "Notification updated successfully and user details saved",
      advisor: {
        id: findAdvisor._id,
        name: findAdvisor.Name,
        notification: findAdvisor.Notification,
        userDetails: findAdvisor.userDetails,
      },
      user: {
        id: findUser._id,
        name: findUser.name,
        image: findUser.image,
        category: findUser.category,
        sub_category: findUser.sub_category,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const updateProfile = async function (req, res) {
  try {
    let { userId } = req.token;
    let findUser = await UserModel.findById({ _id: userId });
    if (!findUser) {
      return res.status(404).send({ status: false, msg: "User not found" });
    }
    let {
      email,
      number,
      place,
      category,
      sub_category,
      profasion,
      description,
      category_strength,
      subcategory_strength,
    } = req.body;
    if (email) findUser.email = email;
    if (number) findUser.number = number;
    if (place) findUser.place = place;
    if (category) findUser.category = category;
    if (sub_category) findUser.sub_category = sub_category;
    if (profasion) findUser.profasion = profasion;
    if (description) findUser.description = description;
    if (category_strength) findUser.category_strength = category_strength;
    if (category_strength > 10) {
      return res.status(404).send({
        status: false,
        msg: "Please enter the rating  10 or Under 10",
      });
    }
    if (subcategory_strength)
      findUser.subcategory_strength = subcategory_strength;
    if (subcategory_strength > 10) {
      return res.status(404).send({
        status: false,
        msg: "Please enter the rating  10 or Under 10",
      });
    }
    if (req.file) {
      findUser.image = "images/" + req.file.filename;
    }
    await findUser.save();
    res
      .status(200)
      .json({ status: true, msg: "User updated successfully", data: findUser });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports = {
  verify_otp_fp,
  send_otp_fp,
  Register_User,
  Login_user,
  get_Users,
  Update_User,
  Get_All_User,
  mailVerification,
  resetPassword,
  forgotPassword,
  User_Home,
  forget_password,
  reset_password,
  Update_password,
  resetSuccess,
  sendNotification,
  update_Password,
  updateProfile,
};

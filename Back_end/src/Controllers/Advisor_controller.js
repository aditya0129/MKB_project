const Advisor_Model = require("../models/Advisor_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const {
  validateEmail,
  validateName,
  validatePassword,
  validateMobileNo,
} = require("../Validation/Validate");
const userModel = require("../models/userModel");
const mailer = require("../Validation/mailer");
const Advisor_Otp_Model = require("../models/Advisor_Otp_Model");
const {
  OneMinutExpiry,
  ThreeMinutExpiry,
} = require("../Validation/OtpValidate");
const { validationResult } = require("express-validator");
///const { Module } = require("module");

///**********************************************---------Calculate age from birthdate----------**********************************///
//
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

///**********************************************----------Advisor_register---------**********************************///
const Advisor_register = async function (req, res) {
  try {
    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: "false",
        message: "Please enter the data in request body",
      });
    }
    let {
      Name,
      Number,
      Email,
      Password,
      Expertise,
      Language,
      Experience,
      Gender,
      City,
      State,
      DOB,
      //Image,
    } = data;

    if (!Name || Name == "") {
      return res.status(400).send({
        status: false,
        message: "Name is mandatory and Name Should not be Empty",
      });
    }
    if (!validateName(Name.trim())) {
      return res
        .status(400)
        .send({ status: false, MSG: "please provide valid name" });
    }
    if (!Number || Number == "") {
      return res.status(400).send({
        status: false,
        message:
          "Phone_number is mandatory and Phone_number Should not be Empty",
      });
    }
    if (!validateMobileNo(Number)) {
      return res
        .status(400)
        .send({ status: false, MSG: "please provide valid Phone_number" });
    }
    let check_Number = await Advisor_Model.findOne({
      Number: Number,
    });
    if (check_Number) {
      return res.status(200).send({
        status: false,
        MSg: "this number is Allready in use please provide Another Phone_Number",
      });
    }

    if (!Password || Password == "") {
      return res.status(400).send({
        status: false,
        message: "password is mandatory and password Should not be Empty",
      });
    }
    if (!validatePassword(Password.trim())) {
      return res.status(400).send({
        status: false,
        MSG: "Please provide valid password,it should contain uppercase,number and special character and 8-15 length",
      });
    }
    let hashing = bcrypt.hashSync(Password, 8);
    data.Password = hashing;

    if (!Email || Email == "") {
      return res.status(400).send({
        status: false,
        message: "email is mandatory and email Should not be Empty",
      });
    }
    if (!validateEmail(Email.trim())) {
      return res
        .status(400)
        .send({ status: false, MSG: "Please provide valid email" });
    }
    let check_Email = await Advisor_Model.findOne({ Email: Email });
    if (check_Email) {
      return res.status(400).send({
        status: false,
        MSG: "this email already in use please provide Another Email",
      });
    }
    if (!Expertise || Expertise == "") {
      return res.status(400).send({
        status: false,
        message: "expertise is mandatory and expertise Should not be Empty",
      });
    }
    if (!Language || Language == "") {
      return res.status(400).send({
        status: false,
        message: "Language is mandatory and Name Should not be Empty",
      });
    }

    if (!Experience || Experience == "") {
      return res.status(400).send({
        status: false,
        message: "Experience is mandatory and Experience Should not be Empty",
      });
    }

    if (!Gender || Gender == "") {
      return res.status(400).send({
        status: false,
        message: "Gender is mandatory and Gender Should not be Empty",
      });
    }
    if (!City || City == "") {
      return res.status(400).send({
        status: false,
        message: "City is mandatory and City Should not be Empty",
      });
    }

    if (!State || State == "") {
      return res.status(400).send({
        status: false,
        message: "State is mandatory and State Should not be Empty",
      });
    }
    if (!Name || Name == "") {
      return res.status(400).send({
        status: false,
        message: "Name is mandatory and Name Should not be Empty",
      });
    }

    if (!DOB || DOB == "") {
      return res.status(400).send({
        status: false,
        message: "DOB is mandatory and DOB Should not be Empty",
      });
    }
    const Age = calculateAge(DOB);
    if (Age < 18) {
      return res.status(400).send({ status: false, MSG: "you should be 18+" });
    }
    const newAdvisor = new Advisor_Model({
      Name,
      Number,
      Email,
      Password: data.Password,
      Expertise,
      Language,
      Experience,
      Gender,
      City,
      State,
      DOB,
      Age,
      Image: "images/" + req.file.filename,
    });
    const advisorData = await newAdvisor.save();

    const msg = `<p>Hi ${Name}, please <a href="http://localhost:3001/api/advisor-mail-verification?id=${advisorData._id}">verify</a> your email.</p>`;
    mailer.sendMail(Email, "mail-verification", msg);
    res.status(201).json({ status: true, advisor: newAdvisor });

    // let Save_data = await Advisor_Model.create(data);
    // return res
    //   .status(200)
    //   .send({ status: true, MSG: "register successfull", Data: Save_data });
  } catch (error) {
    return res.status(500).send({ status: false, Msg: error.message });
  }
};

///**********************************************----------Advisor_Login---------**********************************///

const Advisor_Login = async function (req, res) {
  try {
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: "false",
        message: "Please enter the data in request body",
      });
    }
    const { Email, Password } = data;

    if (!Email || Email == "") {
      return res.status(400).send({
        status: false,
        message: "email is mandatory and email Should not be Empty",
      });
    }
    if (!validateEmail(Email.trim())) {
      return res
        .status(400)
        .send({ status: false, MSG: "Please provide valid email" });
    }
    let verifyUser = await Advisor_Model.findOne({ Email: Email });

    if (!verifyUser) {
      return res.status(400).send({
        status: false,
        MSG: "this email is not present our data please provide email",
      });
    }
    if (!Password) {
      return res
        .status(400)
        .send({ status: false, MSG: "please provide password" });
    }
    if (!validatePassword(Password)) {
      return res.status(400).send({
        status: false,
        MSG: "Please provide valid password,it should contain uppercase,number and special character and 8-15 length",
      });
    }
    let hash = verifyUser.Password;

    let isCorrect = bcrypt.compareSync(Password, hash);
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

///**********************************************----------get_Advisor---------**********************************///

const get_Advisor = async function (req, res) {
  try {
    //let userId = req.params.userId;

    let userId = req.token.userId;

    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "User is invalid" });

    let getData = await Advisor_Model.find({ _id: userId });

    if (!getData)
      return res.status(404).send({ status: false, message: "user not found" });

    return res
      .status(200)
      .send({ status: true, message: "User profile details", data: getData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

///**********************************************----------Get_All_Advisor---------**********************************///

const Get_All_Advisor = async function (req, res) {
  const { name } = req.query;
  try {
    let advisors;
    if (name) {
      // Use regex for flexible name matching (case-insensitive)
      advisors = await Advisor_Model.find({
        Name: { $regex: name, $options: "i" },
      });
    } else {
      // If no name parameter, return all advisors
      advisors = await Advisor_Model.find();
    }

    // Map the result to include advisorId explicitly and return response
    const advisorData = advisors.map((advisor) => {
      return {
        ...advisor._doc, // Spread the existing advisor data
        advisorId: advisor._id, // Include the advisor's _id explicitly as advisorId
      };
    });

    return res.status(200).send({ status: true, Data: advisorData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const Edit_Advisor_Profile = async function (req, res) {
  try {
    const {
      Name,
      Language,
      State,
      City,
      Experience,
      DOB,
      Expertise,
      Email,
      Number,
      About,
      Goal,
      Skills,
      Personality,
    } = req.body;
    const { userId } = req.token;
    const Advisor_data = await Advisor_Model.findById({ _id: userId });
    if (!Advisor_data) {
      return res
        .status(404)
        .send({ status: false, Message: "Advisor dosen't exits" });
    }

    const New_Advisor = new Advisor_Model({
      Name,
      Language,
      State,
      City,
      Experience,
      DOB,
      Expertise,
      Email,
      Number,
      About,
      Goal,
      Skills,
      Personality,
    });
    const Update_Advisor = await New_Advisor.save();

    return res.status(201).send({
      status: true,
      msg: "Advisor data Updated successfully",
      data: Update_Advisor,
    });
  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};

const acceptNotification = async function (req, res) {
  try {
    let { user_Id } = req.params;
    let { userId } = req.token;
    let findUser = await userModel.findById(user_Id);
    if (!findUser) {
      return res.status(404).send({ status: false, msg: "User not found" });
    }
    let findAdvisor = await Advisor_Model.findById(userId);
    if (!findAdvisor) {
      return res.status(404).send({ status: false, msg: "Advisor not found" });
    }
    findUser.notification = `I Am Available Now...`;
    findUser.advisorDetails = {
      advisorId: findAdvisor._id,
      Name: findAdvisor.Name,
      Gender: findAdvisor.Gender,
      Image: findAdvisor.Image,
      Expertise: findAdvisor.Expertise,
      Experience: findAdvisor.Experience,
    };
    await findUser.save();
    return res.status(200).send({
      status: true,
      msg: "Notification updated successfully and advisor details saved",
      user: {
        id: findUser._id,
        name: findUser.name,
        notification: findUser.notification,
        advisorDetails: findUser.advisorDetails,
      },
      advisor: {
        id: findAdvisor._id,
        name: findAdvisor.Name,
        gender: findAdvisor.Gender,
        image: findAdvisor.Image,
        expertise: findAdvisor.Expertise,
        experience: findAdvisor.Experience,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const rejectNotification = async function (req, res) {
  try {
    let { user_Id } = req.params;
    let { userId } = req.token;
    let findUser = await userModel.findById(user_Id);
    if (!findUser) {
      return res.status(404).send({ status: false, msg: "User not found" });
    }
    let findAdvisor = await Advisor_Model.findById(userId);
    if (!findAdvisor) {
      return res.status(404).send({ status: false, msg: "Advisor not found" });
    }
    findUser.notification = "Not Available Now...";
    findUser.advisorDetails = {
      advisorId: findAdvisor._id,
      Name: findAdvisor.Name,
      Gender: findAdvisor.Gender,
      Image: findAdvisor.Image,
      Expertise: findAdvisor.Expertise,
      Experience: findAdvisor.Experience,
    };
    await findUser.save();
    return res.status(200).send({
      status: true,
      msg: "Notification updated successfully and advisor details saved",
      user: {
        id: findUser._id,
        name: findUser.name,
        notification: findUser.notification,
        advisorDetails: findUser.advisorDetails,
      },
      advisor: {
        id: findAdvisor._id,
        name: findAdvisor.Name,
        gender: findAdvisor.Gender,
        image: findAdvisor.Image,
        expertise: findAdvisor.Expertise,
        experience: findAdvisor.Experience,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const busyNotification = async function (req, res) {
  try {
    let { user_Id } = req.params;
    let { userId } = req.token;
    let findUser = await userModel.findById(user_Id);
    if (!findUser) {
      return res.status(404).send({ status: false, msg: "User not found" });
    }
    let findAdvisor = await Advisor_Model.findById(userId);
    if (!findAdvisor) {
      return res.status(404).send({ status: false, msg: "Advisor not found" });
    }
    findUser.notification = "I Am Busy Now...";
    findUser.advisorDetails = {
      advisorId: findAdvisor._id,
      Name: findAdvisor.Name,
      Gender: findAdvisor.Gender,
      Image: findAdvisor.Image,
      Expertise: findAdvisor.Expertise,
      Experience: findAdvisor.Experience,
    };
    await findUser.save();
    return res.status(200).send({
      status: true,
      msg: "Notification updated successfully and advisor details saved",
      user: {
        id: findUser._id,
        name: findUser.name,
        notification: findUser.notification,
        advisorDetails: findUser.advisorDetails,
      },
      advisor: {
        id: findAdvisor._id,
        name: findAdvisor.Name,
        gender: findAdvisor.Gender,
        image: findAdvisor.Image,
        expertise: findAdvisor.Expertise,
        experience: findAdvisor.Experience,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};
const AdvisorMailVerification = async (req, res) => {
  try {
    if (req.query.id == undefined) {
      return req.render("404");
    }

    const advisorData = await Advisor_Model.findOne({ _id: req.query.id });

    if (advisorData) {
      if (advisorData.is_verified == 1) {
        return res.render("mail-verification", {
          message: "Your mail already verified!",
        });
      }
      await Advisor_Model.findByIdAndUpdate(
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
      return res.render("mail-verification", { message: "Advisor not Found!" });
    }
  } catch (error) {
    return res.render("404");
  }
};

const genrateOtp = async () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const advisor_send_otp_fp = async function (req, res) {
  try {
    // Validation and other logic...
    const { Email } = req.body;
    const advisorData = await Advisor_Model.findOne({ Email });

    if (!advisorData) {
      return res.status(400).json({
        status: false,
        MSG: "E-mail is not correct. Please try again!",
      });
    }

    // Generate and store OTP
    const g_otp = await genrateOtp();
    const advisor_id = advisorData._id; // Get the advisor ID

    const oldotpData = await Advisor_Otp_Model.findOne({ advisor_id });
    if (oldotpData) {
      const sendNextotp = await OneMinutExpiry(oldotpData.timestamps);
      if (!sendNextotp) {
        return res.status(400).json({
          status: false,
          MSG: "Please try after some time!",
        });
      }
    }

    await Advisor_Otp_Model.findOneAndUpdate(
      { advisor_id },
      { Otp: g_otp, timestamps: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const msg = `<p>Hi <b>${advisorData.Name}</b>,<br> <h4>${g_otp}</h4></p>`;
    const mailerSend = await mailer.sendMail(
      advisorData.Email,
      "OTP verification",
      msg
    );

    return res.status(200).json({
      status: true,
      advisor_id: advisorData._id, // Include advisor_id in the response
      msg: "Verification OTP has been sent to your email address, please check!",
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const advisor_verify_otp_fp = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }
    const { advisor_id, Otp } = req.body;

    const otpData = await Advisor_Otp_Model.findOne({ advisor_id, Otp });

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

    await Advisor_Model.findByIdAndUpdate(
      { _id: advisor_id },
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

const Advisor_Update_Password = async function (req, res) {
  try {
    let { advisor_id } = req.params;
    let { newPassword, reEnterPassword } = req.body;

    // Check if the email exists in the database
    let advisor = await Advisor_Model.findOne({ _id: advisor_id });
    if (!advisor) {
      return res
        .status(400)
        .json({ status: false, msg: "advisor doesn't exist!" });
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

    // Update the advisor's password in the database
    advisor.Password = hashedPassword;
    await advisor.save();

    return res
      .status(200)
      .json({ status: true, msg: "Password updated successfully!" });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

const Advisor_Update_Profile = async function (req, res) {
  try {
    let { userId } = req.token;
    let findAdvisor = await Advisor_Model.findById({ _id: userId });
    if (!findAdvisor) {
      return res.status(404).send({ status: false, msg: "Advisor not found" });
    }
    let {
      Email,
      Number,
      City,
      State,
      Expertise,
      Experience,
      Language,
      About,
      Analytical_Strength,
      Problem_Solving_Strength,
      Public_Speaking_Strength,
      Adaptable_Strength,
      Communication_Strength,
      P_S_Strength,
      Leadership_Experience_Strength,
      Goal,
    } = req.body;
    if (Email) findAdvisor.Email = Email;
    if (Number) findAdvisor.Number = Number;
    if (City) findAdvisor.City = City;
    if (State) findAdvisor.State = State;
    if (Expertise) findAdvisor.Expertise = Expertise;
    if (Experience) findAdvisor.Experience = Experience;
    if (Language) findAdvisor.Language = Language;
    if (About) findAdvisor.About = About;
    if (Analytical_Strength)
      findAdvisor.Analytical_Strength = Analytical_Strength;
    if (Analytical_Strength > 10) {
      return res.status(404).send({
        status: false,
        msg: "Please enter the rating  10 or Under 10",
      });
    }
    if (Problem_Solving_Strength)
      findAdvisor.Problem_Solving_Strength = Problem_Solving_Strength;
    if (Problem_Solving_Strength > 10) {
      return res.status(404).send({
        status: false,
        msg: "Please enter the rating  10 or Under 10",
      });
    }
    if (Public_Speaking_Strength)
      findAdvisor.Public_Speaking_Strength = Public_Speaking_Strength;
    if (Public_Speaking_Strength > 10) {
      return res.status(404).send({
        status: false,
        msg: "Please enter the rating  10 or Under 10",
      });
    }
    if (Adaptable_Strength) findAdvisor.Adaptable_Strength = Adaptable_Strength;
    if (Adaptable_Strength > 10) {
      return res.status(404).send({
        status: false,
        msg: "Please enter the rating  10 or Under 10",
      });
    }
    if (Communication_Strength)
      findAdvisor.Communication_Strength = Communication_Strength;
    if (Communication_Strength > 10) {
      return res.status(404).send({
        status: false,
        msg: "Please enter the rating  10 or Under 10",
      });
    }
    if (P_S_Strength) findAdvisor.P_S_Strength = P_S_Strength;
    if (P_S_Strength > 10) {
      return res.status(404).send({
        status: false,
        msg: "Please enter the rating  10 or Under 10",
      });
    }
    if (Leadership_Experience_Strength)
      findAdvisor.Leadership_Experience_Strength =
        Leadership_Experience_Strength;
    if (Leadership_Experience_Strength > 10) {
      return res.status(404).send({
        status: false,
        msg: "Please enter the rating  10 or Under 10",
      });
    }
    if (Goal) findAdvisor.Goal = Goal;
    if (req.file) {
      findAdvisor.Image = "images/" + req.file.filename;
    }
    await findAdvisor.save();
    res.status(200).json({
      status: true,
      msg: "Advisor updated successfully",
      data: findAdvisor,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {
  Advisor_register,
  Advisor_Login,
  get_Advisor,
  Get_All_Advisor,
  Edit_Advisor_Profile,
  acceptNotification,
  rejectNotification,
  busyNotification,
  AdvisorMailVerification,
  advisor_send_otp_fp,
  advisor_verify_otp_fp,
  Advisor_Update_Password,
  Advisor_Update_Profile,
};

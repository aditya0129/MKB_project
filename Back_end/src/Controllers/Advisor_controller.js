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
    const newUser = new Advisor_Model({
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
      Image:  "image/" + req.file.filename,
    });
    await newUser.save();
    res.status(201).json({ status: true, user: newUser });

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
    console.log(verifyUser._id);
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
    console.log(userId);
    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "User is invalid" });

    let getData = await Advisor_Model.find({ _id: userId });
    console.log(getData);
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
  try {
    const Advisor = await Advisor_Model.find();
    return res.status(200).send({ status: true, Data: Advisor });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  Advisor_register,
  Advisor_Login,
  get_Advisor,
  Get_All_Advisor,
};

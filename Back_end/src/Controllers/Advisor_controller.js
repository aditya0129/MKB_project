const Advisor_Model = require("../models/Advisor_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validateName,
  validatePassword,
  validateMobileNo
} = require("../Validation/Validate");
///const { Module } = require("module");

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
      name,
      Phone_number,
      email,
      password,
      expertise,
      profile_description,
      profile_picture,
      availability_schedule,
      payment_info,
      rating,
    } = data;

    if (!name || name == "") {
      return res.status(400).send({
        status: false,
        message: "Name is mandatory and Name Should not be Empty",
      });
    }
    if (!validateName(name.trim())) {
      return res
        .status(400)
        .send({ status: false, MSG: "please provide valid name" });
    }
    if (!Phone_number || Phone_number == "") {
      return res.status(400).send({
        status: false,
        message:
          "Phone_number is mandatory and Phone_number Should not be Empty",
      });
    }
    if (!validateMobileNo(Phone_number.trim())) {
      return res
        .status(400)
        .send({ status: false, MSG: "please provide valid Phone_number" });
    }
    let check_Number = await Advisor_Model.findOne({
      Phone_number: Phone_number,
    });
    if (check_Number) {
      return res
        .status(200)
        .send({
          status: false,
          MSg: "this number is Allready in use please provide Another Phone_Number",
        });
    }

    if (!password || password == "") {
      return res.status(400).send({
        status: false,
        message: "password is mandatory and password Should not be Empty",
      });
    }
    if (!validatePassword(password.trim())) {
      return res
        .status(400)
        .send({
          status: false,
          MSG: "Please provide valid password,it should contain uppercase,number and special character and 8-15 length",
        });
    }
    let hashing = bcrypt.hashSync(password, 8);
    data.password = hashing;

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
    let check_Email = await Advisor_Model.findOne({ email: email });
    if (check_Email) {
      return res.status(400).send({
        status: false,
        MSG: "this email already in use please provide Another Email",
      });
    }
    if (!expertise || expertise == "") {
      return res.status(400).send({
        status: false,
        message: "expertise is mandatory and expertise Should not be Empty",
      });
    }

    if (!profile_description || profile_description == "") {
      return res.status(400).send({
        status: false,
        message:
          "profile_description is mandatory and profile_description Should not be Empty",
      });
    }
    if (!profile_picture || profile_picture == "") {
      return res.status(400).send({
        status: false,
        message:
          "profile_picture is mandatory and profile_picture Should not be Empty",
      });
    }
    if (!availability_schedule || availability_schedule == "") {
      return res.status(400).send({
        status: false,
        message:
          "availability_schedule is mandatory and availability_schedule Should not be Empty",
      });
    }
    if (!payment_info || payment_info == "") {
      return res.status(400).send({
        status: false,
        message:
          "payment_info is mandatory and payment_info Should not be Empty",
      });
    }
    if (!rating || rating == "") {
      return res.status(400).send({
        status: false,
        message: "rating is mandatory and rating Should not be Empty",
      });
    }
    let Save_data = await Advisor_Model.create(data);
    return res
      .status(200)
      .send({ status: true, MSG: "register successfull", Data: Save_data });
  } catch (error) {
    return res.status(500).send({ status: false, Msg: error.message });
  }
};

const Advisor_Login = async function (req, res) {
  try {
    const data=req.body;
    if (Object.keys(data).length == 0) {
        return res.status(400).send({
          status: "false",
          message: "Please enter the data in request body",
        })
    };
    const{email,password}=data

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
      let check_Email = await Advisor_Model.findOne({ email: email });
      if (!check_Email) {
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
        return res
          .status(400)
          .send({
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
          userId: check_Email._id.toString(),
        },
        "man-ki-baat"
      );
      res.setHeader("x-api-key", token);
      res.send({ status: true, Token: token, msg: "login successfully" });


  } catch (error) {
    return res.status(500).send({ status: false, Msg: error.message });
  }
};

module.exports={Advisor_register,Advisor_Login}

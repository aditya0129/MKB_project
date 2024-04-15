const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validateName,
  validatePassword,
  validateMobileNo,
  validateAge,
} = require("../Validation/Validate");
const { isValidObjectId } = require("mongoose");

const Register_User = async function (req, res) {
  try {
    let data = req.body;
    let { name, email, password, age, gender, number } = data;

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

    if (!validateEmail(email)) {
      return res.status(400).send({
        status: false,
        Msg: "please provide email correct formate like abc012@gmail.com",
      });
    }

    let checkEmail = await UserModel.findOne({ email: email });
    if (checkEmail) {
      return res
        .status(400)
        .send({ status: false, msg: "email is already registered   please use nother email" });
    }
    console.log(checkEmail);

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

    if (!age)
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide your age" });
    if (!validateAge(age)) {
      return res
        .status(400)
        .send({ Status: false, Msg: "please provide valid age" });
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
    let savedata = await UserModel.create(data);
    return res
      .status(200)
      .send({ Status: true, Msg: "succesful Register", Data: savedata });
  } catch (error) {
    return res.status(500).send({ status: false, Msg: error.message });
  }
};

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

const Update_User = async function (req, res) {
  try {
    let userId = req.param.userId;

    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "User Id is invalid." });

    let getUserId = await userModel.findOne({ _id: userId });
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

      let checkEmailId = await userModel.findOne({ email: email });
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

module.exports = { Register_User, Login_user, get_Users, Update_User };

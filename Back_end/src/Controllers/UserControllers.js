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
        .send({ status: false, msg: "email is already registered " });
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
    let savedata=await UserModel.create(data)
    return res.status(200).send({Status:true,Msg:"succesful Register",Data:savedata})
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


module.exports = { Register_User ,Login_user,get_Users};

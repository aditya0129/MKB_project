const { check } = require("express-validator");

const validatePassword = (password) => {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(
    password
  );
};

const validateEmail = (email) => {
  return /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/.test(
    email
  );
};

const validateName = (name) => {
  return /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(name);
};

const validateMobileNo = (Number) => {
  return /^((\+91)?|91)?[6789][0-9]{9}$/g.test(Number);
};

const validateAge = (Age) => {
  return /^\S[0-9]{0,3}$/.test(Age);
};

const OtpVerifing = async function (otptime) {
  try {
    console.log("millisecond is: " + otptime);

    const cdateTime = new Date();
    let diff_value = (otptime - cdateTime.getTime()) / 1000;
    diff_value /= 60;

    const minutes = Math.abs(diff_value);
    console.log("expired minutes:-" + minutes);

    if (minutes > 5) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return res.status(500).send({ Status: false, Msg: error.message });
  }
};

const otpmailvalidator = [
  check("email", "please include valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
];

const verifymailvalidator = [
  check("user_id", "userId is required").not().isEmpty(),
  check("otp", "otp is required ").not().isEmpty(),
];

const advisorotpmailvalidator = [
  check("Email", "please include valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
];

const advisorverifymailvalidator = [
  check("advisor_id", "advisorId is required").not().isEmpty(),
  check("Otp", "otp is required ").not().isEmpty(),
];

module.exports = {
  validateEmail,
  validateName,
  validatePassword,
  validateMobileNo,
  validateAge,
  OtpVerifing,
  otpmailvalidator,
  verifymailvalidator,
  advisorotpmailvalidator,
  advisorverifymailvalidator,
};

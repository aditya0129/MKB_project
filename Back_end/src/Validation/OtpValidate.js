const OneMinutExpiry = async (otpTime) => {
  try {
    console.log("timestemp is: -" + otpTime);

    const c_DateTime = new Date();
    var diffrenceValue = (otpTime - c_DateTime.getTime()) / 1000;
    diffrenceValue /= 60;

    console.log("expiry minuts " + Math.abs(diffrenceValue));

    if (Math.abs(diffrenceValue) > 1) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const ThreeMinutExpiry = async (otpTime) => {
    try {
      console.log("timestemp is: -" + otpTime);
  
      const c_DateTime = new Date();
      var diffrenceValue = (otpTime - c_DateTime.getTime()) / 1000;
      diffrenceValue /= 60;
  
      console.log("expiry minuts " + Math.abs(diffrenceValue));
  
      if (Math.abs(diffrenceValue) > 3) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

module.exports = { OneMinutExpiry , ThreeMinutExpiry};

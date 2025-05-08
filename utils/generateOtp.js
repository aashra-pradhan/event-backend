const OTP = require("../models/otpModel");

exports.verifyOtp = (otp, email) => {
  try {
    const isEmailExists = OTP.findOne({ email: email });
    if (isEmailExists) {
      if (isEmailExists.otp === otp) {
        return true;
      } else {
        return false;
      }
    } else {
      console.log("Email didn't matched");
    }
  } catch (error) {}
};

exports.generateOtp = (email) => {
  const generatedOtp = (Math.floor(Math.random() * 10000) + 10000)
    .toString()
    .substring(1);
  try {
    if (email) {
      const savedOtp = new OTP({
        email: email,
        otp: generatedOtp,
      });
      savedOtp.save();
      if (savedOtp) {
        return savedOtp;
      }
    }
  } catch (error) {
    console.log("otp error", error);
  }
};

/// make otp of 4 digits
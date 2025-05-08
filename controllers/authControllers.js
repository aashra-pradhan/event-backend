const User = require("../models/userModel");
const { serverError, responseToUser } = require("../utils/response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmailValid = require("../utils/validateEmail");

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;

const twilioClient = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

exports.signupUser = async (req, res) => {
  try {
    const isUserExits = await User.findOne({
      email: req.body?.email,
    });
    if (isUserExits) {
      res
        .status(400)
        .json(
          responseToUser(false, 400, "User with this email already exists")
        );
    } else {
      const salt = await bcrypt.genSalt(10);

      const validEmail = isEmailValid(req.body.email);
      if (validEmail) {
        const newUser = await new User({
          fullName: req.body.fullName,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, salt),
          mobileNum: req.body.mobileNum,
          role: req.body.role || "user", // Default to 'user' if not provided
        });
        const savedUser = await newUser.save();

        res
          .status(201)
          .json(responseToUser(true, 201, "User signed-up successfully"));
      } else {
        res
          .status(400)
          .json(responseToUser(false, 400, "Please enter valid email"));
      }
    }
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.login = async (req, res) => {
  try {
    const isValidUser = await User.findOne({
      email: req.body?.email,
    });
    if (isValidUser) {
      const doesPasswordMatches = await bcrypt.compare(
        req.body?.password,
        isValidUser.password
      );

      if (doesPasswordMatches) {
        if (isValidUser.isVerified) {
          const access_token = await jwt.sign(
            { _id: isValidUser._id, role: isValidUser.role }, // added role here
            process.env.SECRET_TOKEN,
            { expiresIn: process.env.SECRET_TOKEN_EXPIRES_IN }
          );

          const refresh_token = await jwt.sign(
            { _id: isValidUser._id, role: isValidUser.role },
            process.env.REFRESH_SECRET_TOKEN,
            { expiresIn: process.env.REFRESH_SECRET_TOKEN_EXPIRES_IN }
          );

          let {
            _id,
            fullName,
            email,
            isVerified,
            requirePasswordChange,
            purchasedProducts,
            ...rest
          } = isValidUser;

          res.status(200).json(
            responseToUser(true, 200, "Logged in successfully", {
              data: {
                _id,
                access_token,
                refresh_token,
                fullName,
                email,
                role: isValidUser.role, // included role here
                isVerified,
                purchasedProducts,
                requirePasswordChange,
              },
            })
          );
        } else {
          res
            .status(400)
            .json(
              responseToUser(
                false,
                400,
                "Please verify your email before logging in"
              )
            );
        }
      } else {
        res.status(400).json(responseToUser(false, 400, "Invalid credentials"));
      }
    } else {
      res.status(400).json(responseToUser(false, 400, "Invalid credentials"));
    }
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.sendOtp = async (req, res) => {
  const { countryCode, mobileNumber } = req.body;
  try {
    await twilioClient.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+${countryCode}${mobileNumber}`,
        channel: "sms",
      });
    res
      .status(200)
      .json(
        responseToUser(
          true,
          200,
          "Verification Code has been sent tou your phone via SMS"
        )
      );
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.verifyOtp = async (req, res) => {
  const { countryCode, mobileNumber, otp } = req.body;
  try {
    const verificationResponse = await twilioClient?.verify?.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+${countryCode}${mobileNumber}`,
        code: otp,
      });

    if (verificationResponse.valid) {
      res
        .status(200)
        .json(responseToUser(true, 200, "OTP verified successfully"));
    } else {
      res
        .status(400)
        .json(responseToUser(false, 400, "Please enter valid OTP"));
    }
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.checkRefreshToken = async (req, res) => {
  try {
    const { email, refresh_token } = req.body;
    console.log(email, refresh_token);
    res.status(200).json({
      success: true,
      email: email,
    });
  } catch (error) {
    res.status(500).json(serverError());
  }
};

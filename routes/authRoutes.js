const express = require("express");
const {
  login,
  sendOtp,
  verifyOtp,
  signupUser,
  checkRefreshToken,
} = require("../controllers/authControllers");
const { verifyRefresh } = require("../middlewares/authToken");
const route = express.Router();

route.post("/signup-user", signupUser);
route.post("/login", login);
route.post("/get-otp", sendOtp);
route.post("/verify-otp", verifyOtp);
route.post("/refresh-token", verifyRefresh, checkRefreshToken);

module.exports = route;

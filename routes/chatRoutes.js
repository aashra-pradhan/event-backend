const express = require("express");
const {
  sendMessage,
  getChats,
  getChatRecipientsOfLoggedInUser,
} = require("../controllers/chatControllers");
const route = express.Router();
const { authToken } = require("../middlewares/authToken");

route.post("/send-message", authToken, sendMessage);
route.get("/fetch-messages", authToken, getChats);
route.get("/fetch-recipients", authToken, getChatRecipientsOfLoggedInUser);

module.exports = route;

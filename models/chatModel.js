const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  senderUsername: String,
  createdAt: { type: Date, default: Date.now },
});

// Create a Mongoose model for chat messages
const ChatModel = new mongoose.model("Chat", chatSchema);

module.exports = ChatModel;

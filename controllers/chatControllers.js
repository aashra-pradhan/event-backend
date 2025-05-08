const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const express = require("express");
const { serverError, responseToUser } = require("../utils/response");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//added snippet------asashru debug test
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    console.log(`User with ID ${userId} joined room.`);
    socket.join(userId); // This enables io.to(userId) to work
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
//added snippet------aashru debug test

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, senderUsername } = req.body;
    console.log(senderUsername, "<>");

    const newMessage = await Chat({
      senderId,
      receiverId,
      message,
      senderUsername,
    });
    await newMessage.save();

    io.to(receiverId).emit("receive message", req.body);

    res
      .status(201)
      .json(responseToUser(true, 201, "Message sent successfully"));
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.getChats = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    const sender = await User.findById(senderId);

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    const response = {
      messages,
      senderDetail: {
        userName: sender.fullName,
        id: sender._id,
      },
    };
    res
      .status(200)
      .json(
        responseToUser(true, 200, "Message retrieved successfully", response)
      );
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.getChatRecipientsOfLoggedInUser = async (req, res) => {
  try {
    const { loggedInUserId } = req.query;
    const sender = await User.findById(loggedInUserId);

    const messages = await Chat.find({ receiverId: loggedInUserId }).sort({
      createdAt: 1,
    });

    console.log(messages, "test");
    const allRecipients = messages.map((message) => {
      return { id: message.senderId, userName: message.senderUsername };
    });

    console.log(allRecipients, "all");

    // const response = {
    //   messages,
    //   senderDetail: {
    //     userName: sender.fullName,
    //     id: sender._id,
    //   },
    // };
    res
      .status(200)
      .json(
        responseToUser(
          true,
          200,
          "Message retrieved successfully",
          allRecipients
        )
      );
  } catch (error) {
    res.status(500).json(serverError());
  }
};

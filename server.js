require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");

//cors provides Express middleware to enable CORS
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const io = socketIO(server, { cors: { origin: "*" } });

// Socket.IO product handlers
io.on("connection", (socket) => {
  console.log("A user connected");

  // Product handler for sending messages
  socket.on("send message", (data) => {
    const { senderId, receiverId, message, socketId } = data;
    const chatRoomBetweenTwoUsers = senderId + receiverId;
    socket.join(chatRoomBetweenTwoUsers);
    socket.to(chatRoomBetweenTwoUsers).emit("receive message", {
      message: message,
      senderId: senderId,
      createdAt: Date.now(),
    });
    // Emit the message to the receiver

    console.log(data, "<>");
    io.emit("receive message", data);
  });

  // Product handler for disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth/", authRoutes);
app.use("/api/", categoryRoutes);
app.use("/api/", productRoutes);
app.use("/api/", promotionRoutes);
app.use("/api/", chatRoutes);
app.use("/api/admin/", adminRoutes);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

connectDb();

const PORT = process.env.PORT || 5000;

// app.use('/',()=>{res.json("his")})

// app.listen(PORT, () => {
//   console.log(`Server is running ${PORT}`);
// });

server.listen(PORT, () => {
  console.log("Server also connected");
});

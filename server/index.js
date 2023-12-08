import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { config } from "dotenv";
import helmet from "helmet";
import { userRouter } from "./routes/user.route.js";
import bodyParser from "body-parser";
import harperSaveMessage from "./services/save-message.js";
import harperGetMessages from "./services/get-messages.js";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(helmet());
app.disable("x-powered-by");
app.use(bodyParser.json());
app.use("/user", userRouter);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

config();

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);

    harperGetMessages(userId)
      .then((data) => {
        socket.emit("previous-message", data);
      })
      .catch((err) => console.log(err));
  });

  socket.on("send-chat-message", ({ toUserId, message, fromUserId }) => {
    const toUserSocketId = onlineUsers.get(toUserId);
    if (toUserSocketId) {
      io.to(toUserSocketId).emit("chat-message", toUserId, message, fromUserId);
      harperSaveMessage(message, toUserId, fromUserId)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    } else {
      console.log("User not found:", toUserId);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Backend for Flamingo");
});

server.listen(4000, () => console.log("Server is running on port 4000"));

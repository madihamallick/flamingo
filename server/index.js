import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { config } from "dotenv";
import harperSaveMessage from "./services/harper-save-message.js";
import harperGetMessages from "./services/harper-get-messages.js";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  },
});

config();

io.on('connection', (socket) => {
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', message)
  })
  // socket.on('chat-message', (msg) => {
  //   console.log('message: ' + msg);
  // });
});

server.listen(4000, () => "Server is running on port 4000");

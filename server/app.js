import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import messageRoutes from "./routes/messages.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", // Vite port
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/messages", messageRoutes);

// Socket.IO
io.on("connection", socket => {
  console.log("A user connected:", socket.id);

  socket.on("chat message", async msg => {
    const message = new Message({ username: msg.username, text: msg.text });
    await message.save();
    io.emit("chat message", message); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost/chatdb")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

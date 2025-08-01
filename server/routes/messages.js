import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
  res.json(messages);
});

export default router;

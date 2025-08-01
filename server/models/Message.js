import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  username: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Message", MessageSchema);

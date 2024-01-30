const mongoose = require("mongoose");

const postTaskMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostTask",
      required: true,
    },
  },
  { timestamps: true }
);

const PostTaskMessage = mongoose.model("PostTaskMessage", postTaskMessageSchema);

module.exports = PostTaskMessage;

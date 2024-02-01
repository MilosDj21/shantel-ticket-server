const mongoose = require("mongoose");

const postTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    dueTime: {
      type: Number,
      required: true,
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostRequest",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostTaskGroup",
      required: true,
    },
  },
  { timestamps: true }
);

const PostTask = mongoose.model("PostTask", postTaskSchema);

module.exports = PostTask;

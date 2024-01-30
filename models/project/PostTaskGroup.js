const mongoose = require("mongoose");

const postTaskGroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PostTaskGroup = mongoose.model("PostTaskGroup", postTaskGroupSchema);

module.exports = PostTaskGroup;

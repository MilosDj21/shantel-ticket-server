const mongoose = require("mongoose");

const postTaskGroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

const PostTaskGroup = mongoose.model("PostTaskGroup", postTaskGroupSchema);

module.exports = PostTaskGroup;

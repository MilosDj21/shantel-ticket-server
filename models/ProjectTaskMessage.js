const mongoose = require("mongoose");

const projectTaskMessageSchema = new mongoose.Schema(
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
      ref: "ProjectTask",
      required: true,
    },
  },
  { timestamps: true }
);

const ProjectTaskMessage = mongoose.model("ProjectTaskMessage", projectTaskMessageSchema);

module.exports = ProjectTaskMessage;

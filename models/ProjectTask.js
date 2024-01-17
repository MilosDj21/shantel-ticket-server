const mongoose = require("mongoose");

const projectTaskSchema = new mongoose.Schema(
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
    assignedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectTaskSchema);

module.exports = Project;

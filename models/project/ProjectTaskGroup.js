const mongoose = require("mongoose");

const projectTaskGroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProjectTaskGroup = mongoose.model("ProjectTaskGroup", projectTaskGroupSchema);

module.exports = ProjectTaskGroup;

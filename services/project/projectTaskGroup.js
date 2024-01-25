const ProjectTaskGroup = require("../../models/project/ProjectTaskGroup");
const mongoose = require("mongoose");

module.exports.findOne = async (groupId) => {
  if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) throw Error("Invalid task group id");
  const group = await ProjectTaskGroup.findById(groupId);
  if (!group) throw Error("Invalid task group");
  return group;
};

module.exports.findAll = async () => {
  const groups = await ProjectTaskGroup.find({});
  if (!groups) throw Error("Invalid task groups");
  return groups;
};

module.exports.saveOne = async (title) => {
  if (!title || title.length === 0) throw Error("Invalid title");
  const group = await ProjectTaskGroup.create({ title });
  if (!group) throw Error("Creating task group failed");
  return group;
};

module.exports.updateOne = async (groupId, title) => {
  if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) throw Error("Invalid task group id");
  if (!title || title.length === 0) throw Error("Invalid title");
  const group = await ProjectTaskGroup.findByIdAndUpdate(groupId, { title }, { new: true });
  if (!group) throw Error("Updating task group failed");
  return group;
};

module.exports.deleteOne = async (groupId) => {
  if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) throw Error("Invalid task group id");
  const group = await ProjectTaskGroup.findByIdAndDelete(groupId);
  if (!group) throw Error("Deleting task group failed");
  return group;
};

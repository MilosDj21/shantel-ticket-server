const PostTaskGroup = require("../../models/project/PostTaskGroup");
const mongoose = require("mongoose");

module.exports.findOne = async (groupId) => {
  if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) throw Error("Invalid task group id");
  const group = await PostTaskGroup.findById(groupId);
  if (!group) throw Error("Invalid task group");
  return group;
};

module.exports.findAll = async () => {
  const groups = await PostTaskGroup.find({});
  if (!groups) throw Error("Invalid task groups");
  return groups;
};

module.exports.saveOne = async (title, project) => {
  if (!title || title.length === 0) throw Error("Invalid title");
  if (!project || !mongoose.Types.ObjectId.isValid(project)) throw Error("Invalid project id");
  const existing = await PostTaskGroup.find({ title, project: new mongoose.Types.ObjectId(project) })
  // TODO: treba da se uradi sa aggregate da popuni taskove posto ovako uvek vraca bez taskova i onda front ne zna jel nova grupa ili je postojeca
  if (existing.length > 0) {
    console.log("🚀 ~ module.exports.saveOne= ~ existing:", existing);
    return existing[0];
  }
  const group = await PostTaskGroup.create({ title, project });
  console.log("🚀 ~ module.exports.saveOne= ~ group:", group);
  if (!group) throw Error("Creating task group failed");
  return group;
};

module.exports.updateOne = async (groupId, groupObject) => {
  if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) throw Error("Invalid task group id");
  const group = await PostTaskGroup.findByIdAndUpdate(groupId, { ...groupObject }, { new: true });
  if (!group) throw Error("Updating task group failed");
  return group;
};

module.exports.deleteOne = async (groupId) => {
  if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) throw Error("Invalid task group id");
  const group = await PostTaskGroup.findByIdAndDelete(groupId);
  if (!group) throw Error("Deleting task group failed");
  return group;
};

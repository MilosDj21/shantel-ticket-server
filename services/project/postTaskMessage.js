const PostTaskMessage = require("../../models/project/PostTaskMessage");
const mongoose = require("mongoose");

module.exports.findOne = async (messageId) => {
  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) throw Error("Invalid task message id");
  const message = await PostTaskMessage.findById(messageId);
  if (!message) throw Error("Invalid task message");
  return message;
};

module.exports.findAll = async () => {
  const messages = await PostTaskMessage.find({});
  if (!messages) throw Error("Invalid task messages");
  return messages;
};

module.exports.saveOne = async (msg, image, user, task) => {
  if (!task || !mongoose.Types.ObjectId.isValid(task)) throw Error("Invalid task id");
  const message = await PostTaskMessage.create({ message: msg, image, user, task });
  if (!message) throw Error("Creating task message failed");
  return message;
};

module.exports.updateOne = async (messageId, messageObj) => {
  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) throw Error("Invalid task message id");
  const message = await PostTaskMessage.findByIdAndUpdate(messageId, { ...messageObj }, { new: true });
  if (!message) throw Error("Updating task message failed");
  return message;
};

module.exports.deleteOne = async (messageId) => {
  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) throw Error("Invalid task message id");
  const message = await PostTaskMessage.findByIdAndDelete(messageId);
  if (!message) throw Error("Deleting task message failed");
  return message;
};

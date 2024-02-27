const PostTaskMessage = require("../../models/project/PostTaskMessage");
const mongoose = require("mongoose");

module.exports.findOne = async (messageId) => {
  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) throw Error("Invalid task message id");
  return aggregateFind(messageId);
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
  return aggregateFind(message._id);
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

const aggregateFind = async (messageId) => {
  const messages = await PostTaskMessage.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(messageId) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "task",
        foreignField: "_id",
        as: "task",
      },
    },
    {
      $unwind: {
        path: "$task",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "user.password": 0,
        "user.secret": 0,
      },
    },
  ]);
  if (!messages[0]) throw Error("No such message");
  return messages[0];
};

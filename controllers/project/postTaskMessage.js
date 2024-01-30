const fs = require("fs");
const path = require("path");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../services/project/postTaskMessage");

module.exports.findOne = async (req, res) => {
  const { messageId } = req.params;
  try {
    const message = await findOne(messageId);
    res.status(200).json({ status: "success", data: message });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const messages = await findAll();
    res.status(200).json({ status: "success", data: messages });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { userId } = req;
  const { message, task } = req.body;
  const messageImage = req.file;
  try {
    const image = messageImage ? messageImage.path : "";
    const message = await saveOne(message, image, userId, task);
    res.status(200).json({ status: "success", data: message });
  } catch (error) {
    if (messageImage) {
      fs.unlink(path.join(__dirname, `../../${messageImage.path}`), (error) => {
        if (error) console.log(error);
      });
    }
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { messageId } = req.params;
  const { message } = req.body;
  const messageImage = req.file;
  try {
    const messageObj = {};
    if (message) messageObj.message = message;
    if (messageImage) messageObj.image = messageImage.path;
    const message = await updateOne(messageId, messageObj);
    res.status(200).json({ status: "success", data: message });
  } catch (error) {
    if (messageImage) {
      fs.unlink(path.join(__dirname, `../../${messageImage.path}`), (error) => {
        if (error) console.log(error);
      });
    }
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { messageId } = req.params;
  try {
    const message = await deleteOne(messageId);
    res.status(200).json({ status: "success", data: message });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

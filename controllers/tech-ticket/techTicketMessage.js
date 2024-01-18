const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const TicketMessage = require("../../models/tech-ticket/TechTicketMessage");

module.exports.findOne = async (req, res) => {
  const { ticketId, messageId } = req.params;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    if (!messageId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket message id");

    const ticketMessage = await TicketMessage.findById(messageId).populate("user", "-password").populate("ticket");
    if (!ticketMessage) throw Error("Invalid ticket message");
    if (ticketMessage.ticket._id.toString() !== ticketId) throw Error("Invalid ticket message");

    res.status(200).json({ status: "success", data: ticketMessage });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { ticketId } = req.params;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    let ticketMessages = await TicketMessage.find({ ticket: ticketId }).populate("user", "-password").populate("ticket");
    res.status(200).json({ status: "success", data: ticketMessages });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { ticketId } = req.params;
  const { message, userId } = req.body;
  const messageImage = req.file;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    if (!message || !userId) throw Error("All fields must be filled");
    const image = messageImage ? messageImage.path : "";

    let ticketMessage = await TicketMessage.create({ message, image, user: userId, ticket: ticketId });
    if (!ticketMessage) throw Error("Creating ticket message failed");
    ticketMessage = await ticketMessage.populate("user", "-password");
    res.status(200).json({ status: "success", data: ticketMessage });
  } catch (error) {
    if (messageImage) {
      fs.unlink(path.join(__dirname, `../${messageImage.path}`), (error) => {
        if (error) console.log(error);
      });
    }
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { ticketId } = req.params;
  const { id, message, userId } = req.body;
  const messageImage = req.file;
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) throw Error("Invalid ticket message id");
    const messageObj = {};
    if (message) messageObj.message = message;
    if (userId) messageObj.user = userId;
    if (ticketId) messageObj.ticket = ticketId;
    if (messageImage) messageObj.image = messageImage.path;

    const ticketMessage = await TicketMessage.findByIdAndUpdate(id, { ...messageObj }, { new: true });
    if (!ticketMessage) throw Error("Updating ticket message failed");
    res.status(200).json({ status: "success", data: ticketMessage });
  } catch (error) {
    if (messageImage) {
      fs.unlink(path.join(__dirname, `../${messageImage.path}`), (error) => {
        if (error) console.log(error);
      });
    }
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { messageId } = req.params;
  try {
    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) throw Error("Invalid ticket message id");
    const ticketMessage = await TicketMessage.findByIdAndDelete(messageId);
    if (!ticketMessage) throw Error("Deleting ticket message failed");
    res.status(200).json({ status: "success", data: ticketMessage });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

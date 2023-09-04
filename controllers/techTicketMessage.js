const mongoose = require("mongoose");
const TicketMessage = require("../models/TechTicketMessage");

module.exports.findOne = async (req, res) => {
  const { userId, ticketId, messageId } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    if (!messageId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket message id");

    const ticketMessage = await TicketMessage.findById(messageId);
    if (!ticketMessage) throw Error("Invalid ticket message");

    res.status(200).json({ status: "success", data: ticketMessage });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const ticketMessages = await TicketMessage.find({ ticketId });
    res.status(200).json({ status: "success", data: ticketMessages });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { userId, ticketId } = req.params;
  const { message } = req.body;
  console.log(req.body);
  const messageImage = req.file;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    if (!message || !messageImage) throw Error("All fields must be filled");

    const ticketMessage = await TicketMessage.create({ message, image: messageImage.path, userId, ticketId });
    if (!ticketMessage) throw Error("Creating ticket message failed");
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
  const { id, message, userId, ticketId } = req.body;
  const messageImage = req.file;
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) throw Error("Invalid ticket message id");
    const messageObj = {};
    if (message) messageObj.message = message;
    if (userId) messageObj.userId = userId;
    if (ticketId) messageObj.ticketId = ticketId;
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

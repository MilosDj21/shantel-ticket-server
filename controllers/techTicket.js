const mongoose = require("mongoose");
const Ticket = require("../models/TechTicket");

// controllers for all tickets
module.exports.findOne = async (req, res) => {
  const { ticketId } = req.params;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");

    const ticket = await Ticket.findById(ticketId).populate("user", "-password");
    if (!ticket) throw Error("Invalid ticket");

    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("user", "-password");
    res.status(200).json({ status: "success", data: tickets });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { title, category, userId } = req.body;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!title || !category) throw Error("All fields must be filled");

    const ticket = await Ticket.create({ title, status: "new", category, user: userId });
    if (!ticket) throw Error("Creating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { id, title, status, category, userId } = req.body;
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) throw Error("Invalid ticket id");
    const ticketObj = {};
    if (title) ticketObj.title = title;
    if (status) ticketObj.status = status;
    if (category) ticketObj.category = category;
    if (userId) ticketObj.user = userId;

    const ticket = await Ticket.findByIdAndUpdate(id, { ...ticketObj }, { new: true });
    if (!ticket) throw Error("Updating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { ticketId } = req.params;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) throw Error("Deleting ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// controllers for specific users tickets
module.exports.findOneByUser = async (req, res) => {
  const { userId, ticketId } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");

    const ticket = await Ticket.findById(ticketId).populate("user", "-password");
    if (ticket.length === 0 || ticket.user._id.toString() !== userId) throw Error("Invalid ticket");

    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAllByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");

    let tickets = await Ticket.find({ user: userId }).populate("user", "-password");

    res.status(200).json({ status: "success", data: tickets });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOneByUser = async (req, res) => {
  const { userId } = req.params;
  const { title, category } = req.body;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!title || !category) throw Error("All fields must be filled");

    const ticket = await Ticket.create({ title, status: "new", category, user: userId });
    if (!ticket) throw Error("Creating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

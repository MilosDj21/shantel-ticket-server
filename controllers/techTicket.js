const mongoose = require("mongoose");
const Ticket = require("../models/TechTicket");

// controllers for all tickets
module.exports.findOne = async (req, res) => {
  const { ticketId } = req.params;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw Error("Invalid ticket");

    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const tickets = await Ticket.find();
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

    const ticket = await Ticket.create({ title, status: "new", category, userId });
    if (!ticket) throw Error("Creating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { ticketId } = req.body;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    const ticket = await Ticket.findByIdAndUpdate(ticketId, { ...req.body }, { new: true });
    if (!ticket) throw Error("Updating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { ticketId } = req.body;
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

    const ticket = await Ticket.find({ _id: ticketId, userId: userId });
    if (ticket.length === 0) throw Error("Invalid ticket");

    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAllByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");

    const tickets = await Ticket.find({ userId: userId });

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

    const ticket = await Ticket.create({ title, status: "new", category, userId });
    if (!ticket) throw Error("Creating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

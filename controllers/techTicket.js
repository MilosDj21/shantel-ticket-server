const mongoose = require("mongoose");
const Ticket = require("../models/TechTicket");
const TicketMessage = require("../models/TechTicketMessage");
const User = require("../models/User");

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
  const { searchValue } = req.params;
  try {
    let tickets = await Ticket.find().populate("user", "-password");
    if (searchValue) {
      const searchTicketArray = [];
      let ticketMessages = await TicketMessage.find().populate("ticket");
      const isAlreadyInSearchArray = (ticket) => {
        for (const s of searchTicketArray) {
          if (s._id.equals(ticket._id)) {
            return true;
          }
        }
        return false;
      };
      for (const t of tickets) {
        if (t.title.toLowerCase().includes(searchValue.toLowerCase())) {
          if (!isAlreadyInSearchArray(t)) {
            searchTicketArray.push(t);
          }
        }
      }
      for (const t of ticketMessages) {
        if (t.message.toLowerCase().includes(searchValue.toLowerCase())) {
          if (!isAlreadyInSearchArray(t.ticket)) {
            const user = await User.findById(t.ticket.user, { password: 0 });
            t.ticket.user = user;
            searchTicketArray.push(t.ticket);
          }
        }
      }
      res.status(200).json({ status: "success", data: searchTicketArray });
    } else {
      res.status(200).json({ status: "success", data: tickets });
    }
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
  const { userId, searchValue } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    let tickets = await Ticket.find({ user: userId }).populate("user", "-password");
    if (searchValue) {
      const searchTicketArray = [];
      let ticketMessages = await TicketMessage.find().populate("ticket");
      const isAlreadyInSearchArray = (ticket) => {
        for (const s of searchTicketArray) {
          if (s._id.equals(ticket._id)) {
            return true;
          }
        }
        return false;
      };
      for (const t of tickets) {
        if (t.title.toLowerCase().includes(searchValue.toLowerCase())) {
          if (!isAlreadyInSearchArray(t)) {
            searchTicketArray.push(t);
          }
        }
      }
      for (const t of ticketMessages) {
        if (t.message.toLowerCase().includes(searchValue.toLowerCase())) {
          if (t.ticket.user.equals(userId)) {
            if (!isAlreadyInSearchArray(t.ticket)) {
              const user = await User.findById(userId, { password: 0 });
              t.ticket.user = user;
              searchTicketArray.push(t.ticket);
            }
          }
        }
      }
      res.status(200).json({ status: "success", data: searchTicketArray });
    } else {
      res.status(200).json({ status: "success", data: tickets });
    }
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

    const ticket = await Ticket.create({ title, status: "New", category, user: userId });
    if (!ticket) throw Error("Creating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

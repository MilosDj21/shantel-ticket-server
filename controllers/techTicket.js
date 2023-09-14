const mongoose = require("mongoose");
const Ticket = require("../models/TechTicket");
const TicketMessage = require("../models/TechTicketMessage");
const User = require("../models/User");

// controllers for all tickets
module.exports.findOne = async (req, res) => {
  const { ticketId } = req.params;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");

    const tickets = await Ticket.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(ticketId) } },
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
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "techticketmessages",
          localField: "_id",
          foreignField: "ticket",
          as: "messages",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ],
        },
      },
      {
        $lookup: {
          from: "techticketlogs",
          localField: "_id",
          foreignField: "ticket",
          as: "logs",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ],
        },
      },
      {
        $project: {
          "user.password": 0,
          "messages.user.password": 0,
          "logs.user.password": 0,
        },
      },
    ]);
    if (!tickets) throw Error("Invalid ticket");

    res.status(200).json({ status: "success", data: tickets[0] });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { searchValue } = req.params;
  try {
    const tickets = await Ticket.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "techticketmessages",
          localField: "_id",
          foreignField: "ticket",
          as: "messages",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ],
        },
      },
      {
        $lookup: {
          from: "techticketlogs",
          localField: "_id",
          foreignField: "ticket",
          as: "logs",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ],
        },
      },
      {
        $project: {
          "user.password": 0,
          "messages.user.password": 0,
          "logs.user.password": 0,
        },
      },
    ]);

    if (searchValue) {
      const searchTicketArray = [];
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
        } else {
          for (const m of t.messages) {
            if (m.message.toLowerCase().includes(searchValue.toLowerCase())) {
              if (!isAlreadyInSearchArray(t)) {
                searchTicketArray.push(t);
                break;
              }
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

    const combined = await Ticket.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "techticketmessages",
          localField: "_id",
          foreignField: "ticket",
          as: "messages",
        },
      },
    ]);
    const tickets = await Ticket.populate(combined, { path: "user", select: "_id email firstName lastName roles profileImage createdAt updatedAt" });
    if (searchValue) {
      const searchTicketArray = [];
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
        } else {
          for (const m of t.messages) {
            if (m.message.toLowerCase().includes(searchValue.toLowerCase())) {
              if (!isAlreadyInSearchArray(t)) {
                searchTicketArray.push(t);
                break;
              }
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

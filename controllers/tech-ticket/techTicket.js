const mongoose = require("mongoose");
const Ticket = require("../../models/tech-ticket/TechTicket");
const TicketMessage = require("../../models/tech-ticket/TechTicketMessage");
const User = require("../../models/User");

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
          "user.secret": 0,
          "messages.user.password": 0,
          "messages.user.secret": 0,
          "logs.user.password": 0,
          "logs.user.secret": 0,
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
  // TODO: update search to include user name
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
          "user.secret": 0,
          "messages.user.password": 0,
          "messages.user.secret": 0,
          "logs.user.password": 0,
          "logs.user.secret": 0,
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

    const ticket = await Ticket.create({ title, status: "new", category, seenByAdmin: false, user: userId });
    if (!ticket) throw Error("Creating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { ticketId } = req.params;
  const { title, status, category, seenByAdmin, userId } = req.body;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    const ticketObj = {};
    if (title) ticketObj.title = title;
    if (status) ticketObj.status = status;
    if (category) ticketObj.category = category;
    if (seenByAdmin) ticketObj.seenByAdmin = seenByAdmin;
    if (userId) ticketObj.user = userId;

    const ticket = await Ticket.findByIdAndUpdate(ticketId, { ...ticketObj }, { new: true });
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

// CONTROLLERS FOR SPECIFIC USER TICKETS
module.exports.findOneByUser = async (req, res) => {
  const { userId, ticketId } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");

    const tickets = await Ticket.aggregate([
      { $match: { $and: [{ _id: new mongoose.Types.ObjectId(ticketId) }, { user: new mongoose.Types.ObjectId(userId) }] } },
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
        $project: {
          "user.password": 0,
          "user.secret": 0,
          "messages.user.password": 0,
          "messages.user.secret": 0,
        },
      },
    ]);
    if (!tickets) throw Error("Invalid ticket");
    res.status(200).json({ status: "success", data: tickets[0] });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAllByUser = async (req, res) => {
  const { userId, searchValue } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");

    const tickets = await Ticket.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
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
        $project: {
          "user.password": 0,
          "user.secret": 0,
          "messages.user.password": 0,
          "messages.user.secret": 0,
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

module.exports.saveOneByUser = async (req, res) => {
  const { userId } = req.params;
  const { title, category } = req.body;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!title || !category) throw Error("All fields must be filled");

    const ticket = await Ticket.create({ title, status: "New", category, seenByAdmin: false, user: userId });
    if (!ticket) throw Error("Creating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOneByUser = async (req, res) => {
  // USER CAN ONLY UPDATE STATUS(WHEN USER REPLY, STATUS CHANGES TO NEW)
  const { ticketId } = req.params;
  const { status } = req.body;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    if (!status) throw Error("All fields must be filled");

    const ticket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
    if (!ticket) throw Error("Updating ticket failed");
    res.status(200).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

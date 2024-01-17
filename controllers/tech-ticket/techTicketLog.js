const TicketLog = require("../../models/TechTicketLog");
const mongoose = require("mongoose");

module.exports.findOne = async (req, res) => {};
module.exports.findAllByTicket = async (req, res) => {};
module.exports.saveOne = async (req, res) => {
  const { ticketId } = req.params;
  const { message, userId } = req.body;
  try {
    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) throw Error("Invalid ticket id");
    if (!message || !userId) throw Error("All fields must be filled");

    const ticketLog = await TicketLog.create({ message, user: userId, ticket: ticketId });
    if (!ticketLog) throw Error("Creating ticket message failed");
    const ticketWithUser = await ticketLog.populate("user", "-password");
    res.status(200).json({ status: "success", data: ticketWithUser });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
module.exports.updateOne = async (req, res) => {};
module.exports.deleteOne = async (req, res) => {};

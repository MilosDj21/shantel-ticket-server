const mongoose = require("mongoose");

const techTicketMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
  },
  { timestamps: true }
);

// TODO: change controllers to use populate for userId and ticketId

const TechTicketMessage = mongoose.model("TechTicketMessage", techTicketMessageSchema);

module.exports = TechTicketMessage;

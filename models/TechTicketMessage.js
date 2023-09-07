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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechTicket",
      required: true,
    },
  },
  { timestamps: true }
);

const TechTicketMessage = mongoose.model("TechTicketMessage", techTicketMessageSchema);

module.exports = TechTicketMessage;

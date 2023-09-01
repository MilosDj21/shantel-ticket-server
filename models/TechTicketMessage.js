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
      type: String,
      required: true,
    },
    ticketId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TechTicketMessage = mongoose.model("TechTicketMessage", techTicketMessageSchema);

module.exports = TechTicketMessage;

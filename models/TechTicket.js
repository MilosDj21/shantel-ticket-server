const mongoose = require("mongoose");

const techTicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TechTicket = mongoose.model("TechTicket", techTicketSchema);

module.exports = TechTicket;

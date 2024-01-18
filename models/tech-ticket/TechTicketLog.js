const mongoose = require("mongoose");

const techTicketLogSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
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

const TechTicketLog = mongoose.model("TechTicketLog", techTicketLogSchema);

module.exports = TechTicketLog;

const mongoose = require("mongoose");
const TicketMessage = require("./TechTicketMessage");
const TicketLog = require("./TechTicketLog");

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
    seenByAdmin: {
      type: Boolean,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

techTicketSchema.pre("findOneAndDelete", async function (next) {
  try {
    const ticketId = this.getFilter()._id;
    await TicketMessage.deleteMany({ ticket: new mongoose.Types.ObjectId(ticketId) });
    await TicketLog.deleteMany({ ticket: new mongoose.Types.ObjectId(ticketId) });
  } catch (error) {
    console.log(error);
  }
  next();
});

const TechTicket = mongoose.model("TechTicket", techTicketSchema);

module.exports = TechTicket;

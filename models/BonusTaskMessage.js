const mongoose = require("mongoose");

const bonusTaskMessageSchema = new mongoose.Schema(
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
    bonusTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BonusTask",
      required: true,
    },
  },
  { timestamps: true }
);

const BonusTaskMessage = mongoose.model("BonusTaskMessage", bonusTaskMessageSchema);

module.exports = BonusTaskMessage;

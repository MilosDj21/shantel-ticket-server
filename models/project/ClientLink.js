const mongoose = require("mongoose");

const ClientLinkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },
    status: {
      type: String,
    },
    lastCheckedAt: {
      type: Date,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
  },
  { timestamps: true }
);

const ClientLink = mongoose.model("ClientLink", ClientLinkSchema);

module.exports = ClientLink;

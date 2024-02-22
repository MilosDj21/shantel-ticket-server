const mongoose = require("mongoose");

const ClientLinkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    clientWebsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientWebsite",
      required: true,
    },
  },
  { timestamps: true }
);

const ClientLink = mongoose.model("ClientLink", ClientLinkSchema);

module.exports = ClientLink;

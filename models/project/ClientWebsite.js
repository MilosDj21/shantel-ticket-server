const mongoose = require("mongoose");

const ClientWebsiteSchema = new mongoose.Schema(
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

const ClientWebsite = mongoose.model("ClientWebsite", ClientWebsiteSchema);

module.exports = ClientWebsite;

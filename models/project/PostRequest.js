const mongoose = require("mongoose");

const postRequestSchema = new mongoose.Schema(
  {
    website: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Website",
      required: true,
    },
    postCategory: {
      type: String,
      required: true,
    },
    progressLevel: {
      type: String,
      required: true,
    },
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    copywriter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    anchorKeyword: {
      type: String,
    },
    clientPaidLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientLink",
    },
    textLink: {
      type: String,
    },
    postLink: {
      type: String,
    },
    urgencyLevel: {
      type: String,
    },
    wordNum: {
      type: Number,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    clientHasText: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const PostRequest = mongoose.model("PostRequest", postRequestSchema);

module.exports = PostRequest;

const Link = require("../../models/project/ClientLink");
const mongoose = require("mongoose");

module.exports.findOne = async (linkId) => {
  if (!linkId || !mongoose.Types.ObjectId.isValid(linkId)) throw Error("Invalid link id");
  const links = await Link.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(linkId) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: "$client",
    },
    {
      $lookup: {
        from: "postrequests",
        localField: "_id",
        foreignField: "clientPaidLink",
        as: "posts",
      },
    },
  ]);
  if (!links[0]) throw Error("No such link");
  return links[0];
};

module.exports.findAll = async (searchValue) => {
  let links = await Link.find({});
  if (!links) throw Error("Invalid links");
  if (searchValue) {
    links = links.filter((l) => {
      l.url.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return links;
};

module.exports.saveOne = async (linkObj) => {
  const link = await Link.create({ ...linkObj });
  if (!link) throw Error("Creating link failed");
  return link;
};

module.exports.updateOne = async (linkId, linkObj) => {
  if (!linkId || !mongoose.Types.ObjectId.isValid(linkId)) throw Error("Invalid link id");
  const link = await Link.findByIdAndUpdate(linkId, { ...linkObj }, { new: true });
  if (!link) throw Error("Updating link failed");
  return link;
};

module.exports.deleteOne = async (linkId) => {
  if (!linkId || !mongoose.Types.ObjectId.isValid(linkId)) throw Error("Invalid link id");
  const link = await Link.findByIdAndDelete(linkId);
  if (!link) throw Error("Deleting link failed");
  return link;
};

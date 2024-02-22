const ClientLink = require("../../models/project/ClientLink");
const mongoose = require("mongoose");

module.exports.findOne = async (linkId) => {
  if (!linkId || !mongoose.Types.ObjectId.isValid(linkId)) throw Error("Invalid link id");
  const links = await ClientLink.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(linkId) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "clientwebsites",
        localField: "clientWebsite",
        foreignField: "_id",
        as: "clientWebsite",
      },
    },
    {
      $unwind: {
        path: "$clientWebsite",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
  if (!links[0]) throw Error("No such link");
  return links[0];
};

module.exports.findAll = async (searchValue) => {
  let links = await ClientLink.find({});
  if (!links) throw Error("Invalid links");
  if (searchValue) {
    links = links.filter((l) => {
      return l.url.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return links;
};

module.exports.saveOne = async (linkObj) => {
  const link = await ClientLink.create({ ...linkObj });
  if (!link) throw Error("Creating link failed");
  return link;
};

module.exports.updateOne = async (linkId, linkObj) => {
  if (!linkId || !mongoose.Types.ObjectId.isValid(linkId)) throw Error("Invalid link id");
  const link = await ClientLink.findByIdAndUpdate(linkId, { ...linkObj }, { new: true });
  if (!link) throw Error("Updating link failed");
  return link;
};

module.exports.deleteOne = async (linkId) => {
  if (!linkId || !mongoose.Types.ObjectId.isValid(linkId)) throw Error("Invalid link id");
  const link = await ClientLink.findByIdAndDelete(linkId);
  if (!link) throw Error("Deleting link failed");
  return link;
};

const ClientWebsite = require("../../models/project/ClientWebsite");
const mongoose = require("mongoose");

module.exports.findOne = async (websiteId) => {
  if (!websiteId || !mongoose.Types.ObjectId.isValid(websiteId)) throw Error("Invalid website id");
  const websites = await ClientWebsite.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(websiteId) } },
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
      $unwind: {
        path: "$client",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "clientlinks",
        localField: "_id",
        foreignField: "clientWebsite",
        as: "clientLinks",
      },
    },
    {
      $lookup: {
        from: "postrequests",
        localField: "_id",
        foreignField: "clientWebsite",
        as: "posts",
      },
    },
  ]);
  if (!websites[0]) throw Error("No such website");
  return websites[0];
};

module.exports.findAll = async (searchValue) => {
  let websites = await ClientWebsite.find({});
  if (!websites) throw Error("Invalid websites");
  if (searchValue) {
    websites = websites.filter((l) => {
      return l.url.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return websites;
};

module.exports.saveOne = async (websiteObj) => {
  const website = await ClientWebsite.create({ ...websiteObj });
  if (!website) throw Error("Creating website failed");
  return website;
};

module.exports.updateOne = async (websiteId, websiteObj) => {
  if (!websiteId || !mongoose.Types.ObjectId.isValid(websiteId)) throw Error("Invalid website id");
  const website = await ClientWebsite.findByIdAndUpdate(websiteId, { ...websiteObj }, { new: true });
  if (!website) throw Error("Updating website failed");
  return website;
};

module.exports.deleteOne = async (websiteId) => {
  if (!websiteId || !mongoose.Types.ObjectId.isValid(websiteId)) throw Error("Invalid website id");
  const website = await ClientWebsite.findByIdAndDelete(websiteId);
  if (!website) throw Error("Deleting website failed");
  return website;
};

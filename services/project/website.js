const Website = require("../../models/project/Website");
const mongoose = require("mongoose");

module.exports.findOne = async (websiteId) => {
  if (!websiteId || !mongoose.Types.ObjectId.isValid(websiteId)) throw Error("Invalid website id");
  const websites = await Website.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(websiteId) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "postrequests",
        localField: "_id",
        foreignField: "website",
        as: "postRequests",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "editor",
              foreignField: "_id",
              as: "editor",
            },
          },
          {
            $unwind: "$editor",
          },
          {
            $lookup: {
              from: "users",
              localField: "copywriter",
              foreignField: "_id",
              as: "copywriter",
            },
          },
          {
            $unwind: "$copywriter",
          },
        ],
      },
    },
    {
      $project: {
        "postRequests.editor.password": 0,
        "postRequests.editor.secret": 0,
        "postRequests.copywriter.password": 0,
        "postRequests.copywriter.secret": 0,
      },
    },
  ]);
  if (!websites[0]) throw Error("No such website");
  return websites[0];
};

module.exports.findAll = async (searchValue) => {
  let websites = await Website.find({});
  if (!websites) throw Error("Invalid websites");
  if (searchValue) {
    websites = websites.filter((w) => {
      return w.url.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return websites;
};

module.exports.saveOne = async (url, category) => {
  if (!url || url.length === 0) throw Error("Invalid url");
  if (!category || category.length === 0) throw Error("Invalid category");
  const website = await Website.create({ url, category });
  if (!website) throw Error("Creating website failed");
  return website;
};

module.exports.updateOne = async (websiteId, websiteObj) => {
  if (!websiteId || !mongoose.Types.ObjectId.isValid(websiteId)) throw Error("Invalid website id");
  const website = await Website.findByIdAndUpdate(websiteId, { ...websiteObj }, { new: true });
  if (!website) throw Error("Updating website failed");
  return website;
};

module.exports.deleteOne = async (websiteId) => {
  if (!websiteId || !mongoose.Types.ObjectId.isValid(websiteId)) throw Error("Invalid website id");
  const website = await Website.findByIdAndDelete(websiteId);
  if (!website) throw Error("Deleting website failed");
  return website;
};

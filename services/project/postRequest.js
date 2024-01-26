const Post = require("../../models/project/PostRequest");
const mongoose = require("mongoose");

module.exports.findOne = async (postId) => {
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) throw Error("Invalid post id");
  const posts = await Post.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(postId) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "websites",
        localField: "website",
        foreignField: "_id",
        as: "website",
      },
    },
    {
      $unwind: "$website",
    },
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
    {
      $lookup: {
        from: "clientlinks",
        localField: "clientPaidLink",
        foreignField: "_id",
        as: "clientPaidLink",
      },
    },
    {
      $unwind: "$clientPaidLink",
    },
    {
      $project: {
        "editor.password": 0,
        "copywriter.password": 0,
      },
    },
  ]);
  if (!posts[0]) throw Error("No such post");
  return posts[0];
};

module.exports.findAll = async (searchValue) => {
  let posts = await Post.find({});
  if (!posts) throw Error("Invalid posts");
  if (searchValue) {
    posts = posts.filter((p) => {
      p.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return posts;
};

module.exports.saveOne = async (postObj) => {
  const post = await Post.create({ ...postObj });
  if (!post) throw Error("Creating post failed");
  return post;
};

module.exports.updateOne = async (userId, userRoles, postId, postObj) => {
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) throw Error("Invalid post id");

  // if editor has a post assigned to them that is waiting for publish, restrict assigning another post to same editor
  if (userRoles.includes("Editor")) {
    const posts = await Post.find({ progressLevel: "pendingPublish", editor: new mongoose.Types.ObjectId(userId) });
    if (posts.length > 0) {
      delete postObj.editor;
    }
  }

  const post = await Post.findByIdAndUpdate(postId, { ...postObj }, { new: true });
  if (!post) throw Error("Updating post failed");
  return post;
};

module.exports.deleteOne = async (postId) => {
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) throw Error("Invalid post id");
  const post = await Post.findByIdAndDelete(postId);
  if (!post) throw Error("Deleting post failed");
  return post;
};

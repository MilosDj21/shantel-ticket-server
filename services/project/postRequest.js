const Post = require("../../models/project/PostRequest");
const mongoose = require("mongoose");

module.exports.findOne = async (postId) => {
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) throw Error("Invalid post id");
  return aggregateFind(postId);
};

module.exports.findAll = async (searchValue) => {
  let posts = await Post.find({});
  if (!posts) throw Error("Invalid posts");
  if (searchValue) {
    posts = posts.filter((p) => {
      return p.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return posts;
};

module.exports.saveOne = async (postObj) => {
  const post = await Post.create({ ...postObj });
  if (!post) throw Error("Creating post failed");
  return aggregateFind(post._id);
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
  return aggregateFind(post._id);
};

module.exports.deleteOne = async (postId) => {
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) throw Error("Invalid post id");
  const post = await Post.findByIdAndDelete(postId);
  if (!post) throw Error("Deleting post failed");
  return post;
};

const aggregateFind = async (postId) => {
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
      $unwind: {
        path: "$website",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "posttasks",
        localField: "_id",
        foreignField: "post",
        as: "tasks",
        pipeline: [
          {
            $lookup: {
              from: "posttaskgroups",
              localField: "group",
              foreignField: "_id",
              as: "group",
            },
          },
          {
            $unwind: {
              path: "$group",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
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
      $unwind: {
        path: "$editor",
        preserveNullAndEmptyArrays: true,
      },
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
      $unwind: {
        path: "$copywriter",
        preserveNullAndEmptyArrays: true,
      },
    },
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
    {
      $project: {
        "editor.password": 0,
        "editor.secret": 0,
        "copywriter.password": 0,
        "copywriter.secret": 0,
      },
    },
  ]);
  if (!posts[0]) throw Error("No such post");
  return posts[0];
};

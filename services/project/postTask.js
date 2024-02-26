const PostTask = require("../../models/project/PostTask");
const mongoose = require("mongoose");

module.exports.findOne = async (taskId) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) throw Error("Invalid task id");
  return aggregateFind(taskId);
};

module.exports.findAll = async (searchValue) => {
  const tasks = await PostTask.aggregate([
    {
      $lookup: {
        from: "postrequests",
        localField: "post",
        foreignField: "_id",
        as: "post",
      },
    },
    {
      $unwind: {
        path: "$post",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
  if (searchValue) {
    tasks = tasks.filter((t) => {
      return t.post.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return tasks;
};

module.exports.saveOne = async (taskObject) => {
  const task = await PostTask.create({ ...taskObject, status: "New" });
  if (!task) throw Error("Saving task failed");
  return aggregateFind(task._id);
};

module.exports.updateOne = async (taskId, taskObject) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) throw Error("Invalid task id");
  const task = await PostTask.findByIdAndUpdate(taskId, { ...taskObject }, { new: true });
  if (!task) throw Error("Updating task failed");
  return task;
};

module.exports.deleteOne = async (taskId) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) throw Error("Invalid task id");
  const task = await PostTask.findByIdAndDelete(taskId);
  if (!task) throw Error("Deleting task failed");
  return task;
};

const aggregateFind = async (taskId) => {
  const tasks = await PostTask.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(taskId) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "users",
        localField: "assignedUser",
        foreignField: "_id",
        as: "assignedUser",
      },
    },
    {
      $unwind: {
        path: "$assignedUser",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "posttaskmessages",
        localField: "_id",
        foreignField: "task",
        as: "messages",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "postrequests",
        localField: "post",
        foreignField: "_id",
        as: "post",
        pipeline: [
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
              from: "clientlinks",
              localField: "clientLink",
              foreignField: "_id",
              as: "clientLink",
              pipeline: [
                {
                  $lookup: {
                    from: "clientwebsites",
                    localField: "clientWebsite",
                    foreignField: "_id",
                    as: "clientWebsite",
                    pipeline: [
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
                    ],
                  },
                },
                {
                  $unwind: {
                    path: "$clientWebsite",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$clientLink",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$post",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "postgroups",
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
    {
      $project: {
        "assignedUser.password": 0,
        "assignedUser.secret": 0,
        "messages.user.password": 0,
        "messages.user.secret": 0,
      },
    },
  ]);
  if (!tasks[0]) throw Error("No such task");
  return tasks[0];
};

const ProjectTask = require("../../models/project/ProjectTask");
const mongoose = require("mongoose");

module.exports.adminFindOne = async (taskId) => {
  if (!taskId || mongoose.Types.ObjectId.isValid(taskId)) throw Error("Invalid task id");
  const tasks = await ProjectTask.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(taskId) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "users",
        localField: "assignedUsers",
        foreignField: "_id",
        as: "assignedUsers",
      },
    },
    {
      $lookup: {
        from: "projettaskmessages",
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
            $unwind: "$user",
          },
        ],
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
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
            $unwind: "$user",
          },
        ],
      },
    },
    {
      $unwind: "$project",
    },
    {
      $lookup: {
        from: "projectgroups",
        localField: "group",
        foreignField: "_id",
        as: "group",
      },
    },
    {
      $unwind: "$group",
    },
    {
      $project: {
        "assignedUsers.password": 0,
        "assignedUsers.secret": 0,
        "messages.user.password": 0,
        "messages.user.secret": 0,
        "project.user.password": 0,
        "project.user.secret": 0,
      },
    },
  ]);
  if (!tasks[0]) throw Error("No such task");
  return tasks[0];
};

module.exports.adminFindAll = async (searchValue) => {
  const tasks = await ProjectTask.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "assignedUsers",
        foreignField: "_id",
        as: "assignedUsers",
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
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
            $unwind: "$user",
          },
        ],
      },
    },
    {
      $unwind: "$project",
    },
    {
      $project: {
        "assignedUsers.password": 0,
        "assignedUsers.secret": 0,
        "project.user.password": 0,
        "project.user.secret": 0,
      },
    },
  ]);
  if (searchValue) {
    tasks = tasks.filter((t) => {
      t.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return tasks;
};
module.exports.adminUpdateOne = async (taskId, taskObject) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) throw Error("Invalid task id");
  const task = await ProjectTask.findByIdAndUpdate(taskId, { ...taskObject }, { new: true });
  if (!task) throw Error("Updating task failed");
  return task;
};
module.exports.adminDeleteOne = async (taskId) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) throw Error("Invalid task id");
  const task = await ProjectTask.findByIdAndDelete(taskId);
  if (!task) throw Error("Deleting task failed");
  return task;
};

module.exports.userFindOne = async (userId, taskId) => {
  if (!taskId || mongoose.Types.ObjectId.isValid(taskId)) throw Error("Invalid task id");
  const tasks = await ProjectTask.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(taskId) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "users",
        localField: "assignedUsers",
        foreignField: "_id",
        as: "assignedUsers",
      },
    },
    {
      $lookup: {
        from: "projettaskmessages",
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
            $unwind: "$user",
          },
        ],
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
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
            $unwind: "$user",
          },
        ],
      },
    },
    {
      $unwind: "$project",
    },
    {
      $lookup: {
        from: "projectgroups",
        localField: "group",
        foreignField: "_id",
        as: "group",
      },
    },
    {
      $unwind: "$group",
    },
    {
      $project: {
        "assignedUsers.password": 0,
        "assignedUsers.secret": 0,
        "messages.user.password": 0,
        "messages.user.secret": 0,
        "project.user.password": 0,
        "project.user.secret": 0,
      },
    },
  ]);
  if (!tasks[0]) throw Error("No such task");

  for (const user of tasks[0].assignedUsers) {
    if (user._id.toString() === userId) return tasks[0];
  }
  throw Error("No such task");
};

module.exports.userFindAll = async (userId, searchValue) => {
  const tasks = await ProjectTask.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "assignedUsers",
        foreignField: "_id",
        as: "assignedUsers",
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
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
            $unwind: "$user",
          },
        ],
      },
    },
    {
      $unwind: "$project",
    },
    {
      $project: {
        "assignedUsers.password": 0,
        "assignedUsers.secret": 0,
        "project.user.password": 0,
        "project.user.secret": 0,
      },
    },
  ]);
  tasks = tasks.filter((task) => {
    for (const user of task.assignedUsers) {
      user._id.toString() === userId;
    }
  });

  if (searchValue) {
    tasks = tasks.filter((t) => {
      t.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return tasks;
};
module.exports.adminUpdateOne = async (taskId, taskObject) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) throw Error("Invalid task id");
  const task = await ProjectTask.findByIdAndUpdate(taskId, { ...taskObject }, { new: true });
  if (!task) throw Error("Updating task failed");
  return task;
};
module.exports.adminDeleteOne = async (taskId) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) throw Error("Invalid task id");
  const task = await ProjectTask.findByIdAndDelete(taskId);
  if (!task) throw Error("Deleting task failed");
  return task;
};

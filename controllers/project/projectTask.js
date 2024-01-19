const ProjectTask = require("../../models/project/ProjectTask");
const mongoose = require("mongoose");

// only admin can access these controllers
module.exports.adminFindOne = async (req, res) => {
  const { taskId } = req.params;
  try {
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
          "messages.user.password": 0,
          "project.user.password": 0,
        },
      },
    ]);
    if (!tasks) throw Error("No such task");
    res.status(200).json({ status: "success", data: tasks[0] });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
module.exports.adminFindAll = async (req, res) => {};
module.exports.adminSaveOne = async (req, res) => {};
module.exports.adminUpdateOne = async (req, res) => {};
module.exports.adminDeleteOne = async (req, res) => {};

// controllers for regular users, for task view
module.exports.taskViewFindOne = async (req, res) => {
  res.status(200).json({ message: "all good task view find one" });
};
module.exports.taskViewFindAll = async (req, res) => {};
module.exports.taskViewSaveOne = async (req, res) => {};
module.exports.taskViewUpdateOne = async (req, res) => {};
module.exports.taskViewDeleteOne = async (req, res) => {};

// controllers for regular users, for project view
module.exports.projectViewFindOne = async (req, res) => {
  res.status(200).json({ message: "all good project view find one" });
};
module.exports.projectViewFindAll = async (req, res) => {};
module.exports.projectViewSaveOne = async (req, res) => {};
module.exports.projectViewUpdateOne = async (req, res) => {};
module.exports.projectViewDeleteOne = async (req, res) => {};

const Project = require("../../models/project/Project");
const mongoose = require("mongoose");

//only admin can access these controllers
module.exports.adminFindOne = async (req, res) => {
  const { projectId } = req.params;
  try {
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Invalid project id");
    const projects = await Project.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
      { $limit: 1 },
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
      {
        $lookup: {
          from: "projecttasks",
          localField: "_id",
          foreignField: "project",
          as: "tasks",
          pipeline: [
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
                from: "projecttaskmessages",
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
                from: "projecttaskgroups",
                localField: "group",
                foreignField: "_id",
                as: "group",
              },
            },
            {
              $unwind: "$group",
            },
          ],
        },
      },
      {
        $project: {
          "user.password": 0,
          "tasks.assignedUsers.password": 0,
          "tasks.messages.user.password": 0,
        },
      },
    ]);
    if (!projects) throw Error("No such project");
    res.status(200).json({ status: "success", data: projects[0] });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.adminFindAll = async (req, res) => {
  const { searchValue } = req.params;
  try {
    let projects = await Project.aggregate([
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
      {
        $project: {
          "user.password": 0,
        },
      },
    ]);
    if (searchValue) {
      projects = projects.filter((p) => {
        p.title.toLowerCase().includes(searchValue.toLowerCase());
      });
    }
    res.status(200).json({ status: "success", data: projects });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// TODO: admin does not need to save new projects, maybe implement later if needed
module.exports.adminSaveOne = async (req, res) => {};

module.exports.adminUpdateOne = async (req, res) => {
  const { projectId } = req.params;
  const { title, status, user } = req.body;
  try {
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Invalid project id");
    const projectObject = {};
    if (title) projectObject.title = title;
    if (status) projectObject.status = status;
    if (user) projectObject.user = user;

    const project = await Project.findByIdAndUpdate(projectId, { ...projectObject }, { new: true });
    if (!project) throw Error("Updating project failed");
    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
module.exports.adminDeleteOne = async (req, res) => {
  const { projectId } = req.params;
  try {
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Invalid project id");
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) throw Error("Deleting project failed");
    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

//controllers for specific user projects
module.exports.findOneByUser = async (req, res) => {
  const { userId, projectId } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Invalid project id");
    const projects = await Project.aggregate([
      { $match: { $and: [{ _id: new mongoose.Types.ObjectId(projectId) }, { user: new mongoose.Types.ObjectId(userId) }] } },
      { $limit: 1 },
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
      {
        $lookup: {
          from: "projecttasks",
          localField: "_id",
          foreignField: "project",
          as: "tasks",
          pipeline: [
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
                from: "projecttaskmessages",
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
                from: "projecttaskgroups",
                localField: "group",
                foreignField: "_id",
                as: "group",
              },
            },
            {
              $unwind: "$group",
            },
          ],
        },
      },
      {
        $project: {
          "user.password": 0,
          "tasks.assignedUsers.password": 0,
          "tasks.messages.user.password": 0,
        },
      },
    ]);
    if (!projects) throw Error("Invalid project");
    res.status(200).json({ status: "success", data: projects[0] });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAllByUser = async (req, res) => {
  const { userId, searchValue } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    let projects = await Project.find({ user: new mongoose.Types.ObjectId(userId) });
    if (searchValue) {
      projects = projects.filter((p) => {
        p.title.toLowerCase().includes(searchValue.toLowerCase());
      });
    }
    res.status(200).json({ status: "success", data: projects });
  } catch (error) {
    res.status(200).json({ status: "failed", message: error.message });
  }
};
module.exports.saveOneByUser = async (req, res) => {
  const { userId } = req.params;
  const { title } = req.body;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    if (!title) throw Error("All fields must be filled");
    const project = await Project.create({ title: title, status: "New", user: userId });
    if (!project) throw Error("Creating project failed");
    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
module.exports.updateOneByUser = async (req, res) => {
  const { userId, projectId } = req.params;
  const { title, status } = req.body;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("User id invalid");
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Project id invalid");
    const projectObject = {};
    if (title) projectObject.title = title;
    if (status) projectObject.status = status;

    const project = await Project.findByIdAndUpdate(projectId, { ...projectObject }, { new: true });
    if (!project) throw Error("Updating project failed");
    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

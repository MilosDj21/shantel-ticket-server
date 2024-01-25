const Project = require("../../models/project/Project");
const mongoose = require("mongoose");

module.exports.adminFindOne = async (projectId) => {
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
      $lookup: {
        from: "postrequests",
        localField: "_id",
        foreignField: "project",
        as: "postRequests",
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
                  $unwind: "$client",
                },
              ],
            },
          },
          {
            $unwind: "$clientPaidLink",
          },
        ],
      },
    },
    {
      $project: {
        "user.password": 0,
        "tasks.assignedUsers.password": 0,
        "tasks.messages.user.password": 0,
        "postRequests.editor.password": 0,
        "postRequests.copywriter.password": 0,
      },
    },
  ]);
  if (!projects[0]) throw Error("No such project");
  return projects[0];
};

module.exports.adminFindAll = async (searchValue) => {
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
  return projects;
};

module.exports.adminUpdateOne = async (projectId, projectObject) => {
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Invalid project id");
  const project = await Project.findByIdAndUpdate(projectId, { ...projectObject }, { new: true });
  if (!project) throw Error("Updating project failed");
  return project;
};

module.exports.adminDeleteOne = async (projectId) => {
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Invalid project id");
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) throw Error("Deleting project failed");
  return project;
};

module.exports.userFindOne = async (userId, projectId) => {
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
      $lookup: {
        from: "postrequests",
        localField: "_id",
        foreignField: "project",
        as: "postRequests",
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
                  $unwind: "$client",
                },
              ],
            },
          },
          {
            $unwind: "$clientPaidLink",
          },
        ],
      },
    },
    {
      $project: {
        "user.password": 0,
        "tasks.assignedUsers.password": 0,
        "tasks.messages.user.password": 0,
        "postRequests.editor.password": 0,
        "postRequests.copywriter.password": 0,
      },
    },
  ]);
  if (!projects[0]) throw Error("No such project");
  return projects[0];
};

module.exports.userFindAll = async (userId, searchValue) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
  let projects = await Project.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
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
  return projects;
};

module.exports.userSaveOne = async (userId, title) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
  if (!title) throw Error("All fields must be filled");
  const project = await Project.create({ title: title, status: "New", user: userId });
  if (!project) throw Error("Creating project failed");
  return project;
};

module.exports.userUpdateOne = async (userId, projectId, projectObject) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("User id invalid");
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Project id invalid");

  const foundProject = await Project.find({ _id: new mongoose.Types.ObjectId(projectId), user: mongoose.Types.ObjectId(userId) });
  if (!foundProject) throw Error("No such project");

  const project = await Project.findByIdAndUpdate(projectId, { ...projectObject }, { new: true });
  if (!project) throw Error("Updating project failed");
};

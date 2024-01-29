const Project = require("../../models/project/Project");
const mongoose = require("mongoose");

module.exports.findOne = async (userId, projectId) => {
  if (userId && !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Invalid project id");

  let matchObject;
  if (userId) {
    matchObject = { $match: { $and: [{ _id: new mongoose.Types.ObjectId(projectId) }, { user: new mongoose.Types.ObjectId(userId) }] } };
  } else {
    matchObject = { $match: { _id: new mongoose.Types.ObjectId(projectId) } };
  }

  const projects = await Project.aggregate([
    matchObject,
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
        "user.secret": 0,
        "tasks.assignedUsers.password": 0,
        "tasks.assignedUsers.secret": 0,
        "tasks.messages.user.password": 0,
        "tasks.messages.user.secret": 0,
        "postRequests.editor.password": 0,
        "postRequests.editor.secret": 0,
        "postRequests.copywriter.password": 0,
        "postRequests.copywriter.secret": 0,
      },
    },
  ]);
  if (!projects[0]) throw Error("No such project");
  return projects[0];
};

module.exports.findAll = async (userId, searchValue) => {
  if (userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
  const aggregatePipeline = [];
  if (userId) {
    aggregatePipeline.push({ $match: { user: new mongoose.Types.ObjectId(userId) } });
  }
  aggregatePipeline.push(
    ...[
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
          "user.secret": 0,
        },
      },
    ]
  );
  let projects = await Project.aggregate(aggregatePipeline);
  if (searchValue) {
    projects = projects.filter((p) => {
      p.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return projects;
};

module.exports.saveOne = async (userId, title) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
  if (!title) throw Error("All fields must be filled");
  const project = await Project.create({ title: title, status: "New", user: userId });
  if (!project) throw Error("Creating project failed");
  return project;
};

module.exports.updateOne = async (userId, projectId, projectObject) => {
  if (userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("User id invalid");
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Project id invalid");

  if (userId) {
    const foundProject = await Project.find({ _id: new mongoose.Types.ObjectId(projectId), user: new mongoose.Types.ObjectId(userId) });
    if (!foundProject) throw Error("No such project");
  }

  const project = await Project.findByIdAndUpdate(projectId, { ...projectObject }, { new: true });
  if (!project) throw Error("Updating project failed");

  return project;
};

module.exports.deleteOne = async (projectId) => {
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) throw Error("Invalid project id");
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) throw Error("Deleting project failed");
  return project;
};

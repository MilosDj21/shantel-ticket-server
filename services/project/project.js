const Project = require("../../models/project/Project");
const mongoose = require("mongoose");

module.exports.findOne = async (projectId, userId = null) => {
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
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "posttaskgroups",
        localField: "_id",
        foreignField: "project",
        as: "groups",
        pipeline: [
          {
            $lookup: {
              from: "posttasks",
              localField: "_id",
              foreignField: "group",
              as: "tasks",
              pipeline: [
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
              ],
            },
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
              path: "$clientPaidLink",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $project: {
        "user.password": 0,
        "user.secret": 0,
        "postRequests.editor.password": 0,
        "postRequests.editor.secret": 0,
        "postRequests.copywriter.password": 0,
        "postRequests.copywriter.secret": 0,
        "postRequests.tasks.assignedUser.password": 0,
        "postRequests.tasks.assignedUser.secret": 0,
        "postRequests.tasks.messages.user.password": 0,
        "postRequests.tasks.messages.user.secret": 0,
      },
    },
  ]);
  if (!projects[0]) throw Error("No such project");
  return projects[0];
};

module.exports.findAll = async (userId, searchValue) => {
  if (userId && !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
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
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
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
      // TODO: dodaj da moze da se filtrira po linku od klijenta koji je u projektu
      return p.title.toLowerCase().includes(searchValue.toLowerCase());
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

module.exports.updateOne = async (projectId, projectObject, userId = null) => {
  if (userId && !mongoose.Types.ObjectId.isValid(userId)) throw Error("User id invalid");
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

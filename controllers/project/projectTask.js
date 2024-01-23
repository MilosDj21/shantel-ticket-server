const { adminFindOne, adminFindAll, adminUpdateOne, adminDeleteOne, userFindOne, userFindAll, userSaveOne, userUpdateOne, userDeleteOne } = require("../../services/project/project");

module.exports.findOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { taskId } = req.params;
  let task;
  try {
    if (userIsAdmin) {
      task = await adminFindOne(taskId);
    } else {
      task = await userFindOne(userId, taskId);
    }
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { searchValue } = req.params;
  let tasks;
  try {
    if (userIsAdmin) {
      tasks = await adminFindAll(searchValue);
    } else {
      tasks = await userFindAll(userId, searchValue);
    }
    res.status(200).json({ status: "success", data: tasks });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { title, dueTime, assignedUsers, project, group } = req.body;
  try {
    const taskObject = {};
    if (title) taskObject.title = title;
    if (dueTime) taskObject.dueTime = dueTime;
    if (assignedUsers) taskObject.assignedUsers = assignedUsers;
    if (project) taskObject.project = project;
    if (group) taskObject.group = group;
    // there is no difference between user and admin creating task, so only one function exists for this job
    const task = await userSaveOne(userId, taskObject);
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { taskId } = req.params;
  const { title, status, dueTime, assignedUsers, project, group } = req.body;
  let task;
  try {
    const taskObject = {};
    if (title) taskObject.title = title;
    if (status) taskObject.status = status;
    if (dueTime) taskObject.dueTime = dueTime;
    if (assignedUsers) taskObject.assignedUsers = assignedUsers;
    if (project) taskObject.project = project;
    if (group) taskObject.group = group;

    if (userIsAdmin) {
      task = await adminUpdateOne(taskId, taskObject);
    } else {
      task = await userUpdateOne(userId, taskId, taskObject);
    }
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { userIsAdmin } = req;
  const { taskId } = req.params;
  let task;
  try {
    if (userIsAdmin) {
      task = await adminDeleteOne(taskId);
    } else {
      throw Error("Only admin can access this");
    }
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../services/project/postTask");

module.exports.findOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { taskId } = req.params;
  try {
    const task = await findOne(taskId);
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { searchValue } = req.params;
  try {
    const tasks = await findAll(searchValue);
    res.status(200).json({ status: "success", data: tasks });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { dueTime, assignedUser, post, group } = req.body;
  try {
    const taskObject = {};
    if (dueTime) taskObject.dueTime = dueTime;
    if (assignedUser) taskObject.assignedUser = assignedUser;
    if (post) taskObject.post = post;
    if (group) taskObject.group = group;
    const task = await saveOne(taskObject);
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { taskId } = req.params;
  const { status, dueTime, assignedUser, post, group } = req.body;
  try {
    const taskObject = {};
    if (status) taskObject.status = status;
    if (dueTime) taskObject.dueTime = dueTime;
    if (assignedUser) taskObject.assignedUser = assignedUser;
    if (post) taskObject.post = post;
    if (group) taskObject.group = group;
    const task = await updateOne(taskId, taskObject);
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { userIsAdmin } = req;
  const { taskId } = req.params;
  try {
    if (!userIsAdmin) throw Error("Only admin can access this");
    const task = await deleteOne(taskId);
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

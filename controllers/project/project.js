const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../services/project/project");

module.exports.findOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { projectId } = req.params;
  let project;
  try {
    if (userIsAdmin) {
      project = await findOne(projectId);
    } else {
      project = await findOne(projectId, userId);
    }
    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { searchValue } = req.params;
  let projects;
  try {
    if (userIsAdmin) {
      projects = await findAll(null, searchValue);
    } else {
      projects = await findAll(userId, searchValue);
    }
    res.status(200).json({ status: "success", data: projects });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { title } = req.body;
  try {
    const project = await saveOne(userId, title);
    res.status(200).json({ status: "success", data: project, message: "Project saved successfully" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { projectId } = req.params;
  const { title, status, user } = req.body;
  let project;
  try {
    const projectObject = {};
    if (title) projectObject.title = title;
    if (status) projectObject.status = status;
    if (user) projectObject.user = user;

    if (userIsAdmin) {
      project = await updateOne(projectId, projectObject);
    } else {
      project = await updateOne(projectId, projectObject, userId);
    }
    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { userIsAdmin } = req;
  const { projectId } = req.params;
  let project;
  try {
    if (userIsAdmin) {
      project = await deleteOne(projectId);
    } else {
      throw Error("Only admin can access this");
    }
    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

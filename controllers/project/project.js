const { adminFindOne, adminFindAll, adminUpdateOne, adminDeleteOne, userFindOne, userFindAll, userSaveOne, userUpdateOne, userDeleteOne } = require("../../services/project/project");

module.exports.findOne = async (req, res) => {
  const { userId, userIsAdmin } = req;
  const { projectId } = req.params;
  let project;
  try {
    if (userIsAdmin) {
      project = await adminFindOne(projectId);
    } else {
      project = await userFindOne(userId, projectId);
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
      projects = await adminFindAll(searchValue);
    } else {
      projects = await userFindAll(userId, searchValue);
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
    // TODO: admin does not need to save new projects, maybe implement later if needed
    const project = await userSaveOne(userId, title);
    res.status(200).json({ status: "success", data: project });
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
      project = await adminUpdateOne(projectId, projectObject);
    } else {
      project = await userUpdateOne(userId, projectId, projectObject);
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
      project = await adminDeleteOne(projectId);
    } else {
      throw Error("Only admin can access this");
    }
    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
